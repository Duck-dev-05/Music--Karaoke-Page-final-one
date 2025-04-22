import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, expirationDate } = await req.json();

    // Update user's premium status
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isPremium: true,
        premiumPlan: plan,
        premiumExpiresAt: new Date(expirationDate),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Premium update error:', error);
    return NextResponse.json(
      { error: 'Failed to update premium status' },
      { status: 500 }
    );
  }
} 