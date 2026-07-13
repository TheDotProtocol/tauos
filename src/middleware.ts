import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type HostRoute = {
  hosts: string[];
  basePath: string;
};

const HOST_ROUTES: HostRoute[] = [
  {
    hosts: ['developer.tauos.org', 'developer.localhost'],
    basePath: '/developers',
  },
  {
    hosts: [
      'browser.tauos.org',
      'browser.localhost',
      'taubrowser.com',
      'www.taubrowser.com',
    ],
    basePath: '/taubrowser',
  },
];

function matchHostRoute(hostHeader: string | null): HostRoute | null {
  const host = (hostHeader ?? '').split(':')[0].toLowerCase();
  for (const route of HOST_ROUTES) {
    if (route.hosts.some((h) => host === h.split(':')[0])) {
      return route;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const route = matchHostRoute(request.headers.get('host'));
  if (!route) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path === '/' || path === '') {
    url.pathname = route.basePath;
    return NextResponse.rewrite(url);
  }

  if (!path.startsWith(route.basePath) && !path.startsWith('/api')) {
    url.pathname = `${route.basePath}${path.startsWith('/') ? path : `/${path}`}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|manifest.json).*)'],
};
