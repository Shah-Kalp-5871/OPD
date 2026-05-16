import React from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface AdminFormWrapperProps {
  title: string;
  isEditing: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const AdminFormWrapper: React.FC<AdminFormWrapperProps> = ({
  title,
  isEditing,
  submitting,
  onClose,
  onSubmit,
  children
}) => {
  return (
    <div id="admin-form" className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/5 overflow-hidden mb-8">
      <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
        <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
          {isEditing ? `Edit ${title}` : `New ${title}`}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        {children}

        <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-transparent rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {submitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
};
