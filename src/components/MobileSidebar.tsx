'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  onSignOut: () => void;
  isSigningOut: boolean;
}

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  userEmail, 
  onSignOut,
  isSigningOut 
}: MobileSidebarProps) {
  const isAuthenticated = !!userEmail;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-dark-surface py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-text-primary">
                          Menu
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-text-secondary hover:text-text-primary focus:outline-none"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col space-y-6">
                        {isAuthenticated ? (
                          <>
                            <div className="px-2 py-4 border-b border-dark-border">
                              <p className="text-sm text-text-secondary">Signed in as</p>
                              <p className="text-base text-text-primary">{userEmail.split('@')[0]}</p>
                            </div>
                            <nav className="flex flex-col space-y-4">
                              <Link
                                href="/dashboard"
                                className="text-base font-medium text-text-secondary hover:text-accent transition-colors px-2"
                                onClick={onClose}
                              >
                                My Recipes
                              </Link>
                              <Link
                                href="/"
                                className="text-base font-medium text-text-secondary hover:text-accent transition-colors px-2"
                                onClick={onClose}
                              >
                                Browse Recipes
                              </Link>
                            </nav>
                            <div className="mt-auto">
                              <button
                                onClick={() => {
                                  onClose();
                                  onSignOut();
                                }}
                                disabled={isSigningOut}
                                className="w-full text-left text-base font-medium text-status-error hover:text-red-400 transition-colors px-2 disabled:opacity-50"
                              >
                                {isSigningOut ? 'Signing out...' : 'Sign out'}
                              </button>
                            </div>
                          </>
                        ) : (
                          <nav className="flex flex-col space-y-4">
                            <Link
                              href="/login"
                              className="text-base font-medium text-accent hover:text-accent-hover transition-colors px-2"
                              onClick={onClose}
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/signup"
                              className="text-base font-medium bg-accent hover:bg-accent-hover text-black px-4 py-2 rounded-md transition-colors"
                              onClick={onClose}
                            >
                              Get Started
                            </Link>
                          </nav>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 