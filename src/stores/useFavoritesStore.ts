import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

interface FavoritesStore {
  favorites: Song[];
  addToFavorites: (song: Song, isPremium: boolean) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
}

const MAX_FREE_FAVORITES = 5;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addToFavorites: (song: Song, isPremium: boolean) => {
        const currentFavorites = get().favorites;
        const isSongFavorite = currentFavorites.some(fav => fav.id === song.id);

        if (isSongFavorite) {
          toast.error("Song is already in favorites");
          return;
        }

        if (!isPremium && currentFavorites.length >= MAX_FREE_FAVORITES) {
          toast.error(`Free accounts can only add ${MAX_FREE_FAVORITES} songs to favorites. Upgrade to Premium for unlimited favorites!`);
          return;
        }

        set({ favorites: [...currentFavorites, song] });
        toast.success("Added to favorites");
      },

      removeFromFavorites: (songId: string) => {
        set({ favorites: get().favorites.filter(song => song.id !== songId) });
        toast.success("Removed from favorites");
      },

      isFavorite: (songId: string) => {
        return get().favorites.some(song => song.id === songId);
      }
    }),
    {
      name: 'favorites-storage', // unique name for localStorage key
      skipHydration: true, // prevents hydration mismatch in Next.js
    }
  )
); 