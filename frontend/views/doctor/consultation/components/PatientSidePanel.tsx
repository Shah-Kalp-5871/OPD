import React from 'react';
import { 
  User, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  History,
  Scale,
  Thermometer,
  Droplets,
  Heart,
  UserCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge, Card } from './ClinicalDesignSystem';

interface PatientSidePanelProps {
  patient: any;
  vitals: any[];
}

const PatientSidePanel: React.FC<PatientSidePanelProps> = ({ patient, vitals }) => {
  const latestVitals = vitals?.[0];

  return (
    <aside className="w-[340px] bg-white border-r border-slate-200 flex flex-col h-full clinical-sidebar">
      {/* Patient Profile Header */}
      <div className="p-8 pb-6 text-center border-b border-slate-50">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-white shadow-xl shadow-slate-200 flex items-center justify-center overflow-hidden ring-4 ring-slate-50">
            {patient?.profile?.photoUrl ? (
              <img src={patient.profile.photoUrl} alt="Patient" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="text-slate-300 w-16 h-16" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>

        <h2 className="text-slate-900 font-black text-xl tracking-tight leading-none mb-2">
          {patient?.firstName} {patient?.lastName}
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="slate" className="bg-slate-100/50 border-slate-200/50 text-slate-500">{patient?.profile?.age || '--'} Yrs</Badge>
          <Badge variant="slate" className="bg-slate-100/50 border-slate-200/50 text-slate-500">{patient?.gender || '--'}</Badge>
          <Badge variant="rose" className="font-black">{patient?.profile?.bloodGroup || 'UNK'}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance</p>
            <p className="text-xs font-bold text-slate-700">₹0.00</p>
          </div>
        </div>
      </div>

      {/* Allergies & Risks - High Visibility */}
      {patient?.profile?.allergies && (
        <div className="mx-6 my-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Medical Alerts</span>
          </div>
          <p className="text-xs font-bold text-rose-800 leading-relaxed">
            {patient.profile.allergies}
          </p>
        </div>
      )}

      {/* Clinical Metrics / Vitals */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Latest Vitals
          </h3>
          <button className="text-[10px] font-bold text-blue-600 hover:underline">History</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <VitalBox 
            icon={<Scale className="w-4 h-4" />} 
            label="Weight" 
            value={latestVitals?.weight ? `${latestVitals.weight}kg` : '--'} 
            color="blue"
          />
          <VitalBox 
            icon={<Thermometer className="w-4 h-4" />} 
            label="Temp" 
            value={latestVitals?.temperature ? `${latestVitals.temperature}°F` : '--'} 
            color="orange"
          />
          <VitalBox 
            icon={<Droplets className="w-4 h-4" />} 
            label="BP" 
            value={latestVitals?.bloodPressure || '--/--'} 
            color="rose"
          />
          <VitalBox 
            icon={<Heart className="w-4 h-4" />} 
            label="Pulse" 
            value={latestVitals?.pulse ? `${latestVitals.pulse} bpm` : '--'} 
            color="emerald"
          />
        </div>
      </div>

      {/* Recent History Timeline */}
      <div className="px-6 py-6 border-t border-slate-50 mt-auto bg-slate-50/30">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            Clinical History
          </h3>
          <History className="w-4 h-4 text-slate-200" />
        </div>

        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {patient?.cases?.slice(0, 3).map((c: any) => (
            <div key={c.id} className="relative pl-8 group cursor-pointer">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-blue-500 transition-colors z-10" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                {format(new Date(c.visitDate), 'dd MMM yyyy')}
              </p>
              <h4 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                {c.complaint || 'General Consultation'}
              </h4>
              <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase">
                {c.caseNumber} <ChevronRight className="w-3 h-3" />
              </p>
            </div>
          ))}
          
          {(!patient?.cases || patient.cases.length === 0) && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No History</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const VitalBox = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-slate-100 transition-all group">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
};

export default PatientSidePanel;
