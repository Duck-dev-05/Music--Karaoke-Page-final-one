import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAYPAL_VERIFY_URL = process.env.NODE_ENV === 'production'
  ? 'https://ipnpb.paypal.com/cgi-bin/webscr'
  : 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

async function verifyPayPalIPN(body: string) {
  const verifyResponse = await fetch(PAYPAL_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `cmd=_notify-validate&${body}`,
  });

  const verificationResult = await verifyResponse.text();
  return verificationResult === 'VERIFIED';
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const isVerified = await verifyPayPalIPN(body);

    if (!isVerified) {
      console.error('PayPal IPN verification failed');
      return NextResponse.json(
        { error: 'IPN verification failed' },
        { status: 400 }
      );
    }

    // Parse the IPN message
    const params = new URLSearchParams(body);
    const txnType = params.get('txn_type');
    const paymentStatus = params.get('payment_status');
    const paymentId = params.get('txn_id');
    const customData = JSON.parse(params.get('custom') || '{}');
    const userId = customData.userId;

    if (!userId) {
      console.error('User ID not found in IPN message');
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    switch (txnType) {
      case 'subscr_payment':
        if (paymentStatus === 'Completed') {
          // Update subscription status
          await prisma.user.update({
            where: { id: userId },
            data: {
              premium: true,
              paymentStatus: 'completed',
              lastPaymentDate: new Date(),
            },
          });
        }
        break;

      case 'subscr_cancel':
      case 'subscr_eot':
        // End of subscription term or cancellation
        await prisma.user.update({
          where: { id: userId },
          data: {
            premium: false,
            subscriptionEndDate: new Date(),
            paymentStatus: 'cancelled',
          },
        });
        break;

      case 'subscr_failed':
        // Failed payment
        await prisma.user.update({
          where: { id: userId },
          data: {
            paymentStatus: 'failed',
          },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing PayPal IPN:', error);
    return NextResponse.json(
      { error: 'Failed to process IPN' },
      { status: 500 }
    );
  }
} 