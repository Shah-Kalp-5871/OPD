import React from 'react';
import { UserCheck, CheckCircle2, Circle } from 'lucide-react';
import { Patient } from '../types';

interface ProfileCompletionCardProps {
  patient: Patient;
  completion: number;
  onComplete: () => void;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  patient, 
  completion, 
  onComplete 
}) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-orange-600" />
          Profile Status
        </h3>
        {completion < 100 && (
          <button 
            onClick={onComplete}
            className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
          >
            Complete
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-orange-500" />
          <span className="text-xs font-bold text-slate-600">Registration Complete</span>
        </div>
        <div className="flex items-center gap-3">
          {patient.profile?.address ? <CheckCircle2 className="w-5 h-5 text-orange-500" /> : <Circle className="w-5 h-5 text-slate-200" />}
          <span className={`text-xs font-bold ${patient.profile?.address ? 'text-slate-600' : 'text-slate-400'}`}>Address Details</span>
        </div>
        <div className="flex items-center gap-3">
          {patient.profile?.occupation ? <CheckCircle2 className="w-5 h-5 text-orange-500" /> : <Circle className="w-5 h-5 text-slate-200" />}
          <span className={`text-xs font-bold ${patient.profile?.occupation ? 'text-slate-600' : 'text-slate-400'}`}>Occupation & Notes</span>
        </div>
        <div className="flex items-center gap-3">
          {patient.profile?.emergencyContact ? <CheckCircle2 className="w-5 h-5 text-orange-500" /> : <Circle className="w-5 h-5 text-slate-200" />}
          <span className={`text-xs font-bold ${patient.profile?.emergencyContact ? 'text-slate-600' : 'text-slate-400'}`}>Emergency Contact</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
