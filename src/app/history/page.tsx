'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Music, Mic2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useAudio } from "@/contexts/AudioContext";

interface HistoryItem {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration: number;
  type: 'listen' | 'karaoke';
  createdAt: string;
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'listen' | 'karaoke'>('all');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSong, isPlaying, playSong, pauseSong } = useAudio();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/user/history?type=${activeTab}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeTab]);

  const handlePlayPause = (item: HistoryItem) => {
    if (currentSong?.id === item.id && isPlaying) {
      pauseSong();
    } else {
      playSong(item);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="listen">Listening</TabsTrigger>
              <TabsTrigger value="karaoke">Karaoke</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No history yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start listening to music or singing karaoke to see your history here.
                  </p>
                  <Button>Browse Songs</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative group">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handlePlayPause(item)}
                        >
                          {currentSong?.id === item.id && isPlaying ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            item.type === 'listen' ? (
                              <Music className="h-6 w-6" />
                            ) : (
                              <Mic2 className="h-6 w-6" />
                            )
                          )}
                        </Button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {item.artist}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {formatDuration(item.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 