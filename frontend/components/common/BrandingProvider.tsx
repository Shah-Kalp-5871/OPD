'use client';

import React, { useEffect } from 'react';
import { useBrandingStore } from '@/store/brandingStore';
import { FullPageLoader } from './PremiumLoaders';
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
        navigator.serviceWorker.register('/opd/sw.js').then(
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
    return <FullPageLoader message="Initializing Secure Workspace..." />;
  }

  return (
    <div className="animate-in fade-in duration-700 h-full w-full">
      <OfflineIndicator />
      {children}
    </div>
  );
}
