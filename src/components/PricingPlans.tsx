'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Crown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  isPopular?: boolean;
  savings?: number;
}

// Extend the default session type to include subscriptionPlan
declare module "next-auth" {
  interface User {
    subscriptionPlan?: string;
  }
  interface Session {
    user?: User;
  }
}

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    interval: 'month',
    features: [
      { text: 'Ad-free experience', included: true },
      { text: 'Professional karaoke mode', included: true },
      { text: 'Create unlimited playlists', included: true },
      { text: 'Access to premium songs', included: true },
      { text: 'Song recording feature', included: true },
      { text: 'Download for offline mode', included: true },
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 99.99,
    interval: 'year',
    features: [
      { text: 'All Monthly features', included: true },
      { text: '2 months free', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'HD song quality', included: true },
      { text: 'Extended recording time', included: true },
    ],
    isPopular: true,
    savings: 20,
  },
];

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if user is already subscribed to this plan
      if (session.user?.subscriptionPlan === planId) {
        toast.info('You are already subscribed to this plan');
        return;
      }

      // Here you would typically make an API call to your backend
      // to handle the subscription process
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate subscription');
      }

      const data = await response.json();
      
      // Redirect to checkout or confirmation page
      if (data.url) {
        router.push(data.url);
      } else {
        router.push(`/checkout?plan=${planId}`);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return session?.user?.subscriptionPlan === planId;
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="text-xl text-muted-foreground">
            Get access to exclusive features and enhance your karaoke experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-primary shadow-lg scale-[1.02]'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-black text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="text-right">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">/{plan.interval}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-green-500 text-sm font-medium mt-1">
                        Save ${plan.savings}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-primary to-primary/80'
                      : ''
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || isCurrentPlan(plan.id)}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : (
                    <>
                      Choose {plan.name}
                      {plan.isPopular && <Crown className="ml-2 h-4 w-4" />}
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Prices shown in USD. Cancel anytime. Terms apply.</p>
        </div>
      </div>
    </section>
  );
}