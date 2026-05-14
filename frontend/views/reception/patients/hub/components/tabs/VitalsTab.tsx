import React from 'react';
import { Activity } from 'lucide-react';
import { Patient } from '../../types';

interface VitalsTabProps {
  patient: Patient;
  onAddVitals: () => void;
}

const VitalsTab: React.FC<VitalsTabProps> = ({ patient, onAddVitals }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Detailed Vitals History</h3>
        <button 
          onClick={onAddVitals}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
        >
          Add Vitals
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Temp</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">BP</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulse</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">SPO2</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">BMI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {patient.vitals && patient.vitals.length > 0 ? (
              patient.vitals.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-800">{new Date(v.takenAt).toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(v.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-6 text-center text-xs font-black text-slate-700">{v.temperature}°F</td>
                  <td className="px-6 py-6 text-center text-xs font-black text-slate-700">{v.bloodPressure}</td>
                  <td className="px-6 py-6 text-center text-xs font-black text-slate-700">{v.pulse} <span className="text-[10px] text-slate-400">BPM</span></td>
                  <td className="px-6 py-6 text-center text-xs font-black text-slate-700">{v.spo2}%</td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black">{v.bmi || '--'}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <Activity className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Vitals History</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VitalsTab;
