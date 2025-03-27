import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface FavoriteWithSong {
  id: string;
  song: {
    title: string;
    artist: string;
    thumbnailUrl: string;
    videoId: string;
  };
}

// GET /api/favorites - Get all favorites for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        song: true
      }
    }) as FavoriteWithSong[];

    return NextResponse.json({
      favorites: favorites.map(fav => ({
        id: fav.id,
        title: fav.song.title,
        artist: fav.song.artist,
        thumbnailUrl: fav.song.thumbnailUrl,
        videoId: fav.song.videoId
      }))
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add a song to favorites
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { songId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        songId: songId,
      },
      include: {
        song: true
      }
    }) as FavoriteWithSong;

    return NextResponse.json({
      favorite: {
        id: favorite.id,
        title: favorite.song.title,
        artist: favorite.song.artist,
        thumbnailUrl: favorite.song.thumbnailUrl,
        videoId: favorite.song.videoId
      }
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
