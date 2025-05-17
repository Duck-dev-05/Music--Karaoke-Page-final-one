"use client";

import React from "react";

export default function WebhooksPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Webhooks Debug & Info</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Configured Webhooks</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-mono font-semibold">/api/webhooks/stripe</span> <br />
            <span className="text-sm text-gray-600">Handles Stripe events (e.g., <span className="font-mono">checkout.session.completed</span>) to unlock premium features after payment.</span>
          </li>
          <li>
            <span className="font-mono font-semibold">/api/webhooks/paypal</span> <br />
            <span className="text-sm text-gray-600">Handles PayPal IPN events for premium activation/cancellation (if PayPal is enabled).</span>
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Stripe Webhook Setup</h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Set your <span className="font-mono">STRIPE_WEBHOOK_SECRET</span> in <span className="font-mono">.env</span>.</li>
          <li>In Stripe Dashboard, add an endpoint: <span className="font-mono">/api/webhooks/stripe</span>.</li>
          <li>For local dev, use <span className="font-mono">stripe listen --forward-to localhost:3000/api/webhooks/stripe</span>.</li>
        </ol>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Debugging Tips</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Check your server logs for <span className="font-mono">Stripe webhook received</span> and <span className="font-mono">User updated after Stripe payment</span> messages.</li>
          <li>If premium is not activated, check webhook delivery in the Stripe Dashboard.</li>
          <li>Make sure your database has <span className="font-mono">premiumPlan</span> and <span className="font-mono">premiumExpiresAt</span> fields in the <span className="font-mono">User</span> table.</li>
        </ul>
      </div>
      <div className="text-sm text-gray-500">
        Need help? Contact your developer or check the README for more info.
      </div>
    </div>
  );
} 