import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
  isPremium?: boolean;
}

interface AudioStore {
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffleOn: boolean;
  isRepeatOn: boolean;
  queue: Song[];
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsShuffleOn: (isShuffleOn: boolean) => void;
  setIsRepeatOn: (isRepeatOn: boolean) => void;
  setQueue: (songs: Song[]) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  isShuffleOn: false,
  isRepeatOn: false,
  queue: [],
  
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsShuffleOn: (isShuffleOn) => set({ isShuffleOn }),
  setIsRepeatOn: (isRepeatOn) => set({ isRepeatOn }),
  setQueue: (songs) => set({ queue: songs }),
  
  playNext: () => {
    const { currentSong, queue, isShuffleOn, isRepeatOn } = get();
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let nextIndex;

    if (isShuffleOn) {
      // Get random song excluding current
      const availableIndices = queue
        .map((_, index) => index)
        .filter(index => index !== currentIndex);
      
      if (availableIndices.length === 0) return;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (isRepeatOn) {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    set({ 
      currentSong: queue[nextIndex],
      isPlaying: true
    });
  },

  playPrevious: () => {
    const { currentSong, queue, isRepeatOn } = get();
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (isRepeatOn) {
        prevIndex = queue.length - 1;
      } else {
        return;
      }
    }

    set({ 
      currentSong: queue[prevIndex],
      isPlaying: true
    });
  }
})); 