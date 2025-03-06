'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import PublicNavbar from '@/components/PublicNavbar';
import Logo from '@/components/Logo';
import PasswordInput from '@/components/PasswordInput';
import Link from 'next/link';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Add logging for session changes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session state:', session ? 'Authenticated' : 'No session');
      if (session?.user) {
        console.log('User is authenticated:', session.user.email);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in reset password page:', event);
      console.log('New session state:', session ? 'Authenticated' : 'No session');
      if (session?.user) {
        console.log('User details:', session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check for error parameters in URL
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    console.log('URL Parameters:', {
      errorCode,
      errorDescription,
      fullURL: typeof window !== 'undefined' ? window.location.href : ''
    });
    
    if (errorCode === 'otp_expired') {
      setError('The password reset link has expired. Please request a new one.');
    } else if (errorDescription) {
      setError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting password reset submission');
    setError(null);
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Attempting to update password');
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      console.log('Password update response:', {
        success: !error,
        error: error?.message,
        hasUser: !!data.user
      });

      if (error) throw error;

      setSuccess(true);
      setError(null);

      // Redirect to login page after successful password reset
      console.log('Password reset successful, will redirect to login in 2 seconds');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while resetting your password');
      }
    }
  };

  // If there's an error with the reset link, show error message and link to request new reset
  if (error?.includes('expired') || error?.includes('invalid')) {
    return (
      <div className="min-h-screen bg-dark">
        <PublicNavbar />
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 p-8 bg-dark-surface rounded-xl border border-dark-border shadow-dark-lg">
            <div className="flex flex-col items-center">
              <Logo size="lg" imageOnly className="mb-6" />
              <h2 className="text-center text-3xl font-extrabold text-text-primary">
                Reset Link Expired
              </h2>
              <p className="mt-4 text-center text-sm text-text-secondary">
                {error}
              </p>
              <Link
                href="/forgot-password"
                className="mt-4 text-accent hover:text-accent-hover transition-colors"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-dark-surface rounded-xl border border-dark-border shadow-dark-lg">
          <div className="flex flex-col items-center">
            <Logo size="lg" imageOnly className="mb-6" />
            <h2 className="text-center text-3xl font-extrabold text-text-primary">
              Set New Password
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Please enter your new password below.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-status-error bg-opacity-10 text-status-error p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500 bg-opacity-10 text-green-500 p-3 rounded-md text-sm">
                Password successfully reset! Redirecting to login...
              </div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={success}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 