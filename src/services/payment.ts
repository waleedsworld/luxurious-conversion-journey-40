import { getApiKey } from "@/utils/apiConfig";
import { handleAction } from "@/utils/actionHandler";

export const createPaymentIntent = async () => {
  try {
    const apiKey = getApiKey();
    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        amount: 1500, // $15.00
        currency_code: "USD",
        message: "Professional Website Package",
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/`,
        failure_url: `${window.location.origin}/payment/failed`,
        test: false,
        transaction_source: "directApi"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payment API Error:', errorData);
      
      // Send failed payment action
      await handleAction('form_submit', {
        form_data: {
          status: 'payment_failed',
          error: errorData.message || 'Payment creation failed'
        }
      });
      
      throw new Error(errorData.message || 'Payment creation failed');
    }

    const data = await response.json();
    
    // Send successful payment action
    await handleAction('form_submit', {
      form_data: {
        status: 'payment_authorized',
        order_id: data.id || 'test_order',
        amount: 1500,
        currency: 'USD'
      }
    });

    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    }
    return data;
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
};