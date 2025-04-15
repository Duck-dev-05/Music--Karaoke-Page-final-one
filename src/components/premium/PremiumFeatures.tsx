'use client';

import React from 'react';
import PremiumFeatureCard from './PremiumFeatureCard';
import { Music, Mic2, Star, Download, Share2, HeartHandshake } from 'lucide-react';

const premiumFeatures = [
  {
    title: 'High Quality Audio',
    description: 'Stream music in lossless quality up to 24-bit/192kHz',
    icon: <Music className="w-6 h-6" />,
  },
  {
    title: 'Advanced Karaoke',
    description: 'Access professional vocal removal and pitch correction',
    icon: <Mic2 className="w-6 h-6" />,
  },
  {
    title: 'Exclusive Content',
    description: 'Get early access to new releases and exclusive tracks',
    icon: <Star className="w-6 h-6" />,
  },
  {
    title: 'Offline Mode',
    description: 'Download songs for offline listening anywhere',
    icon: <Download className="w-6 h-6" />,
  },
  {
    title: 'Collaboration Tools',
    description: 'Create and share playlists with other premium users',
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    title: 'Priority Support',
    description: '24/7 dedicated support for premium members',
    icon: <HeartHandshake className="w-6 h-6" />,
  },
];

const PremiumFeatures = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Premium Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock a world of premium features and take your music experience to the next level
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <PremiumFeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures; 