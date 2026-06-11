import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Patient } from '../types';

interface ProfileSectionProps {
  patient: Patient;
  onSaveProfile: (profile: any) => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ patient, onSaveProfile }) => {
  const [profile, setProfile] = useState({
    address: patient.profile?.address || '',
    city: patient.profile?.city || '',
    state: patient.profile?.state || '',
    occupation: patient.profile?.occupation || '',
    emergencyContact: patient.profile?.emergencyContact || '',
    maritalStatus: patient.profile?.maritalStatus || '',
    bloodGroup: patient.profile?.bloodGroup || '',
    allergies: patient.profile?.allergies || '',
  });

  const [initialProfile, setInitialProfile] = useState({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.profile?.dob || '') || patient.profile?.age || '';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveProfile({ ...profile });
      setInitialProfile({ ...profile });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mt-8">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          Patient Demographics & Profile
        </h3>
        <button 
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
            isDirty && !isSaving ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-3 h-3" />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            Registration Data
          </h4>
          <div className="p-6 bg-slate-50/80 border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">First Name</label>
              <input type="text" value={patient.firstName} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Last Name</label>
              <input type="text" value={patient.lastName} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
              <input type="date" value={patient.profile?.dob?.split('T')[0] || ''} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Age</label>
              <input type="number" value={patient.profile?.age || ''} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Number</label>
              <input type="text" value={patient.mobile} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Gender</label>
              <input type="text" value={patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Language</label>
              <input type="text" value={patient.language || 'English'} disabled className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed text-slate-600" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Extended Demographics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Marital Status</label>
            <select value={profile.maritalStatus} onChange={e => setProfile({...profile, maritalStatus: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all">
              <option value="">Select</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Occupation</label>
            <input type="text" value={profile.occupation} onChange={e => setProfile({...profile, occupation: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Engineer, etc." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Emergency Contact</label>
            <input type="text" value={profile.emergencyContact} onChange={e => setProfile({...profile, emergencyContact: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Name / Phone" />
          </div>
          
          {/* Editable Clinical Profile Info */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Blood Group</label>
            <select value={profile.bloodGroup} onChange={e => setProfile({...profile, bloodGroup: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all">
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Allergies</label>
            <input type="text" value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="None Reported" />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Address</label>
            <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} rows={2} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Full home address..." />
          </div>
          <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">City</label>
              <input type="text" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">State</label>
              <input type="text" value={profile.state} onChange={e => setProfile({...profile, state: e.target.value})} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
