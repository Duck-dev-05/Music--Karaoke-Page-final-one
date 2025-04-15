import { NextResponse } from 'next/server';

const testAccounts = [
  { email: 'user@test.com', password: 'test123', type: 'Free User' },
  { email: 'premium@test.com', password: 'test123', type: 'Premium User' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find matching test account
    const testAccount = testAccounts.find(
      account => account.email === email && account.password === password
    );

    if (testAccount) {
      return NextResponse.json({
        success: true,
        user: {
          id: testAccount.email,
          email: testAccount.email,
          name: testAccount.type,
          type: testAccount.type,
        },
      });
    }

    // No matching test account found
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 