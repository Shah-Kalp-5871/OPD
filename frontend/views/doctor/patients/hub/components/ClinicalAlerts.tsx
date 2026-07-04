import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert } from '../types';

interface ClinicalAlertsProps {
  alerts: Alert[];
  onAction: () => void;
}

const ClinicalAlerts: React.FC<ClinicalAlertsProps> = ({ alerts, onAction }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-rose-50 rounded-[2rem] border border-rose-100 p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest">Clinic Alerts</h4>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0"></div>
            <p className="text-xs font-bold text-rose-700 leading-relaxed">{alert.message}</p>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <button 
          onClick={onAction}
          className="w-full py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all"
        >
          Take Action
        </button>
      </div>
    </div>
  );
};

export default ClinicalAlerts;
