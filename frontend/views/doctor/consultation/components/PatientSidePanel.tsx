import React from 'react';
import { 
  User, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CreditCard, 
  History,
  Scale,
  Thermometer,
  Droplets,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

interface PatientSidePanelProps {
  patient: any;
  vitals: any[];
}

const PatientSidePanel: React.FC<PatientSidePanelProps> = ({ patient, vitals }) => {
  const latestVitals = vitals?.[0];

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Patient Profile Section */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <User className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{patient?.firstName} {patient?.lastName}</h2>
            <p className="text-slate-400 text-sm font-mono">{patient?.mrdNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
            <p className="text-slate-500 mb-1">Age / Gender</p>
            <p className="text-slate-200 font-medium">{patient?.profile?.age || 'N/A'}y / {patient?.gender}</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
            <p className="text-slate-500 mb-1">Blood Group</p>
            <p className="text-rose-400 font-bold">{patient?.profile?.bloodGroup || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Critical Info / Allergies */}
      <div className="p-4 border-b border-slate-800 bg-rose-500/5">
        <div className="flex items-center gap-2 text-rose-400 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Allergies & Risks</span>
        </div>
        <p className="text-sm text-slate-300">
          {patient?.profile?.allergies || 'No known allergies reported.'}
        </p>
      </div>

      {/* Latest Vitals */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Last Recorded Vitals
          </h3>
          <span className="text-[10px] text-slate-500">
            {latestVitals?.takenAt ? format(new Date(latestVitals.takenAt), 'dd MMM, HH:mm') : ''}
          </span>
        </div>

        <div className="space-y-3">
          <VitalRow 
            icon={<Scale className="w-4 h-4" />} 
            label="Weight" 
            value={`${latestVitals?.weight || '--'} kg`} 
            color="text-blue-400" 
          />
          <VitalRow 
            icon={<Thermometer className="w-4 h-4" />} 
            label="Temp" 
            value={`${latestVitals?.temperature || '--'} °F`} 
            color="text-orange-400" 
          />
          <VitalRow 
            icon={<Droplets className="w-4 h-4" />} 
            label="BP" 
            value={latestVitals?.bloodPressure || '--'} 
            color="text-rose-400" 
          />
          <VitalRow 
            icon={<Heart className="w-4 h-4" />} 
            label="Pulse" 
            value={`${latestVitals?.pulse || '--'} bpm`} 
            color="text-emerald-400" 
          />
        </div>
      </div>

      {/* Previous Visits */}
      <div className="p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          Recent Visits
        </h3>
        <div className="space-y-4">
          {patient?.cases?.slice(0, 3).map((c: any) => (
            <div key={c.id} className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="text-xs text-slate-500">{format(new Date(c.visitDate), 'dd MMM yyyy')}</p>
              <p className="text-sm text-slate-200 line-clamp-1">{c.complaint || 'General Checkup'}</p>
              <p className="text-[10px] text-slate-500 uppercase">{c.caseNumber}</p>
            </div>
          ))}
          {(!patient?.cases || patient.cases.length === 0) && (
            <p className="text-xs text-slate-500 text-center py-4 italic">No previous history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const VitalRow = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-md bg-slate-800 ${color}`}>
        {icon}
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

export default PatientSidePanel;
