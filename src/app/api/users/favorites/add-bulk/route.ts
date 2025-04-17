import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { songs } = await req.json();

    if (!Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json({ error: 'Invalid songs data' }, { status: 400 });
    }

    // Create favorites for each song
    const favorites = await Promise.all(
      songs.map(async (song) => {
        // First, create or find the song
        const createdSong = await prisma.song.upsert({
          where: { title: song.title },
          update: {},
          create: {
            title: song.title,
            artist: song.artist || 'Unknown Artist',
            duration: song.duration || 0,
            thumbnailUrl: song.thumbnailUrl || '',
            audioUrl: song.audioUrl || '',
          },
        });

        // Then create the favorite if it doesn't exist
        return prisma.favorite.upsert({
          where: {
            userId_songId: {
              userId: session.user.id,
              songId: createdSong.id,
            },
          },
          update: {},
          create: {
            userId: session.user.id,
            songId: createdSong.id,
          },
        });
      })
    );

    return NextResponse.json({ 
      message: `Successfully added ${favorites.length} songs to favorites`,
      favorites 
    });
  } catch (error) {
    console.error('Error adding favorites:', error);
    return NextResponse.json(
      { error: 'Error adding favorites' },
      { status: 500 }
    );
  }
} 