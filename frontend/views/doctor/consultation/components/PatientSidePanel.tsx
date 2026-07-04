import React, { useState, useEffect } from 'react';
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
import { aiApi } from '@/lib/api/ai';
import { toast } from 'sonner';
import { usePatientSidePanel } from '../hooks/usePatientSidePanel';

interface PatientSidePanelProps {
  patient: any;
  vitals: any[];
  isOpen?: boolean;
  onToggle?: () => void;
}

const PatientSidePanel: React.FC<PatientSidePanelProps> = ({ patient: initialPatient, vitals: initialVitals, isOpen = true, onToggle }) => {
  // Use live data from the hook if available, otherwise fallback to the initial patient passed from page
  const { patient: livePatient, loading, refresh } = usePatientSidePanel(initialPatient?.id);
  
  const patient = livePatient || initialPatient;
  const vitals = (initialVitals && initialVitals.length > 0) ? initialVitals : (livePatient?.vitalsList || livePatient?.vitals);
  
  const latestVitals = vitals?.[0];
  const [riskFlags, setRiskFlags] = useState<any[]>([]);
  const [loadingRisk, setLoadingRisk] = useState(false);

  useEffect(() => {
    if (patient?.id) {
      fetchRiskFlags();
    }
  }, [patient?.id]);

  const fetchRiskFlags = async () => {
    try {
      setLoadingRisk(true);
      const res = await aiApi.getPatientRiskFlags(patient.id);
      if (res && res.data && res.data.flags) {
        setRiskFlags(res.data.flags);
      }
    } catch (err) {
      console.error('Failed to fetch clinical risk flags', err);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleAcknowledgeFlag = async (flagId: string) => {
    try {
      await aiApi.acknowledgeRiskFlag(flagId);
      toast.success('Clinical risk flag acknowledged and resolved');
      fetchRiskFlags(); // Refresh list
    } catch (err) {
      console.error('Failed to resolve risk flag', err);
      toast.error('Failed to acknowledge risk flag');
    }
  };

  return (
    <div className={`relative transition-all duration-300 ease-in-out ${isOpen ? 'w-[340px]' : 'w-0'} flex-shrink-0 z-30`}>
      <aside className={`absolute inset-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full border-none'}`}>
        <div className="w-[340px] h-full flex flex-col overflow-y-auto clinical-sidebar">
          {/* Patient Profile Header */}
          <div className="p-6 pb-4 text-center border-b border-slate-50">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-white shadow-lg shadow-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-slate-50">
                {patient?.profile?.photoUrl ? (
                  <img src={patient.profile.photoUrl} alt="Patient" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="text-slate-300 w-10 h-10" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            </div>

            <h2 className="text-slate-900 font-black text-lg tracking-tight leading-none mb-2">
              {patient?.firstName} {patient?.lastName}
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="slate" className="bg-slate-100/50 border-slate-200/50 text-slate-500">{patient?.profile?.age || '--'} Yrs</Badge>
              <Badge variant="slate" className="bg-slate-100/50 border-slate-200/50 text-slate-500">{patient?.gender || '--'}</Badge>
              <Badge variant={patient?.profile?.bloodGroup && patient.profile.bloodGroup !== 'UNK' ? 'rose' : 'slate'} className={patient?.profile?.bloodGroup && patient.profile.bloodGroup !== 'UNK' ? 'font-black' : 'bg-slate-100/50 border-slate-200/50 text-slate-400'}>
                {patient?.profile?.bloodGroup || 'UNK'}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Badge variant="emerald" className="gap-1.5 px-3 py-1 text-[10px]">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Session
              </Badge>
              {(!patient?.balance || patient.balance === 0 || patient.balance === '0.00') ? null : (
                <Badge variant="amber" className="text-amber-700 font-bold px-3 py-1 text-[10px]">
                  Due: ₹{patient.balance}
                </Badge>
              )}
            </div>
          </div>

      {/* Allergies & Dynamic Clinical Risk Alerts - High Visibility */}
      <div className="mx-6 my-4 space-y-3">
        {patient?.profile?.allergies && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Medical Allergies</span>
            </div>
            <p className="text-xs font-bold text-rose-800 leading-relaxed">
              {patient.profile.allergies}
            </p>
          </div>
        )}

        {/* Dynamic Risk Flags from AI Risk Engine */}
        {riskFlags.map((flag: any) => (
          <div 
            key={flag.id} 
            className={`p-4 border rounded-2xl transition-all shadow-sm ${
              flag.severity === 'CRITICAL' 
                ? 'bg-rose-50/50 border-rose-200 text-rose-900 shadow-rose-50/30' 
                : flag.severity === 'HIGH'
                ? 'bg-orange-50/50 border-orange-200 text-orange-950 shadow-orange-50/30'
                : 'bg-amber-50/30 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${
                  flag.severity === 'CRITICAL' ? 'text-rose-600 animate-pulse' : 'text-orange-500'
                }`} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {flag.severity} Risk Indicator
                </span>
              </div>
              <Badge 
                variant={flag.severity === 'CRITICAL' ? 'rose' : flag.severity === 'HIGH' ? 'amber' : 'blue'}
                className="scale-90"
              >
                AI RISK
              </Badge>
            </div>
            <p className="text-[11px] font-bold leading-relaxed mb-3">
              {flag.reason}
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Auto-triage active</span>
              <button 
                onClick={() => handleAcknowledgeFlag(flag.id)}
                className={`px-3 py-1 font-black uppercase tracking-widest border rounded-xl transition-all ${
                  flag.severity === 'CRITICAL' 
                    ? 'bg-rose-600 text-white hover:bg-rose-700 border-none' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Clinical Metrics / Vitals */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Latest Vitals
          </h3>
          {loading ? (
            <span className="text-[10px] font-bold text-slate-400">Syncing...</span>
          ) : (
            <button onClick={refresh} className="text-[10px] font-bold text-blue-600 hover:underline">Refresh</button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <VitalBox 
            icon={<Scale className="w-4 h-4" />} 
            label="Weight" 
            value={latestVitals?.weight ? `${latestVitals.weight}kg` : '--'} 
            color="blue"
          />
          <VitalBox 
            icon={<Activity className="w-4 h-4" />} 
            label="Height" 
            value={latestVitals?.height ? `${latestVitals.height}cm` : '--'} 
            color="indigo"
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
          <VitalBox 
            icon={<Activity className="w-4 h-4" />} 
            label="SpO2" 
            value={latestVitals?.spo2 ? `${latestVitals.spo2}%` : '--'} 
            color="blue"
          />
        </div>
      </div>

      {/* Past Clinical Visits (History) */}
      <div className="px-6 py-4 border-t border-slate-100 mt-auto bg-slate-50/50">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            Past Visits
          </h3>
        </div>
        
        <div className="space-y-2 mb-3">
          {patient?.cases && patient.cases.length > 0 ? (
            patient.cases.slice(0, 2).map((c: any) => (
              <a 
                key={c.id}
                href={`/doctor/patients/${patient?.id}/history`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-slate-700 font-bold text-[11px] tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">
                    {c.visitComplaint?.presentComplaint || c.consultationRecord?.complaint?.chiefComplaint || 'Consultation Visit'}
                  </h3>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                  <span>{c.caseNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span>{format(new Date(c.createdAt), 'dd MMM yy')}</span>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-4 bg-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400">No past visits found</p>
            </div>
          )}
        </div>
        
        <a 
          href={`/doctor/patients/${patient?.id}/history`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
        >
          View Full History
        </a>
      </div>
        </div>
      </aside>

      {/* Toggle Button */}
      {onToggle && (
        <button 
          onClick={onToggle}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className={`absolute top-6 z-40 flex items-center justify-center transition-all duration-300 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-slate-300 ${isOpen ? '-right-4 w-8 h-8 rounded-full' : 'left-0 w-8 h-10 rounded-r-xl border-l-0 text-slate-600 shadow-md'}`}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      )}
    </div>
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
