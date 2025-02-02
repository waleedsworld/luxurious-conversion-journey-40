import { CheckCircle } from "lucide-react";
import { handleAction } from "@/utils/actionHandler";

const benefits = [
  "Professional Design",
  "Fast Development",
  "SEO Optimized",
  "Mobile Responsive",
  "24/7 Support",
  "Secure Hosting",
];

export const Benefits = () => {
  return (
    <div 
      className="py-20 bg-background"
      onMouseEnter={() => handleAction('hover', { element: 'benefits_section' })}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
          onMouseEnter={() => handleAction('hover', { element: 'what_you_get_title' })}
        >
          What You Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-6 rounded-lg bg-muted hover:shadow-lg transition-shadow animate-fade-in dark:hover:shadow-secondary-DEFAULT/5"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => handleAction('hover', { element: `benefit_${benefit.toLowerCase().replace(/\s+/g, '_')}` })}
            >
              <CheckCircle className="w-6 h-6 text-secondary-DEFAULT" />
              <span className="text-lg text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};