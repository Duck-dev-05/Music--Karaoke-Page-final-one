import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  // Add authentication logic here
  return NextResponse.json({ success: true });
} 