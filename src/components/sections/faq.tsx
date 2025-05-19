import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

// Placeholder data - replace with actual FAQs
const faqItems: FAQItem[] = [
  {
    question: "Is it easy to integrate?",
    answer:
      "Yes, integration is straightforward with our comprehensive documentation.",
  },
  {
    question: "What is the pricing model?",
    answer:
      "We offer various tiers, including a free plan. Check our pricing section for details.",
  },
  {
    question: "Can I customize the appearance?",
    answer:
      "Absolutely! The components are built with Tailwind CSS, making customization easy.",
  },
  {
    question: "Do you offer support?",
    answer:
      "Yes, we provide email support for all plans and priority support for premium tiers.",
  },
];

export default function FAQ() {
  return (
    <section className="container py-12 md:py-24">
      <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
