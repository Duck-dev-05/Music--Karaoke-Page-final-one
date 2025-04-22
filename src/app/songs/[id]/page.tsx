'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration: number;
}

// Mock data - In a real app, this would come from your API
const mockSongs: Record<string, Song> = {
  '1': {
    id: '1',
    title: 'Trường Sơn Đông Trường Sơn Tây Remix',
    artist: 'Độ Mixi',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix.mp3',
    duration: 245
  },
  '2': {
    id: '2',
    title: 'Đắp Mộ Cuộc Tình',
    artist: 'Đan Nguyên, Bằng Kiều, Quang Lê',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126.mp3',
    duration: 390
  },
  '3': {
    id: '3',
    title: 'Way Back Home',
    artist: 'SHAUN ft. Various Artists',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Way Back Home Về Nhà Thôi  SHAUN ft 20 Nghệ Sĩ Việt Nam  Gala Nhạc Việt Official MV.mp3',
    duration: 246
  },
  '4': {
    id: '4',
    title: 'Sẽ Không Còn Nữa',
    artist: 'Tuấn Hưng',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Sẽ Không Còn Nữa  Tuấn Hưng.mp3',
    duration: 294
  },
  '5': {
    id: '5',
    title: 'Stream Đến Bao Giờ',
    artist: 'Độ Mixi ft. Bạn Sáng Tác',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - STREAM ĐẾN BAO GIỜ  ĐỘ MIXI ft BẠN SÁNG TÁC OFFICIAL LYRICS VIDEO.mp3',
    duration: 186
  }
};

export default function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Simulate fetching song data
    const fetchSong = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const songData = mockSongs[id as string];
        if (!songData) throw new Error('Song not found');
        
        setSong(songData);
        
        // Initialize audio
        const newAudio = new Audio(songData.audioUrl);
        newAudio.volume = volume;
        setAudio(newAudio);

        // Add event listeners
        newAudio.addEventListener('timeupdate', () => {
          setCurrentTime(newAudio.currentTime);
        });

        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
          newAudio.currentTime = 0;
        });

      } catch (error) {
        console.error('Error fetching song:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();

    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [id]);

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audio) return;
    const time = value[0];
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="flex gap-6">
                <Skeleton className="h-48 w-48 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Song Not Found</h2>
              <p className="text-muted-foreground">The requested song could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Song Image */}
            <div className="relative w-full md:w-48 h-48">
              <img
                src={song.thumbnailUrl}
                alt={song.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Song Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{song.title}</h1>
                <p className="text-muted-foreground">{song.artist}</p>
              </div>

              {/* Playback Controls */}
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={song.duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8" />
                    )}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 