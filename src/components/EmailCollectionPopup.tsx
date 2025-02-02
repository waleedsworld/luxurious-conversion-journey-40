import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleAction } from "@/utils/actionHandler";
import { useToast } from "@/hooks/use-toast";

export const EmailCollectionPopup = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleAction("contact_submit", {
      text: contact,
      context: contactType,
    });

    toast({
      title: "Thank you!",
      description: "We'll be in touch soon with your exclusive discount.",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Limited Time Offer!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">
              Get a complete holistic website for just $15!
            </p>
            <p className="text-gray-500">
              Original price:{" "}
              <span className="line-through">$500-$1500</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={contactType === "email" ? "default" : "outline"}
                onClick={() => setContactType("email")}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                type="button"
                variant={contactType === "phone" ? "default" : "outline"}
                onClick={() => setContactType("phone")}
                className="flex-1"
              >
                Phone
              </Button>
            </div>
            <Input
              type={contactType === "email" ? "email" : "tel"}
              placeholder={contactType === "email" ? "Enter your email" : "Enter your phone"}
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                handleAction("input_change", {
                  field: "contact",
                  text: e.target.value,
                });
              }}
              required
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Get My Discount Now
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};