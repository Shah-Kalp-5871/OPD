import React from 'react';
import { User, Phone, Activity, Stethoscope, Printer, Droplet, Calendar, Hash, ShieldAlert } from 'lucide-react';
import { Patient } from '../types';

interface PatientHeaderProps {
  patient: Patient;
  completion: number;
  hasOpenCase: boolean;
  onEditBasic: () => void;
  onStartVisit: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ 
  patient, 
  completion, 
  hasOpenCase, 
  onEditBasic, 
  onStartVisit 
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      {/* Top Identity Block */}
      <div className="px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
            <User className="w-10 h-10" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider">
                Patient File
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-500">
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onStartVisit}
            disabled={hasOpenCase}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${hasOpenCase ? 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/10'}`}
          >
            <Stethoscope className="w-4 h-4" />
            {hasOpenCase ? 'Consultation Active' : 'Initialize Visit'}
          </button>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-xl transition-all shadow-sm">
            <Printer className="w-4 h-4" />
          </button>
          <button 
            onClick={onEditBasic}
            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-xl transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Meta Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-slate-100 bg-slate-50/30">
        <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
          <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <Droplet className="w-3 h-3 text-rose-500" /> {patient.profile?.bloodGroup || '--'}
          </p>
        </div>
        <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reg. Date</p>
          <p className="text-sm font-bold text-slate-700">12 Oct 2023</p>
        </div>
        <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Visit</p>
          <p className="text-sm font-bold text-slate-700">--</p>
        </div>
        <div className="px-6 py-3 border-r border-slate-100 space-y-0.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Visits</p>
          <p className="text-sm font-bold text-slate-700">{patient.cases?.length || 0}</p>
        </div>
        <div className="px-6 py-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">File Status</p>
            <span className="text-[9px] font-bold text-teal-600">{completion}%</span>
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
