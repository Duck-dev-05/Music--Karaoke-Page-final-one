"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "Premium plan",
    price: 19.99,
    priceId: "price_1RIMkMEDtMR3LY8KTDvMA4bC", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Unlimited favorites",
      "Unlimited playlists",
      "Priority support",
      "No ads",
    ],
    badge: "Most Popular",
    highlight: true,
  },
  {
    name: "Family Plan",
    price: 29.99,
    priceId: "price_1RIMjTEDtMR3LY8K2ow78w0i", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Up to 5 family members",
      "Family playlist sharing",
      "Parental controls",
    ],
    badge: "Best Value",
    highlight: false,
  },
  {
    name: "Advanced Plan",
    price: 24.99,
    priceId: "price_1RIMhkEDtMR3LY8KrBk3uOQu", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Advanced analytics",
      "Priority support",
      "No ads",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Pro Plan",
    price: 15.99,
    priceId: "price_1RIMg2EDtMR3LY8K5DXNL2XD", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Pro tools",
      "Priority support",
      "No ads",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Starter Plan",
    price: 12.99,
    priceId: "price_1RIMfAEDtMR3LY8KG0cZsjgR", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Starter tools",
      "No ads",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Basic Plan",
    price: 9.99,
    priceId: "price_1RIMecEDtMR3LY8KeQ9n5Rlu", // TODO: Replace with real Stripe price ID
    features: [
      "All premium features",
      "Basic tools",
      "No ads",
    ],
    badge: null,
    highlight: false,
  },
];

const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

export default function PaymentPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activationPending, setActivationPending] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const paymentSuccess = searchParams.get("success") === "true";

  // Poll session after payment success to get latest premium info
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (paymentSuccess && typeof update === 'function') {
      setActivationPending(true);
      setPollCount(0);
      interval = setInterval(async () => {
        await update();
        setPollCount((c) => c + 1);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentSuccess, update]);

  // Stop polling if premium is true or after 5 tries
  useEffect(() => {
    if (!activationPending) return;
    if (session?.user?.premium) {
      setActivationPending(false);
      setPollCount(0);
    } else if (pollCount >= 5) {
      setActivationPending(false);
    }
  }, [session, activationPending, pollCount]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/login?callbackUrl=/payment");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Show success message and plan if payment succeeded and user is premium
  const showSuccess = paymentSuccess && session.user.premium;
  const planName = session.user.premiumPlan || "Premium";

  // Show activation pending message if payment succeeded but premium not yet active
  const showActivationPending = paymentSuccess && !session.user.premium && activationPending;
  const showActivationFailed = paymentSuccess && !session.user.premium && !activationPending && pollCount >= 5;

  const handlePurchase = async (plan: typeof plans[0]) => {
    try {
      setIsPurchasing(true);
      toast.loading("Redirecting to Stripe checkout...");
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, email: session?.user?.email, planId: plan.name }),
      });
      const data = await res.json();
      toast.dismiss();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Stripe checkout failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-br from-[#f6f7fb] via-[#e9eafc] to-[#fbeff6] dark:from-background dark:via-background dark:to-background">
      {showSuccess && (
        <div className="mb-8 p-6 rounded-xl bg-green-100 border border-green-300 text-green-800 text-center max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-2">🎉 Payment Successful!</h2>
          <p className="mb-1">You have purchased the <span className="font-semibold">{planName}</span> plan.</p>
          <p>Premium features are now unlocked. Enjoy your upgraded experience!</p>
        </div>
      )}
      {showActivationPending && (
        <div className="mb-8 p-6 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 text-center max-w-xl w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent mb-2"></div>
            <h2 className="text-xl font-bold mb-2">Activating your premium features...</h2>
            <p className="mb-1">Your payment was successful, but we are still unlocking your premium features. This may take a few seconds.</p>
            <p>If this takes too long, please refresh the page or contact support.</p>
          </div>
        </div>
      )}
      {showActivationFailed && (
        <div className="mb-8 p-6 rounded-xl bg-red-100 border border-red-300 text-red-800 text-center max-w-xl w-full">
          <h2 className="text-xl font-bold mb-2">Premium Activation Delayed</h2>
          <p>We could not verify your premium status yet. Please refresh the page or contact support if the issue persists.</p>
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center tracking-tight text-gray-900 dark:text-white">
        Upgrade Your Karaoke Experience
      </h1>
      <p className="mb-12 text-center max-w-2xl text-lg text-gray-500 dark:text-gray-300">
        Choose the plan that fits you best. All plans are billed monthly and can be cancelled anytime.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-center items-stretch">
        {sortedPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col items-center border rounded-2xl shadow-md bg-white dark:bg-background transition-transform duration-200 hover:scale-[1.025] focus-within:scale-[1.025] ${plan.highlight ? 'border-primary ring-2 ring-primary/20 shadow-xl z-10 bg-gradient-to-br from-primary/10 to-white dark:from-primary/20 dark:to-background' : 'border-gray-200 dark:border-border'} min-h-[440px] p-7`}
            tabIndex={0}
            aria-label={plan.name + ' plan'}
          >
            {plan.badge && (
              <span className={`absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold shadow-md ${plan.highlight ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} z-20 border border-white dark:border-background`} style={{letterSpacing: 0.5}}>
                {plan.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center tracking-tight mt-8 text-gray-900 dark:text-white">{plan.name}</h2>
            <div className="text-4xl font-extrabold mb-4 text-center text-gray-900 dark:text-white">${plan.price.toFixed(2)}<span className="text-lg font-medium">/mo</span></div>
            <ul className="mb-8 text-left list-disc list-inside space-y-2 text-base md:text-lg w-full max-w-xs mx-auto text-gray-700 dark:text-gray-200">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="flex-1 flex flex-col justify-end w-full">
              <Button
                className={`w-full px-6 py-3 rounded-xl font-bold transition text-lg shadow focus:outline-none focus:ring-2 focus:ring-primary/60 ${plan.highlight ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-900 text-white hover:bg-gray-800'} mt-auto`}
                onClick={() => handlePurchase(plan)}
                disabled={isPurchasing}
              >
                {isPurchasing ? "Loading..." : "Purchase"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-14 text-center text-base text-gray-500 dark:text-gray-300 max-w-xl">
        <span className="inline-block mb-1">Cancel anytime. Secure payment powered by Stripe.</span><br/>
        <span className="inline-block">Need help? <a href="/support" className="underline hover:text-primary">Contact support</a>.</span>
      </div>
    </div>
  );
} 