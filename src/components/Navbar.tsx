'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useTheme } from './ThemeProvider';
import Logo from './Logo';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process');
      
      // First navigate to home
      console.log('Navigating to home page');
      router.push('/');
      
      // Then sign out
      console.log('Calling sign out');
      await signOut();
      
      console.log('Successfully signed out and navigated home');
      router.refresh(); // Force a refresh to ensure auth state is updated
    } catch (error) {
      console.error('Error during sign out:', error);
      // If error occurs, stay on current page
      router.refresh();
    } finally {
      setIsSigningOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Logo href="/dashboard" size="md" />
            <nav className="flex space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
              >
                My Recipes
              </Link>
              <Link 
                href="/" 
                className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
              >
                Browse Recipes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <span className="text-text-secondary">{user?.email}</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isSigningOut}
              className="text-sm text-text-secondary hover:text-accent transition-colors disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => !isSigningOut && setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out?"
      />
    </nav>
  );
}
