import { TypewriterText } from "./TypewriterText";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { WebsiteForm } from "./WebsiteForm";
import { handleAction } from "@/utils/actionHandler";

export const Hero = () => {
  const words = ["Rich", "Famous", "Successful", "Profitable", "Unstoppable"];
  const { theme, setTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const handleThemeChange = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    await handleAction('button_click', { 
      button_id: `theme_toggle_${newTheme}` 
    });
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-DEFAULT to-accent-DEFAULT p-4 relative">
      <button
        onClick={handleThemeChange}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6 text-secondary-DEFAULT" />
        ) : (
          <Moon className="h-6 w-6 text-secondary-DEFAULT" />
        )}
      </button>

      <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground dark:text-white">
          Get <TypewriterText words={words} delay={2000} /> <br />
          Get a website.
        </h1>

        <p className="text-xl md:text-2xl mb-12 text-foreground/80 dark:text-white/80">
          Your professional website is just one click away
        </p>

        <Button
          size="lg"
          onClick={() => {
            handleAction('button_click', { button_id: 'get_website_now' });
            setShowForm(true);
          }}
          className="bg-secondary-DEFAULT text-black dark:text-white hover:bg-secondary-DEFAULT/90 text-lg px-8 py-6 h-auto transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-secondary-DEFAULT/20 animate-pulse"
        >
          Get Your Website Now for 15 USD
        </Button>

        <div className="grid grid-cols-2 gap-4 mt-8">
          {["Start Building", "I Want My Site", "Begin Now", "Get Started"].map((text, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => {
                handleAction('button_click', { button_id: text.toLowerCase().replace(/\s+/g, '_') });
                setShowForm(true);
              }}
              className="border-foreground/20 hover:bg-foreground/10 text-black dark:text-white hover:text-foreground dark:hover:text-white text-lg py-6 transform hover:scale-105 transition-all duration-300 hover:border-foreground/40 hover:shadow-md"
            >
              {text}
            </Button>
          ))}
        </div>
      </div>

      <WebsiteForm open={showForm} onOpenChange={setShowForm} />
    </div>
  );
};