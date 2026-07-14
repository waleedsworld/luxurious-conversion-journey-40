import { MessageSquare, CreditCard, Rocket } from "lucide-react";
import { handleAction } from "@/utils/actionHandler";

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Us Your Idea",
    description:
      "Share what your website is about and what you want it to achieve. A few sentences is all it takes to get started.",
  },
  {
    icon: CreditCard,
    title: "Secure Your Spot for $15",
    description:
      "One flat, honest price. No hidden fees, no surprise add-ons — just a single payment to kick things off.",
  },
  {
    icon: Rocket,
    title: "We Build & Launch",
    description:
      "Sit back while we design, build, and deploy your site. Free hosting and revisions are included, every time.",
  },
];

export const HowItWorks = () => {
  return (
    <div
      className="py-20 bg-background"
      onMouseEnter={() => handleAction("hover", { element: "how_it_works_section" })}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          How It Works
        </h2>
        <p className="text-center text-foreground/70 mb-12 text-lg max-w-2xl mx-auto">
          From idea to live website in three simple steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-muted hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-secondary-DEFAULT text-black font-bold text-sm">
                {index + 1}
              </span>
              <step.icon className="w-10 h-10 text-secondary-DEFAULT mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
