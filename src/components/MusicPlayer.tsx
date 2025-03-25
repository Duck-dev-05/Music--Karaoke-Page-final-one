import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ForwardIcon,
  BackwardIcon,
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  currentSong: {
    title: string;
    path: string;
    artist?: string;
  } | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: string) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onEnded: () => void;
}

export function MusicPlayer({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isRepeat,
  isShuffle,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onEnded
}: MusicPlayerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout>();

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const playAudio = async () => {
      try {
        setIsLoading(true);
        if (isPlaying) {
          await audioRef.current?.play();
        } else {
          audioRef.current?.pause();
        }
      } catch (error) {
        console.error('Error controlling playback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    playAudio();
  }, [isPlaying, currentSong]);

  // Handle song changes
  useEffect(() => {
    if (!currentSong) return;

    const loadNewSong = async () => {
      if (!audioRef.current) return;
      
      setIsLoading(true);
      audioRef.current.src = currentSong.path;
      audioRef.current.load();

      try {
        if (isPlaying) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error loading new song:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewSong();
  }, [currentSong?.path]);

  // Smooth visibility transition
  useEffect(() => {
    setIsVisible(!!currentSong);
  }, [currentSong]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleFadeIn = () => {
    if (audioRef.current) {
      let currentVol = 0;
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      
      fadeInterval.current = setInterval(() => {
        currentVol = Math.min(currentVol + 0.1, volume);
        if (audioRef.current) {
          audioRef.current.volume = currentVol;
        }
        if (currentVol >= volume) {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
        }
      }, 50);
    }
  };

  const handleFadeOut = () => {
    if (audioRef.current) {
      let currentVol = audioRef.current.volume;
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      
      fadeInterval.current = setInterval(() => {
        currentVol = Math.max(currentVol - 0.1, 0);
        if (audioRef.current) {
          audioRef.current.volume = currentVol;
        }
        if (currentVol <= 0) {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          if (!currentSong) {
            setIsVisible(false);
            setTimeout(onEnded, 300);
          }
        }
      }, 50);
    }
  };

  // Handle audio metadata loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setTotalDuration(audio.duration);
      onDurationChange(formatTime(audio.duration));
    };

    const handleEnded = () => {
      onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, onDurationChange, onEnded]);

  const formatTime = useCallback((time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleProgressChange = useCallback((value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  }, [onTimeUpdate]);

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    }
  };

  if (!currentSong) return null;

  return (
    <Card 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 p-4 bg-background/80 backdrop-blur-md border rounded-2xl shadow-xl w-[95%] max-w-3xl z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <audio 
        ref={audioRef} 
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          setTotalDuration(audio.duration);
          onDurationChange(formatTime(audio.duration));
        }}
      />
      <div className="flex flex-col gap-3">
        {/* Song Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 8v-4" />
              <path d="M12 16v4" />
              <path d="M16 12h4" />
              <path d="M4 12h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{currentSong.title}</h3>
            {currentSong.artist && (
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-lg", isRepeat && "text-primary bg-primary/10")}
              onClick={onToggleRepeat}
              title="Toggle repeat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11v-1a4 4 0 014-4h14" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v1a4 4 0 01-4 4H3" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-lg", isShuffle && "text-primary bg-primary/10")}
              onClick={onToggleShuffle}
              title="Toggle shuffle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                <path d="m18 2 4 4-4 4" />
                <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                <path d="m18 14 4 4-4 4" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="relative w-full group">
            <Slider
              value={[currentTime]}
              max={totalDuration || duration || 100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="flex-1"
            />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded-md text-xs">
              {formatTime(currentTime)} / {formatTime(totalDuration || duration)}
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(totalDuration || duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-[140px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={onToggleMute}
            >
              {isMuted || volume === 0 ? (
                <SpeakerXMarkIcon className="h-5 w-5" />
              ) : (
                <SpeakerWaveIcon className="h-5 w-5" />
              )}
            </Button>
            <div className="relative group">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => onVolumeChange(value[0])}
                className="w-24"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded-md text-xs">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:scale-105 transition-transform"
              onClick={onPrevious}
              title="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
              onClick={onPlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-6 w-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="h-6 w-6 text-primary-foreground" />
              ) : (
                <PlayIcon className="h-6 w-6 text-primary-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:scale-105 transition-transform"
              onClick={onNext}
              title="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="min-w-[140px] flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground rounded-lg px-2"
              onClick={() => seek(-10)}
            >
              -10s
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground rounded-lg px-2"
              onClick={() => seek(10)}
            >
              +10s
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}