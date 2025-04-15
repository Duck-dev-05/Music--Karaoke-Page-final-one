import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      image, 
      bio, 
      location, 
      website, 
      phoneNumber,
      theme,
      language,
      emailNotifications,
      pushNotifications
    } = body;

    // Try to find the user first
    let user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          image: session.user.image || '',
          theme: 'system',
          language: 'en',
          emailNotifications: true,
          pushNotifications: true,
          premium: false,
        },
      });
    }

    // Now update the user
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: name ?? user.name,
        image: image ?? user.image,
        bio: bio ?? user.bio,
        location: location ?? user.location,
        website: website ?? user.website,
        phoneNumber: phoneNumber ?? user.phoneNumber,
        theme: theme ?? user.theme ?? 'system',
        language: language ?? user.language ?? 'en',
        emailNotifications: emailNotifications ?? user.emailNotifications ?? true,
        pushNotifications: pushNotifications ?? user.pushNotifications ?? true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[USER_UPDATE]", error);
    
    if (error.code === 'P2025') {
      return new NextResponse("Failed to update user", { status: 400 });
    }
    
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
