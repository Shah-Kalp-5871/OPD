import React from 'react';
import { X } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const DetailModal = ({ isOpen, onClose, title, children }: DetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
