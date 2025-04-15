'use client';

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Music } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

export function SpotifyConnect() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetchRecommendations();
    }
  }, [session]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/spotify/recommendations');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRecommendations(data.tracks || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut({ callbackUrl: '/spotify' });
    } catch (error) {
      console.error('Spotify disconnection error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect from Spotify. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-[#1DB954]" />
          <h2 className="text-2xl font-bold">Recommended Songs</h2>
        </div>
        <Button 
          onClick={handleDisconnect}
          variant="outline"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading recommendations...</p>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recommendations available.</p>
          <Button onClick={fetchRecommendations} variant="outline" className="mt-4">
            Refresh Recommendations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((track) => (
            <div
              key={track.id}
              className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{track.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 