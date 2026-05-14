import React from 'react';
import { Circle, User, Clock, AlertCircle } from 'lucide-react';

interface PatientStatusStripProps {
  hasOpenCase: boolean;
  activeCase?: {
    caseNumber: string;
    doctor?: { name: string };
    createdAt: string;
  };
}

const PatientStatusStrip: React.FC<PatientStatusStripProps> = ({ hasOpenCase, activeCase }) => {
  if (!hasOpenCase) {
    return (
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Active Consultation</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready for New Visit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-teal-50 border-b border-teal-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Active Consultation</span>
        </div>
        <div className="h-4 w-px bg-teal-200"></div>
        <div className="flex items-center gap-2 text-teal-600">
          <span className="text-[10px] font-bold uppercase tracking-tight">Case ID: {activeCase?.caseNumber}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-teal-600">
          <User className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dr. {activeCase?.doctor?.name || 'Assigned'}</span>
        </div>
        <div className="flex items-center gap-2 text-teal-600">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Started: {new Date(activeCase?.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientStatusStrip;
