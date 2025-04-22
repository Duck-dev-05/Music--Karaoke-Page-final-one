import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { orderId, planId, transactionId } = body;

    if (!orderId || !planId || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Find the user
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate expiration date based on plan
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + (planId.includes("yearly") ? 12 : 1));

      // Update user's premium status
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          premium: true,
          premiumPlan: planId,
          premiumExpiresAt: expiresAt,
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          orderId,
          transactionId,
          planId,
          userId: user.id,
          status: "completed",
        },
      });

      return { user: updatedUser, transaction };
    });

    return NextResponse.json({
      success: true,
      message: "Premium activated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error activating premium:", error);
    return NextResponse.json(
      { error: "Failed to activate premium" },
      { status: 500 }
    );
  }
} 