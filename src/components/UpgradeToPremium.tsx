import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Crown, Music2, BellRing, Star, Shield, Sparkles, Headphones } from 'lucide-react';
import { MotionCard, MotionDiv } from '@/components/ui/motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PayPalButtons } from './PayPalButtons';

const PREMIUM_FEATURES = [
  {
    icon: Music2,
    title: 'Unlimited Access',
    description: 'Access our entire song library'
  },
  {
    icon: Headphones,
    title: 'HD Quality',
    description: 'Crystal clear audio quality'
  },
  {
    icon: Shield,
    title: 'Ad-Free',
    description: 'Uninterrupted experience'
  },
  {
    icon: Star,
    title: 'Priority Support',
    description: '24/7 dedicated support'
  }
];

const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    interval: 'month',
    description: 'Flexible monthly billing',
    features: [
      'Full access to all songs',
      'HD quality streaming',
      'Ad-free experience',
      'Basic support'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 95.88,
    interval: 'year',
    description: 'Save 20% annually',
    popular: true,
    features: [
      'Everything in Monthly',
      'Priority support',
      'Early access features',
      'Extended downloads'
    ]
  }
];

export function UpgradeToPremium() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert className="bg-primary/5 border-primary/20">
          <BellRing className="h-5 w-5 text-primary" />
          <AlertDescription className="flex items-center gap-2">
            <span>Please login to access premium features.</span>
            <Button variant="link" className="h-auto p-0 text-primary" onClick={() => router.push('/login')}>
              Login now →
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (session.user.premium) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert className="bg-green-50 border-green-200">
          <Crown className="h-5 w-5 text-green-600" />
          <AlertDescription className="flex items-center gap-2 text-green-800">
            <span>Welcome to Premium! Enjoy your enhanced experience.</span>
            <Button variant="link" className="h-auto p-0 text-green-700" onClick={() => router.push('/')}>
              Start listening →
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <MotionDiv 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Upgrade to Premium
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of your music experience
        </p>
      </MotionDiv>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {PREMIUM_FEATURES.map((feature, index) => (
          <MotionDiv
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="h-full p-6 rounded-xl bg-card hover:bg-primary/5 transition-colors">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Plans Section */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-b from-background to-muted rounded-2xl p-8"
      >
        <Tabs
          defaultValue="monthly"
          value={selectedPlan}
          onValueChange={setSelectedPlan}
          className="w-full"
        >
          <div className="text-center mb-8">
            <TabsList className="inline-flex bg-muted/50 p-1 rounded-lg">
              {PREMIUM_PLANS.map((plan) => (
                <TabsTrigger
                  key={plan.id}
                  value={plan.id}
                  className="relative min-w-[120px] rounded-md data-[state=active]:bg-white"
                >
                  {plan.popular && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-[10px] text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                      BEST VALUE
                    </span>
                  )}
                  {plan.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PREMIUM_PLANS.map((plan) => (
              <TabsContent key={plan.id} value={plan.id} className="mt-0">
                <MotionCard
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative overflow-hidden",
                    plan.popular && "border-primary shadow-lg"
                  )}
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-baseline mb-2">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground ml-2">/{plan.interval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <PayPalButtons
                      planId={plan.id}
                      amount={plan.price}
                      className="w-full"
                    />
                    
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      Secure payment · Cancel anytime
                    </p>
                  </div>
                </MotionCard>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </MotionDiv>

      {/* Money-back Guarantee */}
      <MotionDiv 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-sm text-muted-foreground">
          30-day money-back guarantee · No questions asked
        </p>
      </MotionDiv>
    </div>
  );
} 