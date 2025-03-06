'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ConfirmDialog from './ConfirmDialog';
import Logo from './Logo';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-20">
          <div className="flex items-center">
            <div className="h-14 sm:h-20 flex items-center">
              <Logo href="/dashboard" size="sm" className="sm:hidden" />
              <Logo href="/dashboard" size="md" className="hidden sm:block" />
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-6 ml-8">
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

          {/* Desktop User Info */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              {user?.email ? user.email.split('@')[0] : ''}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isSigningOut}
              className="text-sm text-text-secondary hover:text-accent transition-colors disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center">
            <button
              type="button"
              className="text-text-secondary hover:text-text-primary p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userEmail={user?.email}
        onSignOut={() => setShowLogoutConfirm(true)}
        isSigningOut={isSigningOut}
      />

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
