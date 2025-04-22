"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  PlayIcon,
  PauseIcon,
  Volume,
  VolumeXIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RotateCwIcon,
  Music
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  isRepeatOn?: boolean;
  isShuffleOn?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  className?: string;
}

export function AudioPlayer({ 
  src, 
  title,
  artist,
  isPlaying, 
  onPlayPause,
  isRepeatOn = false,
  isShuffleOn = false,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  className 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      if (isRepeatOn) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setCurrentTime(0);
        onPlayPause();
        if (onNext) onNext();
      }
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [onPlayPause, onNext, isRepeatOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, handle this case
          onPlayPause();
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayPause]);

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-4 w-full max-w-3xl p-4 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <audio ref={audioRef} src={src} />
      
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Music className="h-4 w-4 text-primary" />
        </div>
        {(title || artist) && (
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{title || 'Unknown'}</h4>
            <p className="text-xs text-muted-foreground truncate">{artist || 'Unknown'}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onShuffleToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-white"
            onClick={onShuffleToggle}
            disabled={isLoading}
          >
            <ShuffleIcon />
          </Button>
        )}

        {onPrevious && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-white"
            onClick={onPrevious}
            disabled={isLoading}
          >
            <SkipBackIcon />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:text-white"
          onClick={onPlayPause}
          disabled={isLoading}
        >
          {isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </Button>

        {onNext && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-white"
            onClick={onNext}
            disabled={isLoading}
          >
            <SkipForwardIcon />
          </Button>
        )}

        {onRepeatToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-white"
            onClick={onRepeatToggle}
            disabled={isLoading}
          >
            <RotateCwIcon />
          </Button>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            disabled={isLoading}
          />
          <span className="text-sm tabular-nums w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-white"
          onClick={toggleMute}
          disabled={isLoading}
        >
          {isMuted ? <VolumeXIcon /> : <Volume />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="w-24"
          disabled={isLoading}
        />
      </div>
    </div>
  );
} 