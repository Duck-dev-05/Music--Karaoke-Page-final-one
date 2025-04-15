'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const PremiumFeatureCard = ({
  title,
  description,
  icon,
  className,
}: PremiumFeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow duration-300',
          className
        )}
      >
        <div className="absolute top-0 right-0 w-20 h-20 -translate-y-1/2 translate-x-1/2 bg-gradient-to-br from-primary/20 to-primary rounded-full blur-2xl" />
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default PremiumFeatureCard; 