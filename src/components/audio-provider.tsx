"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";

interface AudioStore {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioElement: HTMLAudioElement | null;
  currentSongUrl: string | null;
  togglePlay: () => void;
  setCurrentSongUrl: (url: string) => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioStore | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleSetVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  }, []);

  const handleSetCurrentSongUrl = useCallback((url: string) => {
    setCurrentSongUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);
    } else {
      audioRef.current.src = url;
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded]);

  const value = {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioElement: audioRef.current,
    currentSongUrl,
    togglePlay,
    setCurrentSongUrl: handleSetCurrentSongUrl,
    setVolume: handleSetVolume,
    seek,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
} 