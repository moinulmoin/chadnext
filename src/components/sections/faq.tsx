import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is ChadNext?",
    answer: "A free, open-source (MIT) agent-native SaaS starter: Next.js 16, Convex, better-auth, Polar, and the Vercel AI Gateway — pre-wired into a working product. The demo app is an AI runs loop (submit → artifact → metered) plus Sigma, an in-app assistant.",
  },
  {
    question: "What can Sigma actually do?",
    answer: "Sigma is scoped to the signed-in user's data. It answers questions about runs and usage, and it can act — creating, retrying, or deleting runs — but every write pauses at the Confirm Gate until you approve it. Deny, and nothing changes. It also remembers your preferences, and you can inspect them in Settings.",
  },
  {
    question: "Can my AI coding agent build on it?",
    answer: "Yes — that's the point. AGENTS.md is the canonical brief for Claude Code, Cursor, and Codex, with extension recipes like Swap the Noun (retool Runs into your own domain) and Add a Sigma Tool.",
  },
  {
    question: "Does it work without API keys?",
    answer: "Yes. Zero-config boot: with no keys set, runs process via a deterministic mock so the entire loop demos instantly. The AI provider, Polar, Resend, and PostHog integrations are all gracefully optional.",
  },
  {
    question: "What are the plan limits?",
    answer: "Free includes 10 runs per day and 20 Sigma messages per hour. Pro unlocks unlimited runs and 200 messages per hour. Both tiers are fixed monthly prices — usage is metered for display, never billed.",
  },
  {
    question: "How do I deploy it?",
    answer: "Push to a Git repository and import into Vercel — zero-config deploys, with the Vercel AI Gateway authenticating via OIDC. Convex deploys from the CLI. Full instructions live in the docs.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Got questions? We&apos;ve got answers.
        </p>
      </Reveal>

      <Reveal className="mx-auto w-full max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
