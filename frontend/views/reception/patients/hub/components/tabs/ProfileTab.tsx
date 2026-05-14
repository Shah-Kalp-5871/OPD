import React from 'react';
import { Calendar, MapPin, Briefcase, ShieldCheck, AlertCircle } from 'lucide-react';
import { Patient } from '../../types';

interface ProfileTabProps {
  patient: Patient;
  onEditProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ patient, onEditProfile }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Patient Extended Profile</h3>
        <button 
          onClick={onEditProfile}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          Edit Profile
        </button>
      </div>
      <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-teal-500" /> Date of Birth
            </label>
            <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
              {patient.profile?.dob ? new Date(patient.profile.dob).toLocaleDateString() : 'Not Set'}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-500" /> Address
            </label>
            <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 leading-relaxed">
              {patient.profile?.address || 'Not Set'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
              <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">{patient.profile?.city || 'Not Set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
              <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">{patient.profile?.state || 'Not Set'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-teal-500" /> Occupation
            </label>
            <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">{patient.profile?.occupation || 'Not Set'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> Emergency Contact
            </label>
            <p className="text-sm font-black text-slate-800 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">{patient.profile?.emergencyContact || 'Not Set'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" /> Medical Allergies
            </label>
            <p className="text-sm font-black text-rose-600 px-6 py-4 bg-rose-50 rounded-2xl border border-rose-100">{patient.profile?.allergies || 'None Reported'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
