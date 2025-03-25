import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
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
      return NextResponse.json(
        { message: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
        query + ' karaoke'
      )}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json(
      { message: 'Failed to search YouTube' },
      { status: 500 }
    );
  }
} 