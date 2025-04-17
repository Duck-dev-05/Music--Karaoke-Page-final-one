import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's current subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      return new NextResponse("No active subscription found", { status: 404 });
    }

    // Update subscription to cancel at period end
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        status: "cancelling",
      },
    });

    // In a real application, you would also cancel the subscription with your payment provider here

    return NextResponse.json({
      message: "Subscription will be cancelled at the end of the billing period",
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 