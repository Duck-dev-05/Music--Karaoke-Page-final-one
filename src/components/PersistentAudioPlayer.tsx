"use client";

import { useAudio } from "./AudioProvider";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

export function PersistentAudioPlayer() {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentSongUrl,
    togglePlay,
    setVolume,
    seek
  } = useAudio();

  if (!currentSongUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 md:gap-8">
        <div className="flex flex-1 items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={togglePlay}
            disabled={!currentSongUrl}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </Button>

          <div className="flex flex-1 items-center gap-4">
            <span className="w-12 text-sm tabular-nums">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={1}
              onValueChange={(value) => seek(value[0])}
              className="flex-1"
            />
            <span className="w-12 text-sm tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
          >
            {volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle mute</span>
          </Button>
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
} 