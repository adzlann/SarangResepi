'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-emerald-600">
              RecipeNest
            </Link>
            <nav className="flex space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                My Recipes
              </Link>
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                Browse Recipes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isSigningOut}
              className="text-sm text-gray-700 hover:text-emerald-600 disabled:opacity-50"
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
