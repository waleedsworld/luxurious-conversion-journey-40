import { useTheme } from "next-themes";
import { TypewriterText } from "./TypewriterText";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  messages: string[];
}

export const LoadingScreen = ({ messages }: LoadingScreenProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col gap-8 animate-fade-in">
      <Loader2 className="h-12 w-12 animate-spin text-secondary-DEFAULT" />
      <div className="h-12 text-xl font-medium">
        <TypewriterText words={messages} delay={3000} />
      </div>
    </div>
  );
};