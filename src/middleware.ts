import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/service/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? await verifyToken(token) : null;

  const isLoggedIn = Boolean(payload);
  const isLoginPage = req.nextUrl.pathname === '/login';
  console.log(payload);
  console.log(isLoginPage);
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/', '/movie/:path*'],
};
