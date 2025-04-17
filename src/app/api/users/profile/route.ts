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

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if the requesting user has permission to view the profile
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to find the user
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        premium: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            favorites: true,
            playlists: true
          }
        }
      }
    });

    // If user doesn't exist, try to find by email first
    if (!user && session.user.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          location: true,
          website: true,
          premium: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              favorites: true,
              playlists: true
            }
          }
        }
      });

      // If user exists with email but different id, update the id
      if (user && user.id !== userId) {
        user = await prisma.user.update({
          where: { email: session.user.email },
          data: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            location: true,
            website: true,
            premium: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                favorites: true,
                playlists: true
              }
            }
          }
        });
      }
      // If user doesn't exist at all, create new
      else if (!user) {
        user = await prisma.user.create({
          data: {
            id: userId,
            name: session.user.name || '',
            email: session.user.email,
            image: session.user.image || '',
            bio: '',
            location: '',
            website: '',
            premium: false,
          },
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            location: true,
            website: true,
            premium: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                favorites: true,
                playlists: true
              }
            }
          }
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the data to match the ProfileData interface
    const profileData = {
      ...user,
      total_favorites: user._count.favorites,
      total_playlists: user._count.playlists,
      isTestAccount: session.user.email?.includes('@test.com') || false
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    );
  }
} 