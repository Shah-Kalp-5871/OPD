'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Database } from 'lucide-react';

// Elegant, clinical-grade full-screen glass panel with moving ECG heartbeat (pulse) and cycling workspace tasks
export const FullPageLoader: React.FC<{ message?: string }> = ({ message }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    'Verifying credentials & session layers...',
    'Establishing secure branch isolation...',
    'Synchronizing patient data indexes...',
    'Pre-fetching local pharmacy cache...',
    'Loading live queue monitors...',
    'Securing clinical communications...'
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
      {/* Soft floating diagnostic ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      
      <div className="relative flex flex-col items-center space-y-8 max-w-md text-center p-10 rounded-[32px] bg-white/70 border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-lg">
        {/* Animated Clinical ECG Heartbeat (ECG Loop) */}
        <div className="relative w-48 h-20 bg-slate-50 rounded-2xl border border-slate-100/50 flex items-center justify-center p-4 overflow-hidden">
          {/* Diagnostic Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:10px_10px] opacity-60" />
          
          <svg className="w-full h-full relative z-10" viewBox="0 0 160 80">
            <defs>
              <linearGradient id="ecg-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Background trace line */}
            <path
              d="M 0 40 L 40 40 L 48 30 L 52 50 L 60 15 L 68 65 L 72 40 L 78 45 L 82 40 L 160 40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animating heartbeat path */}
            <motion.path
              d="M 0 40 L 40 40 L 48 30 L 52 50 L 60 15 L 68 65 L 72 40 L 78 45 L 82 40 L 160 40"
              fill="none"
              stroke="url(#ecg-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, strokeDasharray: '40 120' }}
              animate={{ strokeDashoffset: -160 }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'linear'
              }}
            />
          </svg>
        </div>

        {/* Brand Signage & Realtime Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-teal-600">
              MedFlow Clinical Core
            </h3>
          </div>
          
          <div className="h-6 overflow-hidden">
            <motion.p 
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-xs font-black text-slate-700 uppercase tracking-wide font-mono"
            >
              {message || steps[currentStep]}
            </motion.p>
          </div>
        </div>

        {/* High-fidelity Micro Progress bar */}
        <div className="w-40 h-[4px] bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
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
