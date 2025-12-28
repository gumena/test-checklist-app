import type { Session } from '@supabase/supabase-js';

export const ACCESS_TOKEN_COOKIE_NAME = 'sb-access-token';

export function setAccessTokenCookie(accessToken: string, maxAgeSeconds?: number) {
  if (typeof document === 'undefined') return;

  const parts = [
    `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(accessToken)}`,
    'Path=/',
    'SameSite=Lax',
  ];

  if (typeof maxAgeSeconds === 'number' && Number.isFinite(maxAgeSeconds)) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
}

export function setAccessTokenCookieFromSession(session: Session) {
  setAccessTokenCookie(session.access_token, session.expires_in);
}

export function clearAccessTokenCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

