'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <h3 className="text-2xl font-bold">Login Required</h3>
        <p className="text-muted-foreground max-w-md">
          Please login to view this content and access our full collection of songs.
        </p>
        <Button 
          onClick={() => router.push('/login')}
          className="bg-primary hover:bg-primary/90"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  return <>{children}</>;
} 