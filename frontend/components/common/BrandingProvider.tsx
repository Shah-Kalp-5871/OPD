'use client';

import React, { useEffect } from 'react';
import { useBrandingStore } from '@/store/brandingStore';
import OfflineIndicator from './OfflineIndicator';

export default function BrandingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { branding, fetchBranding, isLoading } = useBrandingStore();

  useEffect(() => {
    fetchBranding();

    // Register Service Worker for Offline operational capability
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('[PWA] ServiceWorker successfully registered with scope: ', registration.scope);
          },
          (err) => {
            console.error('[PWA] ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, [fetchBranding]);

  if (isLoading || !branding) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="relative flex flex-col items-center">
          {/* Pulsing Glow Rings */}
          <div className="absolute w-24 h-24 bg-teal-500/20 dark:bg-teal-400/10 rounded-full animate-ping duration-1000" />
          <div className="absolute w-32 h-32 bg-teal-500/10 dark:bg-teal-400/5 rounded-full animate-pulse duration-700" />
          
          {/* Modern Premium Medical Cross Emblem */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 rounded-2xl shadow-xl shadow-teal-500/20 transform transition-transform hover:scale-105 duration-300">
            <svg
              className="w-10 h-10 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          
          {/* Subtle text loader */}
          <div className="mt-8 flex flex-col items-center space-y-2">
            <h3 className="text-lg font-semibold tracking-wide text-slate-800 dark:text-slate-100 animate-pulse">
              MedFlow EMR
            </h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase animate-pulse">
              Initializing Secure Workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 h-full w-full">
      <OfflineIndicator />
      {children}
    </div>
  );
}
