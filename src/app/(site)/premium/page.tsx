"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Music2 as Music,
  DownloadCloud as Download,
  Headphones as HeadphonesIcon,
  WifiIcon as Wifi,
  Star as StarIcon,
  Check as CheckIcon,
  Crown as CrownIcon,
  Sparkles as SparklesIcon,
  X as XIcon,
  Zap as ZapIcon,
  Users as UsersIcon,
  Mic2 as Mic2Icon,
  Clock as ClockIcon,
  ShieldCheck as Shield,
  Award as AwardIcon
} from "lucide-react";

const billingOptions = {
  monthly: {
    basic: "4.99",
    premium: "9.99",
    family: "14.99",
    student: "4.99",
    pro: "19.99"
  },
  yearly: {
    basic: "49.99",
    premium: "99.99",
    family: "149.99",
    student: "49.99",
    pro: "199.99"
  }
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for casual listeners",
    features: [
      { text: "50 songs per month", included: true },
      { text: "Standard audio quality", included: true },
      { text: "Limited offline playback", included: true },
      { text: "Basic support", included: true },
      { text: "Ad-supported", included: false },
      { text: "Exclusive content", included: false }
    ],
    popular: false,
    icon: Music,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Most popular choice",
    features: [
      { text: "Unlimited songs", included: true },
      { text: "High-quality audio", included: true },
      { text: "Unlimited offline playback", included: true },
      { text: "Priority support", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Exclusive content", included: true }
    ],
    popular: true,
    icon: CrownIcon,
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "family",
    name: "Family",
    description: "Share with up to 6 family members",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Up to 6 accounts", included: true },
      { text: "Family mix playlist", included: true },
      { text: "Parental controls", included: true },
      { text: "Family support", included: true },
      { text: "Shared playlists", included: true }
    ],
    popular: false,
    icon: UsersIcon,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "student",
    name: "Student",
    description: "Special discount for students",
    features: [
      { text: "Unlimited songs", included: true },
      { text: "High-quality audio", included: true },
      { text: "Limited offline playback", included: true },
      { text: "Standard support", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Student verification required", included: true }
    ],
    popular: false,
    icon: AwardIcon,
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "pro",
    name: "Professional",
    description: "For serious musicians and creators",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Studio quality audio", included: true },
      { text: "Advanced vocal isolation", included: true },
      { text: "Professional mixing tools", included: true },
      { text: "Priority 24/7 support", included: true },
      { text: "Commercial usage rights", included: true }
    ],
    popular: false,
    icon: Mic2Icon,
    color: "from-amber-500 to-orange-500"
  }
];

export default function PremiumPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

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
        body: JSON.stringify({ planId, billingCycle })
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 -z-10" />
              <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Choose Your Premium Plan
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Select the perfect plan for your music journey and unlock a world of possibilities
            </p>
          </div>

          {/* Billing Cycle Selector */}
          <div className="flex justify-center">
            <Tabs 
              defaultValue="monthly" 
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2 p-1">
                <TabsTrigger value="monthly" className="transition-all duration-300">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="transition-all duration-300">
                  Yearly
                  <Badge variant="secondary" className="ml-2 bg-primary/20 animate-pulse">Save 20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent blur-3xl -z-10" />
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                } ${hoveredPlan === plan.id ? 'scale-[1.02] shadow-xl' : 'scale-100'}
                backdrop-blur-sm bg-card/95`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 p-4">
                    <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80 animate-pulse">
                      <ZapIcon className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        ${billingOptions[billingCycle][plan.id as keyof typeof billingOptions.monthly]}
                      </span>
                      <span className="text-lg text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-primary mt-2 font-medium">Save 20% with annual billing</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-300 ${
                          hoveredPlan === plan.id ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 ${
                          feature.included ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          {feature.included ? (
                            <CheckIcon className="h-4 w-4 text-primary" />
                          ) : (
                            <XIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={`${feature.included ? 'text-foreground' : 'text-muted-foreground'} transition-colors duration-300`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-6">
                  <Button 
                    className={`w-full h-12 text-lg transition-all duration-500 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' 
                        : 'hover:scale-105'
                    }`}
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading !== null || isPremium}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <CrownIcon className="mr-2 h-5 w-5 animate-pulse" />
                        Upgrading...
                      </>
                    ) : isPremium ? (
                      <>
                        <CrownIcon className="mr-2 h-5 w-5" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        Get {plan.name}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Secure Payments",
                description: "Your transactions are protected with industry-standard security"
              },
              {
                icon: <ClockIcon className="w-8 h-8 text-primary" />,
                title: "Cancel Anytime",
                description: "No long-term contracts, cancel your subscription whenever you want"
              },
              {
                icon: <HeadphonesIcon className="w-8 h-8 text-primary" />,
                title: "24/7 Support",
                description: "Get help whenever you need it with our dedicated support team"
              },
              {
                icon: <Download className="w-8 h-8 text-primary" />,
                title: "Offline Access",
                description: "Download your favorite songs for offline listening"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 group">
                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 