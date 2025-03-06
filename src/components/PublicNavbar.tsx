'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import MobileSidebar from './MobileSidebar';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-20">
          <div className="flex items-center">
            <div className="h-14 sm:h-20 flex items-center">
              <Logo href="/" size="sm" className="sm:hidden" />
              <Logo href="/" size="md" className="hidden sm:block" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-accent hover:bg-accent-hover text-black px-4 py-2 rounded-md transition-colors"
            >
              Get Started
            </Link>
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
        userEmail={null}
        onSignOut={() => {}}
        isSigningOut={false}
      />
    </nav>
  );
}
