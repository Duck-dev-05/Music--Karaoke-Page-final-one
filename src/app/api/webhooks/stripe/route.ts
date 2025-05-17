import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Stripe webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || (session.metadata && session.metadata.email);
    const planId = session.metadata && session.metadata.planId;
    if (!email) {
      console.error('No email found in Stripe session');
      return NextResponse.json({ error: 'No email in session' }, { status: 400 });
    }
    try {
      // Set premium true, store plan, set expiration (1 month default)
      const now = new Date();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + 1);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          premium: true,
          premiumPlan: planId || 'default',
          premiumExpiresAt: expires,
        },
      });
      console.log('User updated after Stripe payment:', updatedUser);
      return NextResponse.json({ received: true });
    } catch (err) {
      console.error('Failed to update user after Stripe payment', err);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
} 