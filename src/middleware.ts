// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/'];
const OWNER_PREFIX = '/owner';
const TENANT_PREFIX = '/tenant';

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Public routes — always allow
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Read role from cookie set at login
  const role = req.cookies.get('rentos-role')?.value;

  // No role — not logged in
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Role mismatch guards
  if (pathname.startsWith(OWNER_PREFIX) && role !== 'OWNER') {
    const url = req.nextUrl.clone();
    url.pathname = role === 'TENANT' ? '/tenant' : '/auth/login';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(TENANT_PREFIX) && role !== 'TENANT') {
    const url = req.nextUrl.clone();
    url.pathname = role === 'OWNER' ? '/owner' : '/auth/login';
    return NextResponse.redirect(url);
  }

  // Root redirect based on role
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = role === 'OWNER' ? '/owner' : '/tenant';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
