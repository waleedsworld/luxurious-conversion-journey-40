import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto">
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Payment Failed</h1>
        <p className="text-muted-foreground">Something went wrong with your payment.</p>
        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;