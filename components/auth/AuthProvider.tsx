'use client';

import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // This component initializes auth state tracking
  // The useAuth hook handles the actual auth state management
  useAuth();

  return <>{children}</>;
}
