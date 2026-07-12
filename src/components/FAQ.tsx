import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { handleAction } from "@/utils/actionHandler";

// Objection-handling FAQ. The single biggest drop-off on a "$15 website"
// landing page is disbelief ("what's the catch?"), so these entries answer
// the questions people would otherwise take to WhatsApp before converting.
const faqs = [
  {
    question: "Is it really just $15? What's the catch?",
    answer:
      "There's no catch. $15 is a single, flat payment that covers the full build — design, development and launch. Hosting and revisions are included, so you never pay a surprise fee later.",
  },
  {
    question: "How long does it take to get my website live?",
    answer:
      "Most sites go from idea to live in a matter of days. Once you share your idea and secure your spot, we start building right away and keep you posted through WhatsApp.",
  },
  {
    question: "Do I own the website once it's built?",
    answer:
      "Yes. The finished site is yours. You get everything you need to keep it running, and we host it for free so you don't have to worry about the technical side.",
  },
  {
    question: "What if I want changes after it's built?",
    answer:
      "Every package includes 5 free revisions, so you can fine-tune copy, colours and layout until it feels right. Need something bigger later? Just message us.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. Payments are processed through Ziina's secure checkout — we never see or store your card details.",
  },
];

export const FAQ = () => {
  return (
    <div
      className="py-20 bg-background"
      onMouseEnter={() => handleAction("hover", { element: "faq_section" })}
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-foreground/70 mb-12 text-lg">
          Everything you need to know before getting started.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger
                className="text-left text-foreground text-lg"
                // Track which questions people open — a strong signal of the
                // objection that's holding a given visitor back.
                onClick={() =>
                  handleAction("link_click", { link_id: `faq_${index}` })
                }
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
