'use client';

import { Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PremiumBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            <Crown className="h-3 w-3" />
            <span>Premium</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Premium content - Upgrade to access</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 