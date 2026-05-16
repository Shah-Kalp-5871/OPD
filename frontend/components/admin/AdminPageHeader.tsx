import React from 'react';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  totalCount?: number;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  actions?: { label: string; onClick: () => void; variant?: string }[];
  icon?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  totalCount,
  subtitle,
  onAdd,
  addLabel = 'Add New',
  actions,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
          {subtitle || `${totalCount} configured`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {actions ? (
          actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl text-xs transition-all shadow-lg shadow-slate-200 uppercase tracking-widest ${
                action.variant === 'outline' 
                  ? 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50' 
                  : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              <Plus className="w-4 h-4" /> {action.label}
            </button>
          ))
        ) : onAdd ? (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> {addLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};
