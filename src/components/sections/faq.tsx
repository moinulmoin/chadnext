import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is ChadNext?",
    answer: "ChadNext is a production-ready starter template for Next.js applications, pre-configured with the best tools in the ecosystem like Tailwind CSS, Shadcn UI, and more.",
  },
  {
    question: "How do I deploy my project?",
    answer: "Deploying is seamless with Vercel. Simply push your code to a Git repository and import it into Vercel. Zero configuration is required for most projects.",
  },
  {
    question: "Is it free to use?",
    answer: "Yes, the template itself is open source and free to use. However, some third-party services integrated (like Convex or OpenAI) may have their own pricing tiers.",
  },
  {
    question: "Can I use a different database?",
    answer: "ChadNext is opinionated and comes with Convex pre-configured. However, you can strip it out and replace it with any database of your choice, such as PostgreSQL or MongoDB.",
  },
  {
    question: "How do I customize the theme?",
    answer: "The project uses Tailwind CSS variables for theming. You can easily customize the colors and styles in the globals.css file to match your brand.",
  },
  {
    question: "Do you offer support?",
    answer: "Community support is available via GitHub Issues. For priority support and dedicated help, consider upgrading to the Pro tier.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Got questions? We've got answers.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto w-full">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
