import { Song, LyricLine } from './karaokeService';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

class YouTubeService {
  private static instance: YouTubeService;
  private apiKey: string;

  private constructor() {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }
    this.apiKey = YOUTUBE_API_KEY;
  }

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  async searchVideos(query: string, maxResults = 25): Promise<YouTubeVideo[]> {
    try {
      // First, search for videos
      const searchResponse = await fetch(
        `${YOUTUBE_API_URL}/search?part=snippet&q=${encodeURIComponent(
          query + ' karaoke'
        )}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
      );
      const searchData = await searchResponse.json();

      if (!searchData.items?.length) return [];

      // Get video IDs
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

      // Then get video details including duration
      const detailsResponse = await fetch(
        `${YOUTUBE_API_URL}/videos?part=contentDetails,snippet&id=${videoIds}&key=${this.apiKey}`
      );
      const detailsData = await detailsResponse.json();

      return detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: this.formatDuration(item.contentDetails.duration),
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await fetch(
        `${YOUTUBE_API_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`
      );
      const data = await response.json();
      const item = data.items?.[0];

      if (!item) return null;

      return {
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: this.formatDuration(item.contentDetails.duration),
      };
    } catch (error) {
      console.error('Error getting video details:', error);
      return null;
    }
  }

  async getVideoCaptions(videoId: string): Promise<LyricLine[]> {
    try {
      // Note: This is a simplified version. In a real application, you would need to:
      // 1. Get the caption track ID
      // 2. Download and parse the caption file
      // 3. Convert the captions to the LyricLine format
      // For now, we'll return mock lyrics
      return [
        { time: 0, text: "Loading lyrics..." },
        { time: 4, text: "Please wait while we fetch the lyrics" },
        { time: 8, text: "This feature requires additional setup" },
      ];
    } catch (error) {
      console.error('Error getting video captions:', error);
      return [];
    }
  }

  convertToSong(video: YouTubeVideo): Song {
    return {
      id: video.id,
      title: video.title,
      artist: video.artist,
      path: `https://www.youtube.com/embed/${video.id}`,
      lyrics: [], // Will be populated when needed
      duration: this.parseDuration(video.duration),
    };
  }

  private formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let result = '';
    if (hours) {
      result += `${hours}:`;
    }
    result += `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    return result;
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    return (
      (parseInt(hours) || 0) * 3600 +
      (parseInt(minutes) || 0) * 60 +
      (parseInt(seconds) || 0)
    );
  }
}

export const youtubeService = YouTubeService.getInstance(); 