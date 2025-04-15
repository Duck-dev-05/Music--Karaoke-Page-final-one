import { Metadata } from 'next';
import { PricingPlans } from '@/components/PricingPlans';

export const metadata: Metadata = {
  title: 'Premium Features',
  description: 'Upgrade your karaoke experience with premium features. Get access to exclusive songs, professional effects, and more.',
};

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto">
        <div className="py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
              Unlock Premium Features
            </h1>
            <p className="text-xl text-muted-foreground">
              Take your karaoke experience to the next level with our premium features. 
              Enjoy ad-free singing, professional effects, and exclusive content.
            </p>
          </div>
        </div>

        <PricingPlans />

        {/* Additional Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Go Premium?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
                <p className="text-muted-foreground">
                  Experience studio-grade sound quality and professional vocal effects.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
                <p className="text-muted-foreground">
                  No restrictions on songs, playlists, or recording time.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Exclusive Features</h3>
                <p className="text-muted-foreground">
                  Early access to new features and premium-only content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t border-border/50">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and other popular payment methods.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes! You can try our premium features free for 7 days with any subscription plan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 