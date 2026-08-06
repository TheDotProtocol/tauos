import { NextRequest, NextResponse } from 'next/server';
import { getOAuthProvider, oauthRedirectUri, type OAuthProviderId } from '@/lib/oauth/config';
import { setOAuthStateCookie, signOAuthState } from '@/lib/oauth/state';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = getOAuthProvider(params.provider);
  if (!provider) {
    return NextResponse.json(
      { error: 'OAuth provider not configured. Set client ID and secret in environment.' },
      { status: 503 }
    );
  }

  const redirect = request.nextUrl.searchParams.get('redirect') || '/tauid/dashboard';
  const state = signOAuthState({
    provider: provider.id,
    redirect: redirect.startsWith('/') ? redirect : '/tauid/dashboard',
    ts: Date.now(),
  });

  const url = new URL(provider.authUrl);
  url.searchParams.set('client_id', provider.clientId!);
  url.searchParams.set('redirect_uri', oauthRedirectUri(provider.id as OAuthProviderId));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', provider.scope);
  url.searchParams.set('state', state);
  if (provider.id === 'google') {
    url.searchParams.set('access_type', 'online');
    url.searchParams.set('prompt', 'select_account');
  }

  const response = NextResponse.redirect(url.toString());
  setOAuthStateCookie(response, state);
  return response;
}
