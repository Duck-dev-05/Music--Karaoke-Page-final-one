import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient, Favorite } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// DELETE /api/favorites/[id] - Remove a song from favorites
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the favorite belongs to the user before deleting
    const favorite = await prisma.favorite.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    }) as Favorite | null;

    if (!favorite) {
      return NextResponse.json(
        { message: 'Favorite not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
