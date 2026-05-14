import React from 'react';
import { Stethoscope, User, Plus, Clock, FileText, Briefcase } from 'lucide-react';
import { Case } from '../types';

interface VisitSummaryProps {
  hasOpenCase: boolean;
  activeCase?: Case;
  onStartVisit: () => void;
  onViewCases: () => void;
}

const VisitSummary: React.FC<VisitSummaryProps> = ({
  hasOpenCase,
  activeCase,
  onStartVisit,
  onViewCases
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-slate-500" />
          Active Case File
        </h3>
        {hasOpenCase && (
          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 border border-teal-200 rounded text-[9px] font-black uppercase tracking-widest">
            In Progress
          </span>
        )}
      </div>
      
      <div className="p-8 flex-1 flex flex-col items-center justify-center">
        {hasOpenCase ? (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Briefcase className="w-3 h-3" /> Case Number
                 </p>
                 <p className="text-xs font-bold text-slate-700">{activeCase?.caseNumber}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Clock className="w-3 h-3" /> Time Logged
                 </p>
                 <p className="text-xs font-bold text-slate-700">
                   {new Date(activeCase?.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
               </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Consultant</span>
                  <span className="text-[11px] font-bold text-slate-800">Dr. {activeCase?.doctor?.name || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center">
                  <FileText className="w-3 h-3 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chief Complaint</span>
                  <span className="text-[11px] font-bold text-slate-600 line-clamp-1 italic">
                    "{activeCase?.complaint || 'No symptoms noted'}"
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={onViewCases}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10"
            >
              Open Consultation Chart
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-200">
              <Plus className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">No Active Case</p>
              <p className="text-[10px] font-bold text-slate-400 max-w-[200px]">Initialize a new clinical case to begin patient recording.</p>
            </div>
            <button 
              onClick={onStartVisit}
              className="px-8 py-3.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/10"
            >
              Start New Visit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitSummary;
