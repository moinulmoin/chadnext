import { GitBranch, Rocket, Wrench } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const personas = [
  {
    icon: Rocket,
    title: "The indie hacker",
    description:
      "Shipping an AI tool this weekend. You get the whole job loop — queue, artifact, metering, quota, upgrade CTA — so the only thing left to build is your actual idea.",
  },
  {
    icon: Wrench,
    title: "The consultant",
    description:
      "Automating client work. Swap the demo Runs entity for invoices, imports, or reports by following the Swap-the-Noun recipe in AGENTS.md — one agent session, not a rewrite.",
  },
  {
    icon: GitBranch,
    title: "The OSS maintainer",
    description:
      "Adding a paid tier to a free project. Polar handles checkout, VAT, and webhooks as merchant of record; fixed Free/Pro tiers are enforced server-side from one config file.",
  },
];

export function BuiltForSection() {
  return (
    <section className="container py-24 sm:py-32">
      <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Built for
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          No fake quotes here — just the three builders this template was
          designed for.
        </p>
      </Reveal>

      <Reveal className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.title} className="flex flex-col h-full">
            <CardHeader className="gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border bg-primary/5">
                <persona.icon className="size-4.5 text-primary" />
              </div>
              <CardTitle className="text-base">{persona.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{persona.description}</p>
            </CardContent>
          </Card>
        ))}
      </Reveal>
    </section>
  );
}
