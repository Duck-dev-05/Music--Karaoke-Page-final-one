'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { useSession } from 'next-auth/react';

export default function PlaylistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?from=/playlist');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Your Playlists</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example playlists - replace with real data */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Favorites</h3>
            <p className="text-muted-foreground">Your favorite karaoke songs</p>
            <div className="mt-4 text-sm text-muted-foreground">10 songs</div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Party Mix</h3>
            <p className="text-muted-foreground">Perfect for karaoke parties</p>
            <div className="mt-4 text-sm text-muted-foreground">15 songs</div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Practice List</h3>
            <p className="text-muted-foreground">Songs you're learning</p>
            <div className="mt-4 text-sm text-muted-foreground">5 songs</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
