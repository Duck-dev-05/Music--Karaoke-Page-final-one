import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateUserProfile, updateUserStats, logUserActivity } from '@/lib/db/users';
import { userProfileSchema } from '@/lib/db/schema';

// Simulated user profiles database
const userProfiles = new Map([
  ['user@test.com', {
    id: 'user@test.com',
    fullName: 'Free User',
    email: 'user@test.com',
    type: 'Free User',
    profilePicture: '',
    bio: 'Music enthusiast',
    favoriteGenres: ['Pop', 'Rock'],
    totalSongs: 0,
    totalPlaylists: 0,
    joinedDate: '2024-01-01',
    lastActive: new Date().toISOString(),
  }],
  ['premium@test.com', {
    id: 'premium@test.com',
    fullName: 'Premium User',
    email: 'premium@test.com',
    type: 'Premium User',
    profilePicture: '',
    bio: 'Professional singer',
    favoriteGenres: ['Jazz', 'Classical', 'R&B'],
    totalSongs: 15,
    totalPlaylists: 3,
    joinedDate: '2024-01-01',
    lastActive: new Date().toISOString(),
  }],
]);

// GET user profile
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;

    // Check if the requesting user has permission to view the profile
    if (userId !== session.user.id) {
      // Add your permission logic here
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const profile = await getUserProfile(userId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new NextResponse(
      'Error fetching profile',
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userProfile = userProfiles.get(session.user.email);

    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updatedProfile = {
      ...userProfile,
      fullName: body.fullName || userProfile.fullName,
      profilePicture: body.profilePicture || userProfile.profilePicture,
      bio: body.bio || userProfile.bio,
      favoriteGenres: body.favoriteGenres || userProfile.favoriteGenres,
      lastActive: new Date().toISOString(),
    };

    userProfiles.set(session.user.email, updatedProfile);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = userProfileSchema.partial().parse(body);

    // Update user profile
    const updatedProfile = await updateUserProfile(session.user.id, validatedData);

    // Update stats if provided
    if (body.stats) {
      await updateUserStats(session.user.id, body.stats);
    }

    // Log activity
    await logUserActivity(session.user.id, 'PROFILE_UPDATE', {
      updatedFields: Object.keys(validatedData)
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse(
      'Error updating profile',
      { status: 500 }
    );
  }
} 