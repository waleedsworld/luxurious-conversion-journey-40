import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const orderNumber = Math.random().toString(36).substring(7).toUpperCase();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Dear Techrealm, this is my order ID: ${orderNumber}. Let's start with the website development!`);
    window.open(`https://api.whatsapp.com/send/?phone=923461115757&text=${message}&type=phone_number&app_absent=0`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-16 h-16 mx-auto">
          <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
        <p className="text-muted-foreground">Order Number: {orderNumber}</p>
        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Us
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;