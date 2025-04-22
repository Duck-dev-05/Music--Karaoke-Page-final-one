import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons as PayPalButtonsOriginal } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PayPalButtonsProps {
  planId: string;
  amount: number;
  className?: string;
}

export function PayPalButtons({ planId, amount, className }: PayPalButtonsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Reset error when props change
  useEffect(() => {
    setError(null);
  }, [planId, amount]);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/premium/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch('/api/premium/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          planId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to capture payment');
      }

      // Show success message
      toast.success('Payment successful!', {
        description: 'Welcome to Premium! Redirecting to your account...',
      });

      // Redirect to success page
      setTimeout(() => {
        router.push('/premium?status=success');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error capturing payment:', error);
      setError('Failed to process payment. Please try again.');
      toast.error('Payment failed', {
        description: 'Please try again or contact support if the issue persists.',
      });
    }
  };

  return (
    <div className={className}>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <PayPalButtonsOriginal
          style={{
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error('PayPal error:', err);
            setError('Payment failed. Please try again.');
          }}
        />
      </PayPalScriptProvider>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center">
          {error}
        </p>
      )}
    </div>
  );
} 