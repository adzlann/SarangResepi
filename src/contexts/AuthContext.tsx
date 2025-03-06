'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', {
        hasSession: !!session,
        userEmail: session?.user?.email,
      });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state change detected:', {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      });
      
      setUser(session?.user ?? null);
      
      // Only redirect on sign in and not on password reset page
      if (event === 'SIGNED_IN' && typeof window !== 'undefined' && !window.location.pathname.includes('/reset-password')) {
        console.log('Redirecting to dashboard after sign in');
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    if (response.error) throw response.error;
    
    console.log('Sign up successful:', response.data);
    return response;
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    console.log('Sign in successful:', data);
  };

  const signOut = async () => {
    console.log('Signing out user:', user?.email);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
    console.log('Successfully signed out');
  };

  const resetPassword = async (email: string) => {
    if (typeof window === 'undefined') {
      throw new Error('resetPassword must be called in a browser environment');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
