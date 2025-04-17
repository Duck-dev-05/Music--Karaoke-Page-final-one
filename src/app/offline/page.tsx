"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  CheckCircle,
  Music,
  Mic2,
  WifiOff,
  HardDrive,
  RefreshCcw,
  AlertCircle
} from "lucide-react";

// Mock offline content
const OFFLINE_CONTENT = {
  songs: [
    { id: 1, name: "Bohemian Rhapsody", artist: "Queen", size: "15MB", downloaded: true },
    { id: 2, name: "Sweet Child O' Mine", artist: "Guns N' Roses", size: "12MB", downloaded: false },
    { id: 3, name: "Hotel California", artist: "Eagles", size: "14MB", downloaded: true },
    { id: 4, name: "Imagine", artist: "John Lennon", size: "10MB", downloaded: false },
    { id: 5, name: "Stairway to Heaven", artist: "Led Zeppelin", size: "16MB", downloaded: false }
  ],
  totalStorage: 1024, // 1GB
  usedStorage: 256, // 256MB
};

export default function OfflinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});
  const [offlineContent, setOfflineContent] = useState(OFFLINE_CONTENT);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "premium") {
      router.push("/premium");
    }

    // Check online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [session, status, router]);

  const handleDownload = async (songId: number) => {
    const song = offlineContent.songs.find(s => s.id === songId);
    if (!song) return;

    // Simulate download progress
    setDownloadProgress(prev => ({ ...prev, [songId]: 0 }));
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDownloadProgress(prev => ({ ...prev, [songId]: progress }));
    }

    // Update downloaded status
    setOfflineContent(prev => ({
      ...prev,
      songs: prev.songs.map(s => 
        s.id === songId ? { ...s, downloaded: true } : s
      )
    }));

    setDownloadProgress(prev => ({ ...prev, [songId]: undefined }));
  };

  const storageUsagePercentage = (offlineContent.usedStorage / offlineContent.totalStorage) * 100;

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Offline Mode</h1>
          <p className="text-muted-foreground">Download songs to play without internet</p>
        </div>
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      {/* Storage Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Status
          </CardTitle>
          <CardDescription>
            {offlineContent.usedStorage}MB used of {offlineContent.totalStorage}MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={storageUsagePercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Downloaded Songs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Downloaded Songs
          </CardTitle>
          <CardDescription>
            Songs available for offline play
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineContent.songs.filter(song => song.downloaded).map(song => (
              <div key={song.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-sm text-muted-foreground">{song.artist} • {song.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Downloaded
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/karaoke/${song.id}`)}>
                    <Mic2 className="h-4 w-4 mr-2" />
                    Practice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available for Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Available for Download
          </CardTitle>
          <CardDescription>
            Download more songs for offline access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineContent.songs.filter(song => !song.downloaded).map(song => (
              <div key={song.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-sm text-muted-foreground">{song.artist} • {song.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  {downloadProgress[song.id] !== undefined ? (
                    <div className="w-32">
                      <Progress value={downloadProgress[song.id]} className="h-2" />
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleDownload(song.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Offline Mode Instructions */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">How to use Offline Mode:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Download songs while you have internet connection</li>
              <li>Songs will be stored on your device for offline access</li>
              <li>Practice and improve your singing even without internet</li>
              <li>Your scores will sync when you're back online</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 