"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Music,
  Download,
  Headphones,
  Wifi,
  Star,
  Check,
  Crown,
  Sparkles,
  X,
  Zap
} from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "4.99",
    description: "Perfect for casual listeners",
    features: [
      { text: "50 songs per month", included: true },
      { text: "Standard audio quality", included: true },
      { text: "Limited offline playback", included: true },
      { text: "Basic support", included: true },
      { text: "Ad-supported", included: false },
      { text: "Exclusive content", included: false }
    ],
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    price: "9.99",
    description: "Most popular choice",
    features: [
      { text: "Unlimited songs", included: true },
      { text: "High-quality audio", included: true },
      { text: "Unlimited offline playback", included: true },
      { text: "Priority support", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Exclusive content", included: true }
    ],
    popular: true
  },
  {
    id: "family",
    name: "Family",
    price: "14.99",
    description: "Share with up to 6 family members",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Up to 6 accounts", included: true },
      { text: "Family mix playlist", included: true },
      { text: "Parental controls", included: true },
      { text: "Family support", included: true },
      { text: "Shared playlists", included: true }
    ],
    popular: false
  }
];

export default function PremiumPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");

  const handleUpgrade = async (planId: string) => {
    if (!session?.user) {
      toast.error("Please sign in to upgrade");
      router.push("/login");
      return;
    }

    setIsLoading(planId);

    try {
      const response = await fetch("/api/premium/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade");
      }

      await update({
        ...session,
        user: {
          ...session.user,
          email: "premium@test.com"
        }
      });

      toast.success(`Successfully upgraded to ${planId} plan!`, {
        description: "Enjoy your new features!"
      });

      router.push("/playlists");
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to upgrade", {
        description: "Please try again later or contact support."
      });
    } finally {
      setIsLoading(null);
    }
  };

  const isPremium = session?.user?.email === "premium@test.com";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Choose Your Premium Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your music journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="default" className="bg-primary">
                    <Zap className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        feature.included ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        {feature.included ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading !== null || isPremium}
                >
                  {isLoading === plan.id ? (
                    <>
                      <Crown className="mr-2 h-4 w-4 animate-pulse" />
                      Upgrading...
                    </>
                  ) : isPremium ? (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Choose {plan.name}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            By upgrading, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="py-1 px-2">
              <Check className="w-4 h-4 mr-1" />
              Cancel anytime
            </Badge>
            <Badge variant="outline" className="py-1 px-2">
              <Check className="w-4 h-4 mr-1" />
              Secure payment
            </Badge>
            <Badge variant="outline" className="py-1 px-2">
              <Check className="w-4 h-4 mr-1" />
              24/7 support
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
} 