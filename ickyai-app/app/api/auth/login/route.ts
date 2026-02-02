import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Simple hardcoded auth for now (demo)
    const VALID_EMAIL = 'Klemen.witwicky@gmail.com';
    const VALID_PASSWORD = 'Icky44ewa';

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: email
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
