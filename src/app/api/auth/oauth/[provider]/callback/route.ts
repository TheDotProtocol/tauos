import { NextRequest, NextResponse } from 'next/server';
import { attachAuthSession } from '@/lib/tau-session';
import { getOAuthProvider, oauthRedirectUri, type OAuthProviderId } from '@/lib/oauth/config';
import {
  clearOAuthStateCookie,
  readOAuthStateCookie,
  verifyOAuthState,
} from '@/lib/oauth/state';
import {
  exchangeOAuthCode,
  fetchOAuthProfile,
  findOrCreateUserFromOAuth,
} from '@/lib/oauth/service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = getOAuthProvider(params.provider);
  if (!provider) {
    return NextResponse.redirect(new URL('/tauid/login?error=oauth_not_configured', request.url));
  }

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const cookieState = readOAuthStateCookie(request);

  if (!code || !state || !cookieState || state !== cookieState) {
    const res = NextResponse.redirect(new URL('/tauid/login?error=oauth_state_invalid', request.url));
    clearOAuthStateCookie(res);
    return res;
  }

  const parsed = verifyOAuthState(state);
  if (!parsed || parsed.provider !== provider.id) {
    const res = NextResponse.redirect(new URL('/tauid/login?error=oauth_state_expired', request.url));
    clearOAuthStateCookie(res);
    return res;
  }

  try {
    const accessToken = await exchangeOAuthCode(
      provider,
      code,
      oauthRedirectUri(provider.id as OAuthProviderId)
    );
    const profile = await fetchOAuthProfile(provider, accessToken);
    const user = await findOrCreateUserFromOAuth(provider.id, profile);

    const sessionResponse = await attachAuthSession(
      request,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
      {
        success: true,
        message: `Signed in with ${provider.label}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: profile.avatarUrl ?? null,
        },
        oauth: true,
        provider: provider.id,
      }
    );

    const redirectUrl = new URL(parsed.redirect, request.url);
    redirectUrl.searchParams.set('oauth', '1');
    const redirectResponse = NextResponse.redirect(redirectUrl);
    sessionResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    clearOAuthStateCookie(redirectResponse);
    return redirectResponse;
  } catch (error) {
    console.error('OAuth callback error:', error);
    const res = NextResponse.redirect(new URL('/tauid/login?error=oauth_failed', request.url));
    clearOAuthStateCookie(res);
    return res;
  }
}
