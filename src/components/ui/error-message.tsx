'use client';

import { Music2, RefreshCcw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = 'No songs found',
  message = 'Try searching for a different song or artist',
  showRefresh = true,
  onRefresh,
  className
}: ErrorMessageProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <Music2 className="h-12 w-12 text-muted-foreground/30" />
        <span className="absolute bottom-0 right-0 text-xl">🎵</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-[300px]">{message}</p>
      {showRefresh && onRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
