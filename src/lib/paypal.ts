const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com';

export async function getPayPalAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured');
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('PayPal auth error:', data);
      throw new Error(data.error_description || 'Failed to get PayPal access token');
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

export async function createPayPalOrder(plan: string, amount: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            description: `${plan} Premium Plan`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal create order error:', data);
      throw new Error(data.message || "Failed to create PayPal order");
    }

    return data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

export async function capturePayPalOrder(paypalOrderId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal capture error:', data);
      throw new Error(data.message || "Failed to capture PayPal order");
    }

    return data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
} 