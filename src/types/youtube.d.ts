interface YT {
  Player: {
    new (
      elementId: string,
      config: {
        height: string | number;
        width: string | number;
        videoId: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          disablekb?: number;
          [key: string]: any;
        };
        events?: {
          onReady?: (event: any) => void;
          onStateChange?: (event: any) => void;
          onError?: (event: any) => void;
          [key: string]: any;
        };
      }
    ): any;
  };
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady: () => void;
} 