import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ items: [], error: 'YouTube API key not configured.' }, { status: 500 });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(q)}&key=${apiKey}`;

  try {
    const ytRes = await fetch(url);
    if (!ytRes.ok) {
      return NextResponse.json({ items: [], error: 'Failed to fetch from YouTube API.' }, { status: 500 });
    }
    const ytData = await ytRes.json();
    return NextResponse.json({ items: ytData.items });
  } catch (err) {
    return NextResponse.json({ items: [], error: 'YouTube API error.' }, { status: 500 });
  }
} 