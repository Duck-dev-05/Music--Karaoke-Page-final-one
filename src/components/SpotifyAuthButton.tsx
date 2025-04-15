'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2, Music2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function SpotifyAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signIn('spotify', {
        callbackUrl: '/spotify',
        redirect: true,
      });

      if (result?.error) {
        toast({
          title: "Authentication Error",
          description: "Failed to connect with Spotify. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Spotify authentication error:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSpotifyLogin}
      disabled={isLoading}
      size="lg"
      className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-8 py-6 text-lg flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Music2 className="h-5 w-5" />
          Connect with Spotify
        </>
      )}
    </Button>
  );
} 