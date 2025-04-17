interface YouTubeEvent {
  target: YT.Player;
  data: number;
}

interface YouTubeError extends YouTubeEvent {
  data: number;  // Error code
}

interface YT {
  Player: {
    new (
      elementId: string,
      config: {
        height: string | number;
        width: string | number;
        videoId: string;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          disablekb?: 0 | 1;
          enablejsapi?: 0 | 1;
          fs?: 0 | 1;
          loop?: 0 | 1;
          modestbranding?: 0 | 1;
          mute?: 0 | 1;
          playsinline?: 0 | 1;
          rel?: 0 | 1;
          showinfo?: 0 | 1;
          start?: number;
          end?: number;
        };
        events?: {
          onReady?: (event: YouTubeEvent) => void;
          onStateChange?: (event: YouTubeEvent) => void;
          onError?: (event: YouTubeError) => void;
          onPlaybackQualityChange?: (event: YouTubeEvent) => void;
          onPlaybackRateChange?: (event: YouTubeEvent) => void;
          onApiChange?: (event: YouTubeEvent) => void;
        };
      }
    ): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  interface Player {
    // Playback controls and player settings
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    
    // Player state
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoLoadedFraction(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    
    // Video information
    getVideoData(): {
      author: string;
      title: string;
      video_id: string;
      video_quality: string;
      video_quality_features: string[];
    };
    
    // Playlist functions
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    loadVideoByUrl(mediaContentUrl: string, startSeconds?: number): void;
    cueVideoByUrl(mediaContentUrl: string, startSeconds?: number): void;
    
    // DOM Container
    getIframe(): HTMLIFrameElement;
    destroy(): void;
  }
} 