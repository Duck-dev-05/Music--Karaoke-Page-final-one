import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { message: 'Search query is required' },
        { status: 400 }
      );
    }

    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key is missing');
      return NextResponse.json(
        { message: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    const youtubeUrl = `${YOUTUBE_API_URL}?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
      query + ' karaoke'
    )}&key=${YOUTUBE_API_KEY}`;

    console.log('Fetching from YouTube API:', youtubeUrl.replace(YOUTUBE_API_KEY, 'REDACTED'));

    const response = await fetch(youtubeUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('YouTube API error:', data);
      return NextResponse.json(
        { message: `YouTube API error: ${data.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to search YouTube' },
      { status: 500 }
    );
  }
}