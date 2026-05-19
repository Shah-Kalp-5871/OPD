'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Database } from 'lucide-react';

// Cybernetic dark-mode full-screen glass panel with neon pulse
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = 'Initializing MedFlow Quantum Core...' }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow" />
      
      <div className="relative flex flex-col items-center space-y-6 max-w-md text-center p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 shadow-2xl backdrop-blur-md">
        {/* Animated outer ring spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <div className="absolute inset-2 rounded-full border-4 border-slate-800/30" />
          <motion.div 
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-teal-500 border-l-cyan-500"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        </div>

        {/* Loading text with pulse & shine effect */}
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
            SYSTEM LOAD IN PROGRESS
          </h3>
          <p className="text-xs font-bold text-slate-400/80 uppercase tracking-wider font-mono">
            {message}
          </p>
        </div>

        {/* Linear progress simulation */}
        <div className="w-48 h-1 bg-slate-800/80 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

// Pulsing shimmers for columns and rows to prevent layout jumps in tables
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-slate-900/35 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header shimmer */}
      <div className="flex border-b border-slate-800/80 bg-slate-900/50 p-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="flex-1 px-4">
            <div className="h-4 bg-slate-800/60 rounded-md w-24 animate-pulse" />
          </div>
        ))}
      </div>
      {/* Row shimmers */}
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex p-5 hover:bg-slate-900/20 transition-all duration-150">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div key={colIdx} className="flex-1 px-4 flex items-center">
                {colIdx === 0 ? (
                  // First column: Avatar + text mimic
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-slate-800/60 shrink-0 animate-pulse" />
                    <div className="space-y-1.5 w-full">
                      <div className="h-3 bg-slate-800/60 rounded w-2/3 animate-pulse" />
                      <div className="h-2 bg-slate-800/30 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ) : colIdx === cols - 1 ? (
                  // Last column: Action button mimic
                  <div className="h-7 bg-slate-850 rounded-lg w-20 animate-pulse border border-slate-800/30" />
                ) : (
                  // Middle column: Simple text mimic
                  <div className="h-3 bg-slate-800/40 rounded w-3/4 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Glassmorphic containers for metrics
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
      {/* Glowing accent mimic */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex justify-between items-start">
        <div className="space-y-2.5 flex-1">
          <div className="h-3 bg-slate-800/60 rounded w-24 animate-pulse" />
          <div className="h-8 bg-slate-850 rounded w-16 animate-pulse" />
          <div className="h-2.5 bg-slate-800/30 rounded w-32 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-800/60 animate-pulse border border-slate-800/50 shrink-0" />
      </div>
    </div>
  );
};

// Shimmer blocks replicating complex graph layouts
export const ChartSkeleton: React.FC<{ heightClass?: string }> = ({ heightClass = 'h-[300px]' }) => {
  return (
    <div className={`bg-slate-900/35 border border-slate-800/50 rounded-2xl p-6 flex flex-col justify-between overflow-hidden backdrop-blur-md ${heightClass}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1.5">
          <div className="h-4.5 bg-slate-800/60 rounded w-36 animate-pulse" />
          <div className="h-2.5 bg-slate-800/30 rounded w-24 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-6 rounded bg-slate-800/50 animate-pulse" />
          <div className="w-12 h-6 rounded bg-slate-800/50 animate-pulse" />
        </div>
      </div>
      
      {/* Replicating area chart graph shimmers */}
      <div className="flex-1 w-full flex items-end gap-2 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-slate-850 w-full" />
          <div className="border-b border-slate-850 w-full" />
          <div className="border-b border-slate-850 w-full" />
        </div>
        
        {Array.from({ length: 12 }).map((_, idx) => {
          const heights = ['h-1/4', 'h-2/5', 'h-1/2', 'h-3/5', 'h-4/5', 'h-2/3', 'h-1/2', 'h-3/4', 'h-2/5', 'h-3/5', 'h-5/6', 'h-2/3'];
          return (
            <div 
              key={idx} 
              className={`flex-1 ${heights[idx % heights.length]} bg-gradient-to-t from-slate-900 via-slate-800/50 to-blue-500/10 border-t border-blue-500/20 rounded-t-lg animate-pulse`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            />
          );
        })}
      </div>
      
      {/* Horizontal labels */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-2.5 bg-slate-800/30 rounded w-8 animate-pulse" />
        ))}
      </div>
    </div>
  );
};

// Sleek micro-spinners in action buttons
export const InlineButtonLoader: React.FC<{ label?: string }> = ({ label = 'Processing...' }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-3.5 h-3.5 text-current animate-spin" />
      <span className="font-semibold uppercase tracking-wider text-[10px]">{label}</span>
    </div>
  );
};

// Premium empty state design system element
export const PremiumEmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}> = ({ icon = <Database className="w-10 h-10 text-slate-500" />, title, description, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/35 border border-slate-800/50 border-dashed backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center shadow-lg mb-4 text-slate-400">
        {icon}
      </div>
      <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-1.5">
        {title}
      </h3>
      <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed mb-6 uppercase tracking-wider">
        {description}
      </p>
      {actionButton && (
        <div className="mt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
};
