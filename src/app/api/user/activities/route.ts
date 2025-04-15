import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserActivity } from '@/lib/db/users';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const activities = await getUserActivity(session.user.id, limit);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return new NextResponse(
      'Error fetching activities',
      { status: 500 }
    );
  }
} 