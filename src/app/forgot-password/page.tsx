'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import Logo from '@/components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <PublicNavbar />
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-dark-surface rounded-xl border border-dark-border shadow-dark-lg">
          <div className="flex flex-col items-center">
            <Logo size="lg" imageOnly className="mb-6" />
            <h2 className="text-center text-3xl font-extrabold text-text-primary">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Enter your email address and we&apos;ll send you a link to reset your password.
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
                Check your email for a link to reset your password.
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border bg-dark-surface2 border-dark-border placeholder-text-disabled text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={success}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50"
              >
                Send reset link
              </button>
            </div>

            <div className="text-sm text-center">
              <Link
                href="/login"
                className="font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 