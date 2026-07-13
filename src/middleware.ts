import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEVELOPER_HOSTS = ['developer.tauos.org', 'developer.localhost:3000'];

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0];
  const isDeveloperHost = DEVELOPER_HOSTS.some(
    (h) => host === h.split(':')[0] || request.headers.get('host') === h
  );

  if (!isDeveloperHost) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path === '/' || path === '') {
    url.pathname = '/developers';
    return NextResponse.rewrite(url);
  }

  if (!path.startsWith('/developers') && !path.startsWith('/api')) {
    url.pathname = `/developers${path.startsWith('/') ? path : `/${path}`}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|manifest.json).*)'],
};
