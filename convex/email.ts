import { Resend } from "@convex-dev/resend";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";

/**
 * Email triggers (Resend via the @convex-dev/resend component).
 *
 * Convex functions cannot render JSX/react-email components, so the HTML here
 * is built from plain string templates ported from the emails/*.tsx React
 * Email files (same copy + branding). Keep the react-email templates in
 * emails/ in sync — they exist for future Next-side rendering.
 *
 * Zero-config rule: every send is skipped silently (debug log) when
 * RESEND_API_KEY is missing. Production sends also require flipping the
 * component's `testMode` to false (see the component README).
 */

export const resend = new Resend(components.resend, {
  testMode: true,
});

const APP_NAME = "ChadNext";

const FROM_FALLBACK = "ChadNext <onboarding@resend.dev>";

function emailFrom(): string {
  return process.env.RESEND_FROM?.trim() || FROM_FALLBACK;
}

function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

// ---------------------------------------------------------------------------
// Plain-string templates (content ported from emails/*.tsx)
// ---------------------------------------------------------------------------

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const CONTAINER_STYLE = `font-family: ${FONT}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;`;

const CONTENT_STYLE =
  "padding: 40px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;";

function titleStyle(size: number): string {
  return `font-size: ${size}px; font-weight: 600; margin-bottom: 24px; color: #111827;`;
}

const TEXT_STYLE =
  "font-size: 16px; line-height: 24px; margin-bottom: 24px; color: #374151;";

const HEADING_STYLE =
  "font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #111827;";

const FEATURE_TEXT_STYLE =
  "font-size: 16px; line-height: 24px; margin-bottom: 16px; color: #374151;";

const FOOTER_TEXT_STYLE = "font-size: 14px; line-height: 20px; color: #6b7280;";

function p(style: string, html: string): string {
  return `<p style="${style}">${html}</p>`;
}

/** OTP code box (emails/verification.tsx + otp-email.tsx). */
function codeBox(code: string): string {
  return `<div style="background-color: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 8px; padding: 32px; margin-bottom: 32px; text-align: center;"><p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827; margin: 0;">${code}</p></div>`;
}

function page(body: string): string {
  return `<!DOCTYPE html><html><body><div style="${CONTAINER_STYLE}"><div style="${CONTENT_STYLE}">${body}</div></div></body></html>`;
}

function otpEmailHtml(code: string, type: string): string {
  const isLogin = type === "sign-in";
  const title = isLogin ? "Your login code" : "Verify your email address";
  const message = isLogin
    ? `Enter the following code to sign in to ${APP_NAME}:`
    : `Enter the following verification code to complete your sign-in to ${APP_NAME}:`;
  return page(
    p(titleStyle(24), title) +
      p(TEXT_STYLE, message) +
      codeBox(code) +
      p(
        FOOTER_TEXT_STYLE,
        "This code will expire in 10 minutes. If you didn't request this code, please ignore this email.",
      ),
  );
}

function welcomeEmailHtml(name: string | null): string {
  const greeting = name ? `Welcome, ${name}!` : "Welcome!";
  return page(
    p(titleStyle(28), greeting) +
      p(
        TEXT_STYLE,
        `We're excited to have you on board. You've just joined ${APP_NAME}, and we can't wait to see what you'll build.`,
      ) +
      p(HEADING_STYLE, "What's next?") +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>✨ Quick Start:</strong> Jump right in and explore our intuitive interface designed for speed and efficiency.",
      ) +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>🚀 Build Fast:</strong> Submit your first AI run and watch the job loop process it end to end.",
      ) +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>🔒 Stay Secure:</strong> Your data is protected with enterprise-grade security and privacy controls.",
      ) +
      p(
        TEXT_STYLE,
        "If you have any questions or need help getting started, feel free to reach out to our support team.",
      ) +
      p(FOOTER_TEXT_STYLE, `Thanks for being part of ${APP_NAME}!`),
  );
}

function subscriptionEmailHtml(planName: string, name: string | null): string {
  const greeting = name ? `Hi ${name},` : "Hi,";
  return page(
    p(titleStyle(28), `You've been upgraded to ${planName}!`) +
      p(
        TEXT_STYLE,
        `${greeting} Great news! Your ${APP_NAME} account has been successfully upgraded to the ${planName} plan.`,
      ) +
      p(HEADING_STYLE, `Your new ${planName} benefits:`) +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>🚀 Unlimited Access:</strong> No more limits on your runs and usage.",
      ) +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>⚡ Priority Support:</strong> Get faster responses from our dedicated support team.",
      ) +
      p(
        FEATURE_TEXT_STYLE,
        "<strong>📊 Enhanced Analytics:</strong> Deeper insights and reporting capabilities for your data.",
      ) +
      p(
        TEXT_STYLE,
        `Start exploring your new ${planName} features right away. We're here to help you make the most of your upgrade.`,
      ) +
      p(FOOTER_TEXT_STYLE, `Thank you for choosing ${APP_NAME}!`),
  );
}

// ---------------------------------------------------------------------------
// Senders (internal mutations — the component queues durably from any ctx)
// ---------------------------------------------------------------------------

/**
 * OTP code email for better-auth's emailOTP plugin. NOTE: better-auth's
 * `sendVerificationOTP({ email, otp, type })` callback does NOT provide the
 * user id, so `userId` is optional here (it resolves to null for brand-new
 * sign-ups where the users row may not exist yet).
 */
export const sendOtpEmail = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    email: v.string(),
    code: v.string(),
    type: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!emailEnabled()) {
      console.debug(
        `[email] RESEND_API_KEY not set — skipping OTP email to ${args.email}`,
      );
      return null;
    }
    const type = args.type ?? "sign-in";
    await resend.sendEmail(ctx, {
      from: emailFrom(),
      to: args.email,
      subject: `Your ${type} code for ${APP_NAME}`,
      text: `Your ${type} code is ${args.code}. If you did not request this code, you can ignore this email.`,
      html: otpEmailHtml(args.code, type),
    });
    return null;
  },
});

/** Welcome email — triggered by better-auth's user.create databaseHook. */
export const sendWelcomeEmail = internalMutation({
  args: { userId: v.id("users"), name: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!emailEnabled()) {
      console.debug(
        `[email] RESEND_API_KEY not set — skipping welcome email to ${args.email}`,
      );
      return null;
    }
    await resend.sendEmail(ctx, {
      from: emailFrom(),
      to: args.email,
      subject: `Welcome to ${APP_NAME}!`,
      text: `Welcome${args.name ? `, ${args.name}` : ""}! We're excited to have you on board.`,
      html: welcomeEmailHtml(args.name || null),
    });
    return null;
  },
});

/** Subscription active email — triggered from the Polar webhook handler. */
export const sendSubscriptionEmail = internalMutation({
  args: { userId: v.id("users"), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      console.debug(
        `[email] No users row for ${args.userId} — skipping subscription email`,
      );
      return null;
    }
    if (!emailEnabled()) {
      console.debug(
        `[email] RESEND_API_KEY not set — skipping subscription email to ${args.email}`,
      );
      return null;
    }
    await resend.sendEmail(ctx, {
      from: emailFrom(),
      to: args.email,
      subject: `You've been upgraded to Pro!`,
      text: `Your ${APP_NAME} account has been upgraded to the Pro plan.`,
      html: subscriptionEmailHtml("Pro", user.name || null),
    });
    return null;
  },
});
