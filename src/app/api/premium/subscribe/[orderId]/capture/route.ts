import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const captureData = await capturePayPalOrder(orderId);
    
    return NextResponse.json(captureData);
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
} 