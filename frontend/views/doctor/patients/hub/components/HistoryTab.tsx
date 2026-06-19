'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Clock, Stethoscope, Activity, FileDigit } from 'lucide-react';

interface HistoryTabProps {
  patientId: string;
  cases: any[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ patientId, cases }) => {
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  if (!cases || cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50">
        <FileText className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">No Medical History</h3>
        <p className="text-xs font-bold text-slate-400 mt-2">This patient has no previous cases.</p>
      </div>
    );
  }

  const sortedCases = [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      {sortedCases.map((c) => {
        const isExpanded = expandedCaseId === c.id;
        const dateStr = new Date(c.createdAt).toLocaleDateString();

        return (
          <div key={c.id} className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm bg-white hover:border-[#107ca3]/30">
            <button
              onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
              className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-[#f0f7fa] transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white border border-[#107ca3]/20 rounded-xl flex items-center justify-center shadow-sm">
                  <FileDigit className="w-5 h-5 text-[#107ca3]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                    Case {c.caseNumber}
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {c.visitType}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {dateStr}</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Stage: {c.stage}</span>
                    <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Dr. {c.doctor?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isExpanded && (
              <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Complaints & Vitals */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span> Clinical Notes
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 whitespace-pre-wrap min-h-[80px]">
                      {c.visitComplaint?.history || 'No clinical notes recorded.'}
                    </div>
                  </div>
                </div>

                {/* Procedures & Diagnosis */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black text-[#107ca3] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#107ca3]"></span> Final Diagnosis
                    </h4>
                    <div className="bg-[#f0f7fa] border border-[#107ca3]/20 rounded-xl p-4 text-sm font-black text-[#0d6282] min-h-[80px]">
                      {c.diagnosis?.provisionalDiagnosis || 'No provisional diagnosis.'}
                    </div>
                  </div>
                </div>

                {/* Full case details button */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
                   <button className="text-xs font-black text-white bg-[#107ca3] hover:bg-[#0d6282] px-5 py-2.5 rounded-lg tracking-widest uppercase transition-colors shadow-sm">
                      View Full File
                   </button>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HistoryTab;
