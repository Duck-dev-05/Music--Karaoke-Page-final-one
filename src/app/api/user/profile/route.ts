import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initializeDatabase, executeQuery } from '@/lib/db';

// Initialize database on first request
let isInitialized = false;

async function ensureDatabaseInitialized() {
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
}

// GET user profile
export async function GET(req: Request) {
  try {
    await ensureDatabaseInitialized();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;

    // Check if the requesting user has permission to view the profile
    if (userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch user profile from database
    const result = await executeQuery(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows.length) {
      // Create default profile for new users
      const defaultProfile = {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: 'user',
        bio: '',
        location: '',
        website: '',
        phone_number: '',
        email_notifications: false,
        push_notifications: false,
        premium: false
      };

      await executeQuery(
        `INSERT INTO users (
          id, name, email, image, role, bio, location, website, 
          phone_number, email_notifications, push_notifications, premium
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          defaultProfile.id,
          defaultProfile.name,
          defaultProfile.email,
          defaultProfile.image,
          defaultProfile.role,
          defaultProfile.bio,
          defaultProfile.location,
          defaultProfile.website,
          defaultProfile.phone_number,
          defaultProfile.email_notifications,
          defaultProfile.push_notifications,
          defaultProfile.premium
        ]
      );

      return NextResponse.json(defaultProfile);
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new NextResponse(
      'Error fetching profile',
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PATCH(request: Request) {
  try {
    await ensureDatabaseInitialized();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Update user profile in database
    const result = await executeQuery(
      `UPDATE users SET 
        name = COALESCE($1, name),
        bio = COALESCE($2, bio),
        location = COALESCE($3, location),
        website = COALESCE($4, website),
        phone_number = COALESCE($5, phone_number),
        email_notifications = COALESCE($6, email_notifications),
        push_notifications = COALESCE($7, push_notifications),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        body.name,
        body.bio,
        body.location,
        body.website,
        body.phoneNumber,
        body.emailNotifications,
        body.pushNotifications,
        session.user.id
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Log the activity
    await executeQuery(
      `INSERT INTO user_activities (user_id, activity_type, metadata)
      VALUES ($1, $2, $3)`,
      [
        session.user.id,
        'profile_updated',
        JSON.stringify({ updatedFields: Object.keys(body) })
      ]
    );

    return NextResponse.json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 