'use client';

import axios from 'axios';

// Define interfaces for YouTube API responses
export interface YouTubeVideoId {
  kind: string;
  videoId: string;
}

export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
}

export interface YouTubeVideo {
  kind: string;
  id: YouTubeVideoId;
  snippet: YouTubeVideoSnippet;
}

export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}

class YouTubeService {
  private API_URL = '/api/youtube/search';
  private retryCount = 0;
  private maxRetries = 2;
  private isDemoMode = false;

  async searchSongs(query: string): Promise<YouTubeVideo[]> {
    console.log('Searching for songs with query:', query);

    try {
      // Make request to our API route
      const response = await axios.get(this.API_URL, {
        params: { q: query },
        timeout: 30000 // 30 second timeout for better reliability
      });

      console.log('Search API response status:', response.status);

      // Check if we got a valid response
      if (response.status !== 200) {
        console.error('Invalid search API response status:', response.status);
        throw new Error(`Invalid search API response: ${response.status}`);
      }

      // Ensure we have data
      if (!response.data) {
        console.error('No data in API response');
        throw new Error('No data in API response');
      }

      // Check if we're using demo data
      if (response.data.notice) {
        console.log('Demo data notice:', response.data.notice);
        this.isDemoMode = true;
      }

      // Check for error in response that isn't critical (e.g., demo data still provided)
      if (response.data.error && !response.data.items) {
        console.error('Error in API response:', response.data.error);
        throw new Error(response.data.error || 'Error in API response');
      }

      // Check if the response has items
      if (!response.data.items || !Array.isArray(response.data.items)) {
        console.error('Invalid items in API response');
        throw new Error('Invalid items in API response');
      }

      // Get valid videos 
      const validVideos = response.data.items.filter(
        (item: any) => item && item.id && item.id.videoId && item.snippet
      );

      if (validVideos.length === 0) {
        console.warn('No valid videos in response');
        throw new Error('No valid videos found');
      }

      console.log(`Found ${validVideos.length} valid videos${this.isDemoMode ? ' (demo data)' : ''}`);
      return validVideos;
    } catch (error: any) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
          
          // Extract error message from response if available
          const errorMessage = error.response.data?.error || error.response.data?.details || error.message;
          throw new Error(`API error: ${errorMessage}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          throw new Error('No response received from server. Please check your connection.');
        }
      }
      
      console.error('Search API error:', error.message || error);
      
      // Try again if retries are left and not in demo mode
      if (this.retryCount < this.maxRetries && !this.isDemoMode) {
        this.retryCount++;
        console.log(`Retrying search (attempt ${this.retryCount} of ${this.maxRetries})`);
        // Slight delay before retry, increasing with each retry
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.searchSongs(query);
      }
      
      // If all retries fail, throw the error
      throw new Error(error.message || 'Failed to search for songs after multiple attempts');
    }
  }

  resetRetryCount() {
    this.retryCount = 0;
  }

  getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;
  }

  getThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
}

export const youtubeService = new YouTubeService(); 