'use client';

import { useAudio } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Playbar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
  } = useAudio();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={currentSong.thumbnailUrl}
              alt={currentSong.title}
              className="h-12 w-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{currentSong.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {currentSong.artist}
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleShuffle}
              >
                <Shuffle className={cn("h-4 w-4", isShuffled && "text-primary")} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={playPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={playNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleRepeat}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="h-4 w-4 text-primary" />
                ) : (
                  <Repeat className={cn("h-4 w-4", repeatMode === 'all' && "text-primary")} />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2 text-sm">
              <span className="w-12 text-right text-muted-foreground">
                {formatDuration(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                min={0}
                max={currentSong.duration}
                step={1}
                onValueChange={(value) => seekTo(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-muted-foreground">
                {formatDuration(currentSong.duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 justify-end">
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
              onValueChange={(value) => setVolume(value[0])}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 