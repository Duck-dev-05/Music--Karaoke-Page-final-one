import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

// In-memory lock map (per server instance)
const sessionLocks = new Map<string, boolean>();

export async function POST(req: Request) {
  // Try to get user email and planId from request body, fallback to IP
  let email = '';
  let planId = '';
  let ip = req.headers.get('x-forwarded-for') || 'unknown';
  let key = ip;
  try {
    const body = await req.json();
    email = body.email;
    planId = body.planId;
    if (email) key = email;
    // Re-parse body for priceId
    const priceId = body.priceId;
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }
    if (sessionLocks.get(key)) {
      return NextResponse.json({ error: 'A payment is already in progress. Please wait.' }, { status: 429 });
    }
    sessionLocks.set(key, true);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/cancel`,
      metadata: email || planId ? { email, planId } : undefined,
      customer_email: email || undefined,
    });
    sessionLocks.delete(key);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    sessionLocks.delete(key);
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
  }
} 