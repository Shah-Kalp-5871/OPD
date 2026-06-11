import React from 'react';
import { User, Phone, Activity, Stethoscope, Printer, Droplet, Calendar, Hash, ShieldAlert } from 'lucide-react';
import { Patient } from '../types';

interface PatientHeaderProps {
  patient: Patient;
  completion: number;
  hasOpenCase: boolean;
  activeCase?: any;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ 
  patient, 
  completion, 
  hasOpenCase,
  activeCase
}) => {
  const regDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '--';

  const lastVisitDate = patient.cases && patient.cases.length > 0
    ? (() => {
        const dates = patient.cases.map((c: any) => new Date(c.createdAt).getTime());
        const maxDate = Math.max(...dates);
        return new Date(maxDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      })()
    : '--';

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm relative z-10 overflow-hidden">
      {/* Top Identity Block */}
      <div className="px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-400">
            <User className="w-12 h-12" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Patient File
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold uppercase tracking-tight">MRD-{patient.mrdNumber}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.profile?.age || '--'} Yrs / {patient.gender === 'M' ? 'Male' : 'Female'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{patient.profile?.allergies || 'No Known Allergies'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {hasOpenCase ? (
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/50 px-6 py-3 rounded-2xl flex flex-col items-end text-right shadow-sm">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Activity className="w-3.5 h-3.5" /> Active Consultation
              </span>
              <span className="text-sm font-black text-teal-900">Dr. {activeCase?.doctor?.name || 'Unassigned'}</span>
              <span className="text-[11px] font-bold text-teal-700/80">Case #{activeCase?.caseNumber}</span>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-slate-200/60 px-6 py-4 rounded-2xl flex items-center justify-center">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4" /> No Active Consultation
              </span>
            </div>
          )}
          <button 
            onClick={() => window.print()}
            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-2xl transition-all shadow-sm h-full print:hidden"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Meta Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 bg-slate-50 border-t border-slate-100 divide-x divide-slate-100">
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
          <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-rose-500" /> {patient.profile?.bloodGroup || '--'}
          </p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg. Date</p>
          <p className="text-sm font-bold text-slate-800">{regDate}</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</p>
          <p className="text-sm font-bold text-slate-800">{lastVisitDate}</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Visits</p>
          <p className="text-sm font-bold text-slate-800">{patient.cases?.length || 0}</p>
        </div>
        <div className="px-6 py-4 space-y-2 bg-white border-l border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Status</p>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{completion}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-teal-500 h-full transition-all duration-1000" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
