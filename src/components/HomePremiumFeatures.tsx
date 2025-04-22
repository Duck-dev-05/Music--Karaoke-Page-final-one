'use client';

import { Button } from "@/components/ui/button";
import { Crown, Music, Mic2, StarIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function HomePremiumFeatures() {
  const features = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "Premium Songs",
      description: "Access exclusive songs and latest releases",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Mic2 className="h-8 w-8" />,
      title: "Pro Karaoke Mode",
      description: "High-quality vocal removal and effects",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: <StarIcon className="h-8 w-8" />,
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted singing sessions",
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-500/10",
    }
  ];

  return (
    <section className="relative overflow-hidden py-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Premium Features</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
            Enhance Your Karaoke Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and take your singing to the next level
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-50" />
              <div className="relative bg-card border rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/premium">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="mr-2 h-6 w-6" />
              Upgrade to Premium
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 