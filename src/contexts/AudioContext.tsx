'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration: number;
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Song[];
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const playSong = (song: Song) => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }

    const newAudio = new Audio(song.audioUrl);
    newAudio.volume = volume;
    
    newAudio.addEventListener('timeupdate', () => {
      setCurrentTime(newAudio.currentTime);
    });

    newAudio.addEventListener('ended', () => {
      if (repeatMode === 'one') {
        newAudio.currentTime = 0;
        newAudio.play();
      } else if (repeatMode === 'all') {
        playNext();
      } else if (queue.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        newAudio.currentTime = 0;
      }
    });

    setAudio(newAudio);
    setCurrentSong(song);
    newAudio.play();
    setIsPlaying(true);
    
    // Add to history
    setHistory(prev => [song, ...prev.filter(s => s.id !== song.id)]);
  };

  const pauseSong = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleToggleMute = () => {
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode(current => {
      if (current === 'off') return 'all';
      if (current === 'all') return 'one';
      return 'off';
    });
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let nextIndex = currentIndex + 1;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0;
    }
    
    playSong(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    
    playSong(queue[prevIndex]);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        audio,
        currentTime,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        queue,
        playSong,
        pauseSong,
        togglePlay,
        setVolume: handleVolumeChange,
        toggleMute: handleToggleMute,
        seekTo,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrevious,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 