import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Save, 
  CheckCircle, 
  Shield, 
  RefreshCcw,
  MoreVertical,
  ChevronLeft,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button, Badge } from './ClinicalDesignSystem';
import { useSessionTopBar } from '../hooks/useSessionTopBar';

interface SessionTopBarProps {
  caseNumber: string;
  doctorName: string;
  saving: boolean;
  lastSaved: Date | null;
  patientName?: string;
  mrdNumber?: string;
  visitType?: string;
  doctorId?: string;
}

const SessionTopBar: React.FC<SessionTopBarProps> = ({ 
  caseNumber, 
  doctorName, 
  saving, 
  lastSaved,
  patientName,
  mrdNumber,
  visitType = 'Consultation',
  doctorId
}) => {
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const { nextPatient } = useSessionTopBar(doctorId);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => router.back()}
          className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-400 transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">{patientName || 'Patient Name'}</h1>
              <Badge variant="blue">{visitType}</Badge>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {mrdNumber || 'MRD-0000'}</span>
              <span className="flex items-center gap-1.5 text-blue-600/70"><Calendar className="w-3 h-3" /> Case: {caseNumber}</span>
            </div>
          </div>

          {/* NEXT PATIENT INDICATOR */}
          <div className="pl-6 border-l border-slate-100 hidden lg:block group cursor-pointer hover:bg-slate-50/50 p-2 -ml-2 rounded-xl transition-all">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Up Next in Queue</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                {nextPatient ? (nextPatient.patient?.firstName + ' ' + nextPatient.patient?.lastName) : 'No Waiting Patients'}
              </p>
              {nextPatient && (
                <Badge variant="blue" className="scale-75 opacity-80 uppercase tracking-widest">
                  {nextPatient.status === 'VITALS_DONE' ? 'Ready' : 'Waiting'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Sync Status */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
          {saving ? (
            <RefreshCcw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
              {saving ? 'Syncing...' : 'Secure & Synced'}
            </span>
            <span className="text-[11px] font-bold text-slate-600 tabular-nums leading-none">
              {lastSaved ? format(lastSaved, 'HH:mm:ss') : 'Just now'}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl group transition-all hover:bg-blue-50">
          <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-tighter leading-none mb-0.5">Duration</span>
            <span className="text-blue-700 font-mono font-black text-lg tabular-nums leading-none tracking-tight">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
          <Button 
            variant="primary" 
            size="lg" 
            className="rounded-2xl h-12 px-8"
            icon={<Shield className="w-4 h-4" />}
          >
            Finalize Visit
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SessionTopBar;
