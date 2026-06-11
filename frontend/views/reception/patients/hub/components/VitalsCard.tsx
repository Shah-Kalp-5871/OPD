import React, { useState, useEffect } from 'react';
import { Activity, Save } from 'lucide-react';
import { Vital } from '../types';

interface VitalsCardProps {
  latestVitals?: Vital;
  vitalsHistory?: Vital[];
  onSaveVitals: (vitals: any) => Promise<void>;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ latestVitals, vitalsHistory = [], onSaveVitals }) => {
  const parseBP = (bp?: string) => {
    if (!bp) return { bpSys: '', bpDia: '' };
    const parts = bp.split('/');
    return { bpSys: parts[0] || '', bpDia: parts[1] || '' };
  };

  const initialBp = parseBP(latestVitals?.bloodPressure);

  const [vitals, setVitals] = useState({
    temp: latestVitals?.temperature?.toString() || '',
    pulse: latestVitals?.pulse?.toString() || '',
    bpSys: initialBp.bpSys,
    bpDia: initialBp.bpDia,
    height: latestVitals?.height?.toString() || '',
    weight: latestVitals?.weight?.toString() || '',
    spo2: latestVitals?.spo2?.toString() || ''
  });

  const [initialVitals, setInitialVitals] = useState({ ...vitals });
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = JSON.stringify(vitals) !== JSON.stringify(initialVitals);

  useEffect(() => {
    const newBp = parseBP(latestVitals?.bloodPressure);
    setVitals({
      temp: latestVitals?.temperature?.toString() || '',
      pulse: latestVitals?.pulse?.toString() || '',
      bpSys: newBp.bpSys,
      bpDia: newBp.bpDia,
      height: latestVitals?.height?.toString() || '',
      weight: latestVitals?.weight?.toString() || '',
      spo2: latestVitals?.spo2?.toString() || ''
    });
  }, [latestVitals]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveVitals(vitals);
      setInitialVitals({ ...vitals });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateBMI = (weight: string | number, height: string | number) => {
    if (!weight || !height) return '--';
    const h = Number(height) / 100;
    const w = Number(weight);
    if (h === 0) return '--';
    return (w / (h * h)).toFixed(1);
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm mt-8">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
          <Activity className="w-4 h-4 text-teal-600" />
          Patient Vitals & Measurements
        </h3>
        <button 
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isDirty && !isSaving ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : 'Save Vitals'}
        </button>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Temp (°F)</label>
            <input type="text" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="98.6" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pulse (BPM)</label>
            <input type="text" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="72" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sys (mmHg)</label>
            <input type="text" value={vitals.bpSys} onChange={e => setVitals({...vitals, bpSys: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="120" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dia (mmHg)</label>
            <input type="text" value={vitals.bpDia} onChange={e => setVitals({...vitals, bpDia: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="80" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Weight (Kg)</label>
            <input type="text" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="70" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Height (cm)</label>
            <input type="text" value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="170" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">SpO2 (%)</label>
            <input type="text" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-center" placeholder="98" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Calculated BMI</span>
            <span className="text-xl font-black text-slate-800">{calculateBMI(vitals.weight, vitals.height)}</span>
          </div>
        </div>

        {!vitalsHistory || vitalsHistory.length === 0 ? (
          <div className="mt-12 text-center p-8 bg-slate-50/50 border border-slate-200/50 rounded-2xl border-dashed">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No vitals recorded yet</p>
          </div>
        ) : (
          <div className="mt-12">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Vitals History
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">Temp (°F)</th>
                    <th className="px-6 py-4 whitespace-nowrap">Pulse (BPM)</th>
                    <th className="px-6 py-4 whitespace-nowrap">Sys (mmHg)</th>
                    <th className="px-6 py-4 whitespace-nowrap">Dia (mmHg)</th>
                    <th className="px-6 py-4 whitespace-nowrap">Weight (kg)</th>
                    <th className="px-6 py-4 whitespace-nowrap">Height (cm)</th>
                    <th className="px-6 py-4 whitespace-nowrap">SPO2 (%)</th>
                    <th className="px-6 py-4 whitespace-nowrap">BMI</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalsHistory.slice(0, 5).map((vital, idx) => {
                    const bpParts = (vital.bloodPressure || '').split('/');
                    const sys = bpParts[0] || '--';
                    const dia = bpParts[1] || '--';
                    return (
                      <tr key={vital.id || idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{new Date(vital.takenAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{vital.temperature || '--'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{vital.pulse || '--'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{sys}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{dia}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{vital.weight || '--'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{vital.height || '--'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{vital.spo2 || '--'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{calculateBMI(vital.weight, vital.height)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {vitalsHistory.length > 5 && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => alert("Full Record view coming soon...")}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  See Full Record
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {latestVitals && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Recorded: {new Date(latestVitals.takenAt).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default VitalsCard;
