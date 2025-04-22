import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Replace this with your actual database query
    // This is just a mock implementation
    const hasActiveSubscription = false;

    return NextResponse.json({
      hasActiveSubscription,
      message: hasActiveSubscription 
        ? "User has an active subscription" 
        : "No active subscription found"
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 