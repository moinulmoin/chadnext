import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/header/navbar";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to your use of ${siteConfig.name}.`,
};

/**
 * Template placeholder — replace with your own terms of service before
 * production use.
 */
export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="container max-w-2xl py-16">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: September 2026 · Template — replace with your own
            terms before going to production.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-6 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Using the service
              </h2>
              <p className="mt-2">
                This template provides an application scaffold that includes
                AI features, an in-app assistant, and subscription billing. By
                creating an account you agree to use the service lawfully and
                not to abuse, overload, or attempt to disrupt it or the
                accounts of other users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Accounts, plans, and billing
              </h2>
              <p className="mt-2">
                Paid plans (if configured by the operator) are billed through
                Polar as merchant of record, which handles payments, taxes,
                and invoices. You can manage or cancel your subscription at
                any time from the billing page; cancellations take effect at
                the end of the billing period.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Disclaimer
              </h2>
              <p className="mt-2">
                The service is provided &quot;as is&quot; without warranties
                of any kind. AI-generated output may be inaccurate and should
                be reviewed before use. To the maximum extent permitted by
                law, the operators of this deployment are not liable for
                damages arising from your use of the service.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
