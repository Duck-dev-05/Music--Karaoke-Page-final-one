import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function capturePayPalOrder(accessToken: string, orderId: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, planId } = body;

    if (!orderId || !planId) {
      return NextResponse.json(
        { error: 'Order ID and Plan ID are required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Capture the payment
    const captureData = await capturePayPalOrder(accessToken, orderId);

    if (captureData.error) {
      throw new Error(captureData.error.message);
    }

    // Update user's subscription status
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        premium: true,
        subscriptionPlan: planId,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: planId === 'yearly'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)  // 1 year
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // 30 days
        paymentId: captureData.id,
        paymentStatus: captureData.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment captured and subscription activated successfully',
      user: {
        id: user.id,
        premium: user.premium,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    );
  }
} 