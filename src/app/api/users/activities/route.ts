import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'all';
    const limit = Number(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if the requesting user has permission
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user activities based on type
    const activities = await prisma.userActivity.findMany({
      where: {
        userId,
        ...(type !== 'all' && { type })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      include: {
        song: {
          select: {
            id: true,
            title: true,
            artist: true,
            thumbnailUrl: true
          }
        },
        playlist: {
          select: {
            id: true,
            name: true,
            songCount: true
          }
        }
      }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Activities fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching activities' },
      { status: 500 }
    );
  }
} 