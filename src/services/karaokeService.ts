import { youtubeService, YouTubeVideo } from './youtubeService';

export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  path: string;
  thumbnail?: string;
  duration: number;
  lyrics: LyricLine[];
}

class KaraokeService {
  private static instance: KaraokeService;
  private youtubeService = youtubeService;
  private recentSearches: string[] = [];
  private selectedSongs: Song[] = [];

  private constructor() {}

  public static getInstance(): KaraokeService {
    if (!KaraokeService.instance) {
      KaraokeService.instance = new KaraokeService();
    }
    return KaraokeService.instance;
  }

  async searchSongs(query: string): Promise<Song[]> {
    try {
      const videos = await this.youtubeService.searchVideos(query);
      const songs = videos.map(video => this.convertVideoToSong(video));
      
      // Add to recent searches if not empty query
      if (query.trim()) {
        this.addToRecentSearches(query);
      }
      
      return songs;
    } catch (error) {
      console.error('Error searching songs:', error);
      return [];
    }
  }

  async getSongById(id: string): Promise<Song | null> {
    try {
      const video = await this.youtubeService.getVideoDetails(id);
      if (!video) return null;
      return this.convertVideoToSong(video);
    } catch (error) {
      console.error('Error getting song details:', error);
      return null;
    }
  }

  getRecentSearches(): string[] {
    return this.recentSearches;
  }

  getSelectedSongs(): Song[] {
    return this.selectedSongs;
  }

  addToSelectedSongs(song: Song) {
    if (!this.selectedSongs.find(s => s.id === song.id)) {
      this.selectedSongs.push(song);
    }
  }

  removeFromSelectedSongs(songId: string) {
    this.selectedSongs = this.selectedSongs.filter(song => song.id !== songId);
  }

  clearSelectedSongs() {
    this.selectedSongs = [];
  }

  private addToRecentSearches(query: string) {
    // Remove if exists and add to front
    this.recentSearches = this.recentSearches.filter(q => q !== query);
    this.recentSearches.unshift(query);
    
    // Keep only last 10 searches
    if (this.recentSearches.length > 10) {
      this.recentSearches.pop();
    }
  }

  private convertVideoToSong(video: YouTubeVideo): Song {
    return {
      id: video.id,
      title: video.title,
      artist: video.artist,
      path: `https://www.youtube.com/embed/${video.id}`,
      thumbnail: video.thumbnail,
      duration: this.parseDuration(video.duration),
      lyrics: [], // Will be populated when needed
    };
  }

  private parseDuration(duration: string): number {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  }
}

export const karaokeService = KaraokeService.getInstance(); 