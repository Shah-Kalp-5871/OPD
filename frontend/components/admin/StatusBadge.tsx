import React from 'react';

export interface StatusBadgeProps {
  label: string;
  variant?: 'blue' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'slate' | 'orange';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = 'slate' }) => {
  const variants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    rose: 'bg-rose-50 text-rose-500 border-rose-100/50',
    slate: 'bg-slate-50 text-slate-500 border-slate-100/50',
    orange: 'bg-orange-50 text-orange-600 border-orange-100/50',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${variants[variant]}`}>
      {label}
    </span>
  );
};
