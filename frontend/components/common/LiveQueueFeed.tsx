'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQueueSSE } from '@/hooks/useQueueSSE';
import { Wifi, WifiOff, Activity, Clock, Users, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  WAITING:     { color: 'text-amber-700',   bg: 'bg-amber-50',   dot: 'bg-amber-400',   label: 'Waiting' },
  CALLING:     { color: 'text-blue-700',    bg: 'bg-blue-50',    dot: 'bg-blue-500',    label: 'Calling' },
  IN_PROGRESS: { color: 'text-indigo-700',  bg: 'bg-indigo-50',  dot: 'bg-indigo-500',  label: 'In Progress' },
  COMPLETED:   { color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500', label: 'Completed' },
  SKIPPED:     { color: 'text-slate-600',   bg: 'bg-slate-100',  dot: 'bg-slate-400',   label: 'Skipped' },
  CANCELLED:   { color: 'text-rose-700',    bg: 'bg-rose-50',    dot: 'bg-rose-500',    label: 'Cancelled' },
};

interface LiveQueueFeedProps {
  compact?: boolean;
  showHeader?: boolean;
  maxItems?: number;
  doctorId?: string;
}

export default function LiveQueueFeed({
  compact = false,
  showHeader = true,
  maxItems = 10,
  doctorId,
}: LiveQueueFeedProps) {
  const { entries, stats, lastEvent } = useQueueSSE({ doctorId });
  const [isLive, setIsLive] = useState(true);
  const [flashNew, setFlashNew] = useState(false);
  const prevLastEvent = useRef<any>(null);

  // Flash animation when new event arrives
  useEffect(() => {
    if (lastEvent && lastEvent !== prevLastEvent.current) {
      prevLastEvent.current = lastEvent;
      setFlashNew(true);
      const timer = setTimeout(() => setFlashNew(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  const displayed = entries.slice(0, maxItems);

  const liveStats = [
    { icon: Users,        label: 'Total',      value: stats?.total ?? entries.length,                       color: 'text-slate-600' },
    { icon: Clock,        label: 'Waiting',    value: stats?.waiting ?? entries.filter((e: any) => e.status === 'WAITING').length,     color: 'text-amber-600' },
    { icon: Activity,     label: 'Active',     value: stats?.inProgress ?? entries.filter((e: any) => e.status === 'IN_PROGRESS').length, color: 'text-indigo-600' },
    { icon: CheckCircle2, label: 'Completed',  value: stats?.completed ?? entries.filter((e: any) => e.status === 'COMPLETED').length, color: 'text-emerald-600' },
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      {showHeader && (
        <div className={`px-6 py-4 border-b border-slate-50 flex items-center justify-between transition-colors duration-500 ${flashNew ? 'bg-indigo-50' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              {isLive ? (
                <>
                  <div className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
                  <Wifi className="w-4 h-4 text-emerald-500 relative z-10" />
                </>
              ) : (
                <WifiOff className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Live Queue
            </h3>
            {flashNew && (
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                Updated
              </span>
            )}
          </div>

          {/* Mini stat pills */}
          <div className="flex items-center gap-2">
            {liveStats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-xl">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`divide-y divide-slate-50 ${compact ? 'max-h-64' : 'max-h-96'} overflow-y-auto custom-scrollbar`}>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-widest">No queue entries</p>
          </div>
        ) : (
          displayed.map((entry: any, idx: number) => {
            const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG['WAITING'];
            return (
              <div
                key={entry.id || idx}
                className={`flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors group ${
                  entry.status === 'CALLING' ? 'bg-blue-50/40' : ''
                } ${entry.status === 'IN_PROGRESS' ? 'bg-indigo-50/20' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Token Badge */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <span className="text-[11px] font-black text-slate-700">
                      {entry.tokenNumber ?? idx + 1}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="min-w-0">
                    <p className={`text-sm font-bold text-slate-900 truncate ${entry.status === 'CALLING' ? 'patient-name-blinking' : ''}`}>
                      {entry.patient?.name ?? entry.patientName ?? 'Unknown'}
                    </p>
                    {!compact && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                        {entry.doctor?.name ?? 'Unassigned'} · {entry.visitType ?? '—'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${cfg.bg}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${entry.status === 'CALLING' || entry.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`} />
                  <span className={`text-[9px] font-black uppercase tracking-wider ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
