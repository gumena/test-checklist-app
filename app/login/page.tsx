'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { supabase } from '@/lib/supabase';
import { setAccessTokenCookie } from '@/lib/authCookies';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);

    const hasOAuthHash =
      url.hash.includes('access_token=') ||
      url.hash.includes('refresh_token=') ||
      url.hash.includes('error=');
    const hasOAuthCode = url.searchParams.has('code');

    // If the provider redirected back to /login, forward to the actual callback handler.
    if (hasOAuthHash || hasOAuthCode) {
      router.replace(`/auth/callback${url.search}${url.hash}`);
      return;
    }

    // If already authenticated (session in storage), make sure middleware can see it
    // and leave the login page.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAccessTokenCookie(session.access_token, session.expires_in);
        router.replace('/dashboard');
      }
    });

    // Clean up a trailing "#" if present
    if (url.hash === '#') {
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0f10] ambient-grid relative flex items-center justify-center">
      <div
        aria-hidden="true"
        className="ambient-glow fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
      />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-zinc-200 mb-2 tracking-tight">
              Welcome to TestFlow
            </h1>
            <p className="text-sm text-zinc-400">
              Sign in to manage your test suites
            </p>
          </div>

          {/* Sign In Button */}
          <div className="mb-6 flex justify-center">
            <GoogleSignInButton size="md" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-zinc-600">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
