import { render } from "@react-email/components";
import ThanksTemp from "emails/thanks";
import VerificationTemp from "emails/verification";
import { MailtrapClient } from "mailtrap";
import { Resend } from "resend";
import { type SendOTPProps, type SendWelcomeEmailProps } from "~/types";
import { generateId } from "../utils";
import { type ReactElement } from "react";

const FROM = { name: "ChadNext App", email: "chadnext@moinulmoin.com" };

// Email provider is selectable via env, with Resend as the default so existing
// setups keep working with no changes. Set EMAIL_PROVIDER=mailtrap to send through
// Mailtrap instead. Shortcut: USE_MAILTRAP_SANDBOX=true implies the Mailtrap provider
// in Sandbox mode — emails are captured in a test inbox instead of being delivered,
// which is ideal for local development (no spamming real inboxes, no Resend quota use).
const useMailtrapSandbox = process.env.USE_MAILTRAP_SANDBOX === "true";

const SUPPORTED_PROVIDERS = ["resend", "mailtrap"] as const;
type Provider = (typeof SUPPORTED_PROVIDERS)[number];

const resolveProvider = (): Provider => {
  if (useMailtrapSandbox) {
    return "mailtrap";
  }
  const value = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
  if (!SUPPORTED_PROVIDERS.includes(value as Provider)) {
    throw new Error(
      `Unknown EMAIL_PROVIDER "${process.env.EMAIL_PROVIDER}". Supported values: ${SUPPORTED_PROVIDERS.join(", ")}.`
    );
  }
  return value as Provider;
};

const provider = resolveProvider();

type Email = {
  toMail: string;
  subject: string;
  template: ReactElement;
};

// Both clients are instantiated lazily and memoized, so selecting one provider never
// requires the other's credentials (the Resend constructor throws without a key, and
// Mailtrap requires a token).
let resendClient: Resend | null = null;
const getResendClient = () => {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

let mailtrapClient: MailtrapClient | null = null;
const getMailtrapClient = () => {
  if (mailtrapClient) {
    return mailtrapClient;
  }

  const token = process.env.MAILTRAP_API_TOKEN;
  if (!token) {
    throw new Error(
      "Mailtrap is selected but MAILTRAP_API_TOKEN is missing. Set it in your .env, or switch EMAIL_PROVIDER back to resend."
    );
  }

  if (useMailtrapSandbox) {
    const inboxId = process.env.MAILTRAP_INBOX_ID;
    if (!inboxId) {
      throw new Error(
        "USE_MAILTRAP_SANDBOX is true but MAILTRAP_INBOX_ID is missing. Set it in your .env or unset USE_MAILTRAP_SANDBOX."
      );
    }
    mailtrapClient = new MailtrapClient({
      token,
      sandbox: true,
      testInboxId: Number(inboxId),
    });
  } else {
    mailtrapClient = new MailtrapClient({ token });
  }

  return mailtrapClient;
};

const sendWithResend = async ({ toMail, subject, template }: Email) => {
  await getResendClient().emails.send({
    from: `${FROM.name} <${FROM.email}>`,
    to: toMail,
    subject,
    headers: {
      "X-Entity-Ref-ID": generateId(),
    },
    react: template,
    text: "",
  });
};

const sendWithMailtrap = async ({ toMail, subject, template }: Email) => {
  const html = await render(template);

  await getMailtrapClient().send({
    from: FROM,
    to: [{ email: toMail }],
    subject,
    html,
  });
};

const deliver = async (email: Email) => {
  if (provider === "mailtrap") {
    await sendWithMailtrap(email);
    return;
  }

  await sendWithResend(email);
};

export const sendWelcomeEmail = async ({
  toMail,
  userName,
}: SendWelcomeEmailProps) => {
  await deliver({
    toMail,
    subject: "Thanks for using ChadNext!",
    template: ThanksTemp({ userName }) as ReactElement,
  });
};

export const sendOTP = async ({ toMail, code, userName }: SendOTPProps) => {
  await deliver({
    toMail,
    subject: "OTP for ChadNext",
    template: VerificationTemp({ userName, code }) as ReactElement,
  });
};
