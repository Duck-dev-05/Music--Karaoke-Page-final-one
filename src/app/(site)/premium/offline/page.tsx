"use client";

import {
  DownloadIcon,
  CheckIcon,
  Trash2Icon,
  HardDriveIcon,
  WifiIcon,
  AlertCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  size: string;
  downloaded: boolean;
}

export default function OfflineModePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, subscription } = useUser();
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});
  const [offlineContent, setOfflineContent] = useState<{
    totalSpace: string;
    usedSpace: string;
    availableSpace: string;
    songs: Song[];
  }>({
    totalSpace: "64 GB",
    usedSpace: "2.5 GB",
    availableSpace: "61.5 GB",
    songs: [
      {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: "3:54",
        size: "8.2 MB",
        downloaded: false
      },
      {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20",
        size: "7.8 MB",
        downloaded: true
      },
      {
        id: 3,
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: "3:29",
        size: "7.5 MB",
        downloaded: false
      }
    ]
  });

  useEffect(() => {
    if (!user || !subscription) {
      router.replace("/");
      return;
    }
  }, [user, subscription, router]);

  const handleDownload = (songId: number) => {
    if (!subscription) {
      toast({
        title: "Premium Required",
        description: "Please upgrade to premium to download songs",
        variant: "destructive"
      });
      return;
    }

    setDownloadProgress((prev) => ({
      ...prev,
      [songId]: 0
    }));

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const currentProgress = prev[songId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setOfflineContent((prevContent) => ({
            ...prevContent,
            songs: prevContent.songs.map((song) =>
              song.id === songId ? { ...song, downloaded: true } : song
            )
          }));
          toast({
            title: "Download Complete",
            description: "Song is now available offline",
          });
          return prev;
        }
        return {
          ...prev,
          [songId]: Math.min(currentProgress + 10, 100)
        };
      });
    }, 500);
  };

  const handleDelete = (songId: number) => {
    setOfflineContent((prevContent) => ({
      ...prevContent,
      songs: prevContent.songs.map((song) =>
        song.id === songId ? { ...song, downloaded: false } : song
      )
    }));
    toast({
      title: "Song Removed",
      description: "Song has been removed from offline storage",
    });
  };

  if (!user || !subscription) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDriveIcon className="h-5 w-5" />
              <CardTitle>Storage Status</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <WifiIcon className="h-4 w-4" />
              Offline Mode
            </Badge>
          </div>
          <CardDescription>Manage your offline content and storage space</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={30} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Space</p>
                <p className="font-medium">{offlineContent.totalSpace}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Used Space</p>
                <p className="font-medium">{offlineContent.usedSpace}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available Space</p>
                <p className="font-medium">{offlineContent.availableSpace}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Downloaded Songs</CardTitle>
          <CardDescription>Manage your offline songs library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineContent.songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {song.artist} • {song.duration} • {song.size}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {song.downloaded ? (
                    <>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckIcon className="h-4 w-4" />
                        Downloaded
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(song.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </>
                  ) : downloadProgress[song.id] !== undefined ? (
                    <div className="w-[100px]">
                      <Progress value={downloadProgress[song.id]} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleDownload(song.id)}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircleIcon className="h-4 w-4" />
            Downloads are only available for premium users
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 