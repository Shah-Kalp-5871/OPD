import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Save, 
  CheckCircle, 
  Shield, 
  RefreshCcw,
  MoreVertical,
  ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface SessionTopBarProps {
  caseNumber: string;
  doctorName: string;
  saving: boolean;
  lastSaved: Date | null;
}

const SessionTopBar: React.FC<SessionTopBarProps> = ({ 
  caseNumber, 
  doctorName, 
  saving, 
  lastSaved 
}) => {
  const router = useRouter();
  const [timer, setTimer] = useState(0);

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
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded">Case Active</span>
            <h1 className="text-white font-mono text-lg font-bold">{caseNumber}</h1>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Dr. {doctorName}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Consultation Timer */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-mono font-bold text-lg tabular-nums">
            {formatTime(timer)}
          </span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
          <div className="flex items-center gap-2">
            {saving ? (
              <RefreshCcw className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs text-slate-400">
              {saving ? 'Autosaving...' : lastSaved ? `Synced at ${format(lastSaved, 'HH:mm:ss')}` : 'Draft Saved'}
            </span>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <Shield className="w-4 h-4" />
            Finalize Consultation
          </button>
          
          <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTopBar;
