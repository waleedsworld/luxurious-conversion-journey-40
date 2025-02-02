import { useState, useEffect, useRef } from "react";
import { Loader2, Send, ExternalLink, Check } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TypewriterText } from "./TypewriterText";
import { toast } from "./ui/use-toast";
import { handleAction } from "@/utils/actionHandler";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { getThemePreview } from "@/utils/themePreview";
import { useIsMobile } from "@/hooks/use-mobile";
import { createPaymentIntent } from "@/services/payment";

interface ChatInterfaceProps {
  formData: {
    websiteName: string;
    websiteDescription: string;
    category: string;
    goal: string;
    traffic: string;
  };
}

interface Message {
  id: number;
  text: string;
  sender: "developer" | "user";
  isTyping?: boolean;
  isLink?: boolean;
}

export const ChatInterface = ({ formData }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [canType, setCanType] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update

  const handleExampleClick = async () => {
    await handleAction('link_click', { link_id: 'example_website' });
    toast({
      title: "Example Website",
      description: "Opening example website preview...",
    });
    const urlToOpen = previewUrl || 'example.com';
    window.open(urlToOpen, '_blank');
  };

  const redirectToWhatsApp = async (message: string) => {
    await handleAction('button_click', { button_id: 'whatsapp_redirect' });
    const baseUrl = "https://api.whatsapp.com/send/?phone=923461115757";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${baseUrl}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const addMessage = async (text: string, sender: "developer" | "user", delay: number, isLink: boolean = false) => {
    if (sender === "user") {
      await handleAction('text_input', { text });
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text,
          sender,
          isLink
        }]);
        resolve();
      }, delay);
    });
  };

  useEffect(() => {
    const initializeChat = async () => {
      const hasFormData = Object.values(formData).some(value => value && value.trim() !== '');
      
      if (hasFormData) {
        const selectedOptionsMessage = [
          "Here are my website requirements:",
          formData.websiteName ? `Website Name: ${formData.websiteName}` : null,
          formData.websiteDescription ? `Description: ${formData.websiteDescription}` : null,
          formData.category ? `Category: ${formData.category}` : null,
          formData.goal ? `Goal: ${formData.goal}` : null,
          formData.traffic ? `Expected Traffic: ${formData.traffic}` : null
        ]
        .filter(Boolean)
        .join('\n');

        if (selectedOptionsMessage !== "Here are my website requirements:") {
          await addMessage(selectedOptionsMessage, "user", 1000);
        }
      }

      setIsTyping(true);
      await addMessage("Assalamualaikum, I'm on the project.", "developer", 2000);
      await addMessage("We've made over thousands of websites!", "developer", 2000);
      setIsTyping(false);

      setIsTyping(true);
      await addMessage(
        "Wait, I just checked—we've made a similar website for a brand in Australia. Please give me 10 seconds to customize it for you.",
        "developer",
        2000
      );
      setIsTyping(false);

      try {
        const preview = await getThemePreview(formData);
        setPreviewUrl(preview.served_url || preview.preview_url);
        setSearchQuery(preview.search_query);

        // Add the plain English description to the chat
        if (preview.plain_description) {
          await addMessage(
            `Here's how I understood your requirements:\n${preview.plain_description}`,
            "developer",
            0
          );
        }

        await addMessage(
          `This is your website ${preview.search_query}`,
          "developer",
          0,
          true
        );

        // Updated toast with CTA
        toast({
          title: "Special Offer!",
          description: "Get this professional website for only $15! Limited time offer.",
          action: (
            <button
              onClick={handleExampleClick}
              className="bg-secondary-DEFAULT text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Buy Now
            </button>
          ),
          duration: 5000,
        });
      } catch (error) {
        console.error('Failed to get theme preview:', error);
        await addMessage(
          `View your example website: ${formData.websiteName || 'Your Website'}`,
          "developer",
          0,
          true
        );
      }
      
      setCanType(true);
    };

    initializeChat();
  }, [formData]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && canType) {
      await handleAction('text_input', { text: inputMessage });
      await addMessage(inputMessage, "user", 0);
      redirectToWhatsApp(inputMessage);
      setInputMessage("");
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputMessage(text);
    await handleAction('text_input', { text });
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleAction('key_press', { key: 'enter', context: 'chat_input' });
      handleSendMessage();
    }
  };

  // Add scroll tracking
  useScrollTracking('chat-messages');
  useScrollTracking('benefits-sidebar');

  const handlePayment = async () => {
    await handleAction('button_click', { button_id: 'payment_button' });
    try {
      const { clientSecret } = await createPaymentIntent();
      if (clientSecret) {
        window.location.href = `/payment?client_secret=${clientSecret}`;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Always visible on desktop */}
      <div 
        id="benefits-sidebar" 
        className={`hidden md:flex flex-col w-[300px] min-w-[300px] border-r border-border bg-primary/5 p-4 space-y-4`}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg animate-fade-in space-y-6">
          <h4 className="text-2xl font-bold text-primary-DEFAULT text-center leading-tight">
            Website Bundle
          </h4>
          <div className="space-y-4">
            <p className="text-sm text-primary-DEFAULT/80 text-center">
              Get your professional website today!
            </p>
            <ul className="space-y-3">
              {[
                "Professional Design",
                "Fast Development",
                "SEO Optimized",
                "5 Free Revisions",
                "Mobile Responsive",
                "24/7 Support",
                "Secure Hosting",
                "1 Year Free Domain"
              ].map((feature, index) => (
                <li key={feature} className="flex items-start gap-2 text-primary-DEFAULT">
                  <Check className="h-5 w-5 text-secondary-DEFAULT flex-shrink-0 mt-0.5" />
                  <span className="text-sm break-words leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-primary-DEFAULT">$15</span>
                <span className="text-sm text-primary-DEFAULT/70"> only</span>
              </div>
              <button 
                onClick={handlePayment}
                className="w-full bg-secondary-DEFAULT text-secondary-foreground py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Buy Now!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-primary/5" onMouseEnter={() => handleAction('hover', { element: 'developer_header' })}>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="https://www.aurumbureau.com/wp-content/uploads/2020/11/Aurum-Speakers-Bureau-Samy-Kamkar.jpg"
              alt="Developer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              Waleed Ajmal
              <a 
                href="https://www.linkedin.com/in/waleed-ajmal?originalSubdomain=pk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">Full Stack Developer</p>
          </div>
        </div>

        <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4" onMouseEnter={() => handleAction('hover', { element: 'chat_messages' })}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "developer" ? "justify-start" : "justify-end"
              }`}
            >
              {message.sender === "developer" && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <img
                    src="https://www.aurumbureau.com/wp-content/uploads/2020/11/Aurum-Speakers-Bureau-Samy-Kamkar.jpg"
                    alt="Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "developer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.isLink ? (
                  <button
                    onClick={handleExampleClick}
                    className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    onMouseEnter={() => handleAction('hover', { element: 'example_link' })}
                  >
                    <span className="whitespace-pre-wrap">{message.text}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Samy is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Add this invisible element at the end */}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={canType ? "Type your message..." : "Please wait for developer..."}
              className="flex-1"
              disabled={!canType}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              disabled={!canType}
              onMouseEnter={() => handleAction('hover', { element: 'send_message_button' })}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Payment Button for Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={handlePayment}
          className="bg-secondary-DEFAULT text-secondary-foreground px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Buy Now - $15
        </button>
      </div>
    </div>
  );
};
