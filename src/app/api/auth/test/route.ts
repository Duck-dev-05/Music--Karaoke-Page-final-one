import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { 
          status: "unauthenticated",
          message: "You are not signed in"
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "authenticated",
      user: session.user,
      message: "You are signed in"
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "An error occurred while checking authentication"
      },
      { status: 500 }
    );
  }
} 