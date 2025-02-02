import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Calendar, BookOpen, Image, DollarSign as DollarSignIcon, Speaker, Users as Users2, Target, Linkedin, Plus } from "lucide-react";
import { LoadingScreen } from "./LoadingScreen";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ChatInterface } from "./ChatInterface";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleAction } from "@/utils/actionHandler";
import { useScrollTracking } from "@/hooks/useScrollTracking";

interface WebsiteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormStep {
  title: string;
  description: string;
}

const steps: FormStep[] = [
  {
    title: "What's Your Website Name?",
    description: "Choose a memorable name for your website",
  },
  {
    title: "Describe Your Website",
    description: "Write a brief description of your website",
  },
  {
    title: "What Is Your Website About?",
    description: "Select the category that best fits your website",
  },
  {
    title: "What Do You Aim to Do?",
    description: "Tell us your main goal",
  },
  {
    title: "Expected Traffic",
    description: "How many visitors are you expecting?",
  },
];

export const WebsiteForm = ({ open, onOpenChange }: WebsiteFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialLoading, setShowInitialLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFinalLoading, setShowFinalLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(".com");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    websiteName: "",
    websiteDescription: "",
    category: "",
    goal: "",
    traffic: "",
  });

  const domainOptions = [
    { value: ".com", label: ".com" },
    { value: ".store", label: ".store" },
    { value: ".online", label: ".online" },
    { value: ".xyz", label: ".xyz" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = () => {
    const sanitizeText = (text: string) => {
      return text.replace(/[\n\r]/g, ' ').replace(/[^\w\s-]/g, '');
    };

    switch (currentStep) {
      case 0:
        if (!formData.websiteName.trim()) {
          toast({
            title: "Website name is required",
            description: "Please enter a name for your website",
            variant: "destructive",
          });
          return false;
        }
        setFormData(prev => ({
          ...prev,
          websiteName: sanitizeText(prev.websiteName)
        }));
        break;
      case 1:
        if (!formData.websiteDescription.trim()) {
          toast({
            title: "Website description is required",
            description: "Please enter a description for your website",
            variant: "destructive",
          });
          return false;
        }
        setFormData(prev => ({
          ...prev,
          websiteDescription: sanitizeText(prev.websiteDescription)
        }));
        break;
      case 2:
        if (!formData.category) {
          toast({
            title: "Category selection is required",
            description: "Please select a category for your website",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!formData.goal) {
          toast({
            title: "Goal selection is required",
            description: "Please select a goal for your website",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4:
        if (!formData.traffic) {
          toast({
            title: "Traffic expectation is required",
            description: "Please select your expected traffic",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    await handleAction('button_click', { button_id: 'next_step' });
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onOpenChange(false);
      setShowInitialLoading(true);
      
      await handleAction('form_submit', { 
        form_data: formData 
      });
      
      setTimeout(() => {
        setShowInitialLoading(false);
        setShowSuccess(true);
      }, 3000);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setShowFinalLoading(true);
    
    const finalFormData = {
      websiteName: formData.websiteName || 'Untitled Website',
      websiteDescription: formData.websiteDescription || 'No description provided',
      category: formData.category || 'General',
      goal: formData.goal || 'Not specified',
      traffic: formData.traffic || 'Not specified',
    };
    
    setTimeout(() => {
      setShowFinalLoading(false);
      setShowChat(true);
      onOpenChange(false);
      const event = new CustomEvent('showChat', { 
        detail: { formData: finalFormData } 
      });
      window.dispatchEvent(event);
    }, 3000);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    await handleAction('text_input', { text: value, field: name });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = async (category: string) => {
    await handleAction('button_click', { button_id: `category_${category}` });
    if (category === "Others") {
      setFormData(prev => ({ ...prev, category: customCategory || "Others" }));
    } else {
      setFormData(prev => ({ ...prev, category }));
      setCustomCategory("");
    }
  };

  const handleGoalChange = async (goal: string) => {
    await handleAction('button_click', { button_id: `goal_${goal}` });
    if (goal === "Others") {
      setFormData(prev => ({ ...prev, goal: customGoal || "Others" }));
    } else {
      setFormData(prev => ({ ...prev, goal }));
      setCustomGoal("");
    }
  };

  const handleCustomCategoryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await handleAction('text_input', { text: value });
    setCustomCategory(value);
    setFormData(prev => ({ ...prev, category: value || "Others" }));
  };

  const handleCustomGoalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await handleAction('text_input', { text: value });
    setCustomGoal(value);
    setFormData(prev => ({ ...prev, goal: value || "Others" }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 py-6">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="relative flex items-center w-full rounded-md border border-input bg-background ring-offset-background">
                  <div className="absolute left-3 text-sm text-gray-500 select-none pointer-events-none">
                    www.
                  </div>
                  <input
                    type="text"
                    placeholder="yourwebsite"
                    name="websiteName"
                    value={formData.websiteName}
                    onChange={handleInputChange}
                    className="flex h-12 w-full rounded-md bg-transparent pl-[4.5rem] pr-3 text-lg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <Select
                value={selectedDomain}
                onValueChange={setSelectedDomain}
              >
                <SelectTrigger className="w-[120px] h-12">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 py-6">
            <Textarea
              placeholder="Write a brief description of your website..."
              name="websiteDescription"
              value={formData.websiteDescription}
              onChange={handleInputChange}
              className="min-h-[100px] text-lg p-4 transition-all duration-300 focus:scale-105"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShoppingCart, label: "Ecommerce", hoverBg: "hover:bg-[#D6BCFA]" },
                { icon: Calendar, label: "Events", hoverBg: "hover:bg-[#FEF7CD]" },
                { icon: BookOpen, label: "Blogs", hoverBg: "hover:bg-[#D3E4FD]" },
                { icon: Image, label: "Portfolio", hoverBg: "hover:bg-[#86EFAC]" },
                { icon: Plus, label: "Others", hoverBg: "hover:bg-[#FDA4AF]" },
              ].map(({ icon: Icon, label, hoverBg }) => (
                <Button
                  key={label}
                  variant={(label === "Others" && customCategory !== "") || formData.category === label ? "default" : "outline"}
                  className={`h-24 relative group ${hoverBg} transition-colors duration-300`}
                  onClick={() => handleCategoryChange(label)}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <Icon 
                      className={`h-6 w-6 absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform 
                        ${(label === "Others" && customCategory !== "") || formData.category === label ? 'translate-y-8 opacity-100' : 'group-hover:translate-y-8'}`}
                    />
                    <span className={`text-xl font-bold group-hover:mt-8 transition-all duration-300 ${(label === "Others" && customCategory !== "") || formData.category === label ? 'mt-8' : ''}`}>
                      {label}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            {(formData.category === "Others" || customCategory !== "") && (
              <Input
                placeholder="Enter your category..."
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="mt-4"
              />
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSignIcon, label: "Make passive income", hoverBg: "hover:bg-[#F2FCE2]", iconColor: "text-green-500" },
                { icon: Speaker, label: "Inform people", hoverBg: "hover:bg-[#D3E4FD]", iconColor: "text-blue-500" },
                { icon: Users2, label: "Build a community", hoverBg: "hover:bg-[#D6BCFA]", iconColor: "text-purple-500" },
                { icon: Target, label: "Generate leads", hoverBg: "hover:bg-[#FEF7CD]", iconColor: "text-yellow-500" },
                { icon: Plus, label: "Others", hoverBg: "hover:bg-[#FDA4AF]", iconColor: "text-red-500" },
              ].map(({ icon: Icon, label, hoverBg, iconColor }) => (
                <Button
                  key={label}
                  variant={(label === "Others" && customGoal !== "") || formData.goal === label ? "default" : "outline"}
                  className={`min-h-[96px] relative group ${hoverBg} transition-all duration-300`}
                  onClick={() => handleGoalChange(label)}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full p-2">
                    <Icon 
                      className={`h-6 w-6 absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform ${iconColor}
                        ${(label === "Others" && customGoal !== "") || formData.goal === label ? 'translate-y-8 opacity-100' : 'group-hover:translate-y-8'}`}
                    />
                    <span className={`text-sm sm:text-base font-bold text-center break-words group-hover:mt-8 transition-all duration-300 ${(label === "Others" && customGoal !== "") || formData.goal === label ? 'mt-8' : ''}`}>
                      {label}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            {(formData.goal === "Others" || customGoal !== "") && (
              <Input
                placeholder="Enter your goal..."
                value={customGoal}
                onChange={handleCustomGoalChange}
                className="mt-4"
              />
            )}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 gap-4 py-6">
            {["Just starting out", "Moderate traffic", "High volume"].map(
              (option) => (
                <Button
                  key={option}
                  variant={formData.traffic === option ? "default" : "outline"}
                  className="min-h-[96px] hover:scale-105 transition-all duration-300 relative group"
                  onClick={() => setFormData({ ...formData, traffic: option })}
                >
                  <div className="flex flex-col items-center justify-center w-full h-full p-2">
                    <span className="text-sm sm:text-base font-bold text-center break-words">
                      {option}
                    </span>
                  </div>
                </Button>
              )
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleClose = async () => {
    await handleAction('button_click', { button_id: 'close_form' });
    onOpenChange(false);
  };

  const handleContinueWithDeveloper = async () => {
    await handleAction('button_click', { button_id: 'continue_with_developer' });
    handleSuccessClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900">
          <div id="form-content" className="space-y-8 max-h-[80vh] overflow-y-auto">
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% completed</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>

            {renderStep()}

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                className="w-32 h-12 text-lg hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-[400px] bg-white dark:bg-gray-900 p-6 rounded-lg">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-bold text-center">
              We have found a developer for you!
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src="https://www.aurumbureau.com/wp-content/uploads/2020/11/Aurum-Speakers-Bureau-Samy-Kamkar.jpg"
                    alt="Waleed Ajmal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Waleed Ajmal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Stack Developer</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/waleed-ajmal?originalSubdomain=pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#0077b5] hover:text-[#0077b5]/80 transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>View LinkedIn Profile</span>
                </a>
                <Button 
                  onClick={handleContinueWithDeveloper}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                  variant="default"
                >
                  Continue
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {showInitialLoading && (
        <LoadingScreen messages={["Finding developer..."]} />
      )}
      {showFinalLoading && (
        <LoadingScreen messages={[
          "Sending your project...",
          "Making sure developer is trained...",
          "Preparing project requirements...",
          "Setting up development environment...",
          "Initializing project workspace...",
          "Configuring development tools...",
          "Loading project specifications...",
          "Analyzing project scope...",
          "Getting everything ready..."
        ]} />
      )}
      {showChat && <ChatInterface formData={formData} />}
    </>
  );
};
