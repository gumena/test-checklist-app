'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { setAccessTokenCookie } from '@/lib/authCookies';

export default function RootPage() {
  const router = useRouter();

  // Fallback client-side redirect in case middleware/proxy rules are not applied.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAccessTokenCookie(session.access_token, session.expires_in);
        router.replace('/dashboard');
      } else {
        router.replace('/landing');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
