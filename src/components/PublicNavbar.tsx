'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import Logo from './Logo';

export default function PublicNavbar() {
  const { toggleTheme } = useTheme();
  
  return (
    <nav className="bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo href="/" size="md" />
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
        </div>
      </div>
    </nav>
  );
}
