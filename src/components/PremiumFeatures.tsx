'use client';

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Crown, Music4, Mic2, PlaySquare, History, Download, Star } from "lucide-react";
import Link from "next/link";

export function PremiumFeatures() {
  const { data: session } = useSession();
  // Ensure type safety by checking if premium status exists
  const isPremium = false; // Default to non-premium until premium status is properly configured

  const features = [
    {
      icon: <Music4 className="h-6 w-6" />,
      title: "Ad-Free Experience", 
      description: "Enjoy uninterrupted singing without any advertisements",
    },
    {
      icon: <Mic2 className="h-6 w-6" />,
      title: "Professional Karaoke Mode",
      description: "Access high-quality karaoke versions with vocal removal",
    },
    {
      icon: <PlaySquare className="h-6 w-6" />,
      title: "Unlimited Playlists",
      description: "Create and manage unlimited playlists for different occasions",
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Offline Mode",
      description: "Download songs for offline singing sessions",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Song Recording",
      description: "Record and save your karaoke performances",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Premium Songs",
      description: "Access exclusive premium songs and latest releases",
    },
  ];

  return (
    <div className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Premium Features</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upgrade to Premium for the ultimate karaoke experience with exclusive features and content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          {isPremium ? (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">You're a Premium Member!</span>
            </div>
          ) : (
            <Link href="/premium">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8">
                Upgrade to Premium
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}