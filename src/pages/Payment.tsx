import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPaymentIntent } from "@/services/payment";
import { LoadingScreen } from "@/components/LoadingScreen";

const Payment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        await createPaymentIntent();
      } catch (error) {
        console.error('Payment initiation failed:', error);
        navigate('/payment/failed');
      }
    };

    initiatePayment();
  }, [navigate]);

  return (
    <LoadingScreen 
      messages={[
        "Initializing payment...",
        "Please wait while we redirect you to our secure payment gateway...",
        "This will only take a moment..."
      ]} 
    />
  );
};

export default Payment;