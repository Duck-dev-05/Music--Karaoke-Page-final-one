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

    // Get the payment info from request body
    const body = await req.json();
    const { paymentSuccessful = true, isTestAccount = false } = body;

    if (!paymentSuccessful) {
      return new NextResponse("Payment failed", { status: 400 });
    }

    // Calculate subscription dates
    const now = new Date();
    const nextBillingDate = new Date(now.setMonth(now.getMonth() + 1));

    // Update user to premium status and create subscription record
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        premium: true,
        role: isTestAccount ? "test_premium" : "premium",
        isTestAccount: isTestAccount,
        updatedAt: new Date(),
        subscription: {
          create: {
            status: "active",
            plan: isTestAccount ? "test_premium" : "premium",
            priceId: isTestAccount ? "price_test_0" : "price_monthly_999",
            currentPeriodStart: new Date(),
            currentPeriodEnd: nextBillingDate,
            cancelAtPeriodEnd: false,
            maxFavorites: isTestAccount ? 10 : null,
            maxPlaylists: isTestAccount ? 3 : null,
            features: isTestAccount ? [
              "basic_karaoke",
              "limited_favorites",
              "limited_playlists",
              "test_content"
            ] : [
              "unlimited_favorites",
              "unlimited_playlists",
              "ad_free",
              "priority_support",
              "high_quality_audio",
              "offline_mode",
              "exclusive_content",
              "custom_themes"
            ],
            paymentMethod: !isTestAccount ? {
              create: {
                type: "card",
                last4: "4242",
                brand: "visa",
                expiryMonth: 12,
                expiryYear: 2025,
              }
            } : undefined,
            payments: !isTestAccount ? {
              create: {
                amount: 999,
                currency: "usd",
                status: "succeeded",
                paymentMethod: "card",
              }
            } : undefined
          }
        }
      },
      include: {
        subscription: {
          include: {
            paymentMethod: true,
            payments: true
          }
        }
      }
    });

    return NextResponse.json({
      message: isTestAccount ? "Successfully created test premium account" : "Successfully upgraded to premium",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        premium: updatedUser.premium,
        role: updatedUser.role,
        isTestAccount: updatedUser.isTestAccount,
        subscription: updatedUser.subscription
      },
    });
  } catch (error) {
    console.error("[PREMIUM_UPGRADE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 