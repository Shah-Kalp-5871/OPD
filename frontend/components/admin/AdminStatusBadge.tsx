import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AdminStatusBadgeProps {
  isActive: boolean;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
        <CheckCircle2 className="w-3 h-3" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-500 rounded-md text-[10px] font-black uppercase tracking-widest border border-rose-100/50">
      <XCircle className="w-3 h-3" /> Inactive
    </span>
  );
};
