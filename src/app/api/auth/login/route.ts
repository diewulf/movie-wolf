import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken } from '@/service/auth';

const VALID_USER = {
  username: 'admin',
  password: 'wolf123',
};

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === VALID_USER.username && password === VALID_USER.password) {
    const token = await signToken({ username });

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 horas
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
