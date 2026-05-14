import React from 'react';
import { Activity, Plus, Thermometer, Heart, Droplet, Wind, Scale, Ruler } from 'lucide-react';
import { Vital } from '../types';

interface VitalsCardProps {
  latestVitals?: Vital;
  onAddVitals: () => void;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ latestVitals, onAddVitals }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          Recent Medical Readings
        </h3>
        <button 
          onClick={onAddVitals}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
        >
          <Plus className="w-3 h-3" />
          Update Sheet
        </button>
      </div>
      
      <div className="p-6">
        {latestVitals ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Thermometer className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Temperature</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.temperature}<span className="text-[10px] ml-1 text-slate-400 font-black">°F</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Blood Pressure</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.bloodPressure}<span className="text-[10px] ml-1 text-slate-400 font-black">mmHg</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Droplet className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Pulse Rate</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.pulse}<span className="text-[10px] ml-1 text-slate-400 font-black">BPM</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Wind className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">SPO2 Level</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.spo2}<span className="text-[10px] ml-1 text-slate-400 font-black">%</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Scale className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Weight</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.weight || '--'}<span className="text-[10px] ml-1 text-slate-400 font-black">KG</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Ruler className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Height</span>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {latestVitals.height || '--'}<span className="text-[10px] ml-1 text-slate-400 font-black">CM</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <Activity className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Readings Found</p>
          </div>
        )}
      </div>

      {latestVitals && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recorded On: {new Date(latestVitals.takenAt).toLocaleString()}</span>
          <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Clinical Standard</span>
        </div>
      )}
    </div>
  );
};

export default VitalsCard;
