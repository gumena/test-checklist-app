'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setAccessTokenCookie } from '@/lib/authCookies';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);

        // If Supabase already detected the session, just continue
        const { data: existingSessionData } = await supabase.auth.getSession();
        if (existingSessionData.session?.access_token) {
          setAccessTokenCookie(
            existingSessionData.session.access_token,
            existingSessionData.session.expires_in
          );
          router.replace('/dashboard');
          return;
        }

        // PKCE flow (code in query params)
        const code = url.searchParams.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Error exchanging code for session:', error);
            router.replace('/login?error=auth_failed');
            return;
          }

          if (data.session?.access_token) {
            setAccessTokenCookie(data.session.access_token, data.session.expires_in);
          }

          router.replace('/dashboard');
          return;
        }

        // Implicit flow (tokens in hash fragment)
        const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            router.replace('/login?error=auth_failed');
            return;
          }

          if (data.session?.access_token) {
            setAccessTokenCookie(data.session.access_token, data.session.expires_in);
          } else {
            // Best-effort fallback for middleware checks
            setAccessTokenCookie(accessToken);
          }

          router.replace('/dashboard');
          return;
        }

        // No session details; route back to login with error if present
        const errorParam =
          url.searchParams.get('error') ?? hashParams.get('error');
        const errorDescription =
          url.searchParams.get('error_description') ??
          hashParams.get('error_description');

        if (errorParam) {
          const qs = new URLSearchParams({
            error: errorParam,
            ...(errorDescription ? { error_description: errorDescription } : {}),
          }).toString();
          router.replace(`/login?${qs}`);
          return;
        }

        router.replace('/login');
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-zinc-400">Completing sign in...</p>
      </div>
    </div>
  );
}
