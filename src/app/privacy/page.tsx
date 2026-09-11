import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/header/navbar";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data.`,
};

/**
 * Template placeholder — replace with your own privacy policy before
 * production use.
 */
export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="container max-w-2xl py-16">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: September 2026 · Template — replace with your own
            policy before going to production.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-6 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                What we collect
              </h2>
              <p className="mt-2">
                This template stores the account information you sign up with
                (name, email, profile image) and the content you create while
                using the app, such as runs and chat messages with the
                assistant. Usage data — token counts and run statistics — is
                kept to power your dashboard and enforce plan limits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Third-party services
              </h2>
              <p className="mt-2">
                Depending on how the template is configured, data may be
                processed by third parties: Convex (database and backend),
                Vercel (hosting), Polar (payments and merchant of record),
                Resend (transactional email), and PostHog (product analytics
                and error tracking, only if enabled). Each service processes
                data under its own privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Your choices
              </h2>
              <p className="mt-2">
                You can update your profile from the settings page and request
                deletion of your account and associated data by contacting the
                site owner. Analytics are loaded only when an analytics key is
                configured by the operator of this deployment.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
