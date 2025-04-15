'use client';

import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Music2, Mic2 } from "lucide-react";
import Link from "next/link";

export function HomePremiumFeatures() {
  const features = [
    {
      icon: <Music2 className="h-8 w-8" />,
      title: "Premium Songs",
      description: "Access exclusive songs and latest releases",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Mic2 className="h-8 w-8" />,
      title: "Pro Karaoke Mode",
      description: "High-quality vocal removal and effects",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted singing sessions",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/0" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Premium Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enhance Your Karaoke Experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock premium features and take your singing to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-50" />
              <div className="relative bg-card border rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/premium">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 