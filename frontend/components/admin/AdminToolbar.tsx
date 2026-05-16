import React from 'react';
import { Search, RefreshCw, ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

interface AdminToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  onRefresh: () => void;
  filters?: {
    value: string;
    onChange: (val: string) => void;
    options?: FilterOption[];
    placeholder?: string;
    type?: 'select' | 'date';
  }[];
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  onRefresh,
  filters = [],
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all" 
        />
      </div>

      {filters.map((filter, idx) => (
        <div key={idx} className="relative">
          {filter.type === 'date' ? (
            <input 
              type="date"
              value={filter.value}
              onChange={e => filter.onChange(e.target.value)}
              className="pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all cursor-pointer"
            />
          ) : (
            <>
              <select 
                value={filter.value} 
                onChange={e => filter.onChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all cursor-pointer"
              >
                {filter.placeholder && <option value="">{filter.placeholder}</option>}
                {(filter.options || []).map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </>
          )}
        </div>
      ))}

      <button 
        onClick={onRefresh} 
        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
        title="Refresh data"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};
