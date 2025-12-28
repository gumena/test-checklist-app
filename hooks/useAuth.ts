'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { clearAccessTokenCookie, setAccessTokenCookie } from '@/lib/authCookies';

export function useAuth() {
  const { user, isAuthenticated, authLoading, setUser, setAuthLoading } = useStore();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setAccessTokenCookie(session.access_token, session.expires_in);
      } else {
        clearAccessTokenCookie();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setAccessTokenCookie(session.access_token, session.expires_in);
      } else {
        clearAccessTokenCookie();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    authLoading,
  };
}
