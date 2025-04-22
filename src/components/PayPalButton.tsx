"use client";

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PayPalButtonProps {
  plan: string;
  amount: string;
}

export default function PayPalButton({ plan, amount }: PayPalButtonProps) {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const createOrder = async () => {
    try {
      setError("");
      toast.loading("Creating your order...", {
        duration: 0, // Keep showing until dismissed
        id: "payment-loading" // Unique ID to update/dismiss later
      });

      const response = await fetch("/api/premium/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          amount: amount.toString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      toast.dismiss("payment-loading");
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.dismiss("payment-loading");
      toast.error("Failed to create payment order", {
        description: "There was a problem setting up your payment. Please try again.",
        action: {
          label: "Retry",
          onClick: () => createOrder()
        }
      });
      console.error("Error creating order:", err);
      throw new Error(errorMessage);
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setError("");
      toast.loading("Processing your payment...", {
        duration: 0,
        id: "payment-processing"
      });
      
      const response = await fetch(`/api/premium/subscribe/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || "Failed to capture order");
      }

      toast.dismiss("payment-processing");
      toast.success("Payment Successful!", {
        description: `You've successfully subscribed to the ${plan} plan.`,
        duration: 5000,
        action: {
          label: "View Plan",
          onClick: () => router.push("/account/subscription")
        }
      });
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/premium/success");
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete payment";
      setError(errorMessage);
      toast.dismiss("payment-processing");
      toast.error("Payment Failed", {
        description: "We couldn't process your payment. Please try again or contact support.",
        duration: 5000,
        action: {
          label: "Contact Support",
          onClick: () => router.push("/support")
        }
      });
      console.error("Error capturing order:", err);
    }
  };

  const onError = (err: Record<string, unknown>) => {
    setError("Payment failed. Please try again.");
    toast.error("Payment Error", {
      description: "There was a technical problem processing your payment. Please try again.",
      duration: 5000,
      action: {
        label: "Try Again",
        onClick: () => window.location.reload()
      }
    });
    console.error("Payment error:", err);
  };

  const onCancel = () => {
    toast.info("Payment Cancelled", {
      description: "You've cancelled the payment process. Feel free to try again when you're ready.",
      duration: 5000,
      action: {
        label: "Try Again",
        onClick: () => window.location.reload()
      }
    });
  };

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 