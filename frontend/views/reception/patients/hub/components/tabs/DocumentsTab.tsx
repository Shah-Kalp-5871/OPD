import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Patient } from '../../types';

interface DocumentsTabProps {
  patient: Patient;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ patient }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Medical Documents & Reports</h3>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
          Upload New
        </button>
      </div>
      <div className="py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto">
          <FileText className="w-10 h-10 text-slate-200" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-800 uppercase tracking-widest">No Documents Found</p>
          <p className="text-[11px] font-bold text-slate-400">Prescriptions, lab reports, and scans will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
