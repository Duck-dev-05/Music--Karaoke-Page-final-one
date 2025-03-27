interface Config {
  youtubeApiKey: string;
  youtubeApiUrl: string;
}

const config: Config = {
  youtubeApiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
  youtubeApiUrl: 'https://www.googleapis.com/youtube/v3',
};

export default config;
