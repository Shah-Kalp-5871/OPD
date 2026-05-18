'use client';

import React from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, RefreshCw, Database } from 'lucide-react';

export default function OfflineIndicator() {
  const { isOnline, pendingDraftsCount, syncDrafts } = useOfflineSync();

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-50 w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-rose-600/95 backdrop-blur-md text-white py-2 px-4 flex items-center justify-between text-xs font-bold shadow-lg shadow-rose-900/20 border-b border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-rose-700/60 rounded-lg animate-pulse">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <span className="uppercase tracking-wider">Running Offline Mode</span>
            <span className="mx-2 text-rose-300">|</span>
            <span className="text-[10px] text-rose-100 font-medium">
              Clinical entries are safely cached locally in your browser.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingDraftsCount > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-800/80 px-2.5 py-1 rounded-lg border border-rose-700/40">
              <Database className="w-3.5 h-3.5 text-rose-200" />
              <span className="text-[10px] tracking-wide text-rose-100 uppercase">
                {pendingDraftsCount} Draft{pendingDraftsCount > 1 ? 's' : ''} Pending
              </span>
            </div>
          )}
          
          <button
            onClick={syncDrafts}
            className="flex items-center gap-1 px-3 py-1 bg-white text-rose-700 rounded-lg hover:bg-rose-50 transition-colors shadow-sm text-[10px] tracking-wider uppercase font-black"
          >
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
            Retry Sync
          </button>
        </div>
      </div>
    </div>
  );
}
