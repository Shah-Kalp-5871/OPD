import React from 'react';
import { Patient, Vital } from '../types';

interface MedicalSnapshotProps {
  patient: Patient;
  latestVitals?: Vital;
}

const MedicalSnapshot: React.FC<MedicalSnapshotProps> = ({ patient, latestVitals }) => {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Last BP</span>
          <span className="text-sm font-black">{latestVitals ? latestVitals.bloodPressure : '--'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">BMI Status</span>
          <span className="text-sm font-black text-sky-400">{latestVitals?.bmi || '--'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Allergies</span>
          <span className="text-sm font-black text-rose-400">{patient.profile?.allergies || 'None'}</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalSnapshot;
