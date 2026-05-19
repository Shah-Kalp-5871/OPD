'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  BadgeCheck, 
  Building2, 
  Lock, 
  Monitor, 
  Clock, 
  Calendar, 
  LogOut, 
  Camera, 
  ShieldCheck, 
  Smartphone, 
  Globe,
  Settings,
  UserCircle2,
  Trash2,
  Save,
  KeyRound,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const MyProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    contact: '',
    empId: '---',
    role: '',
    branch: 'Surat Main Clinic' // Still hardcoded as branch is not in DB yet
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const user = response.data || response; // Handle different response formats if unwrapped by interceptor
        
        setProfileData({
          fullName: user.name || '',
          email: user.email || '',
          contact: user.mobile || '',
          empId: user.id.split('-')[0].toUpperCase(), // Using short ID as Emp ID for now
          role: user.role || '',
          branch: 'Surat Main Clinic'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  if (loading) {
    return (
      <ReceptionLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading your profile...</p>
        </div>
      </ReceptionLayout>
    );
  }

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* 🔷 PAGE HEADER */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              My Profile
           </h1>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">
              Manage your reception account details and security settings.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* LEFT COLUMN: PROFILE & PHOTO */}
           <div className="lg:col-span-8 space-y-10">
              
              {/* 🔷 SECTION 1: PROFILE INFORMATION */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <UserCircle2 className="w-5 h-5 text-slate-400" />
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Profile Information</h3>
                    </div>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">Verified Account</span>
                 </div>
                 
                 <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <User className="w-3 h-3" /> Full Name
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm" 
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Mail className="w-3 h-3" /> Email Address
                          </label>
                          <input 
                            type="email" 
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm" 
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Phone className="w-3 h-3" /> Contact Number
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm" 
                            value={profileData.contact}
                            onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <BadgeCheck className="w-3 h-3" /> Employee ID
                          </label>
                          <div className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 cursor-not-allowed">
                             {profileData.empId}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Settings className="w-3 h-3" /> Role
                          </label>
                          <div className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 cursor-not-allowed uppercase tracking-widest">
                             {profileData.role}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Building2 className="w-3 h-3" /> Assigned Branch
                          </label>
                          <div className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 cursor-not-allowed">
                             {profileData.branch}
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-10 flex justify-end">
                       <button 
                         onClick={() => toast.success('Profile update feature coming soon!')}
                         className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 group"
                       >
                          <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
                          Update Profile
                       </button>
                    </div>
                 </div>
              </div>

              {/* 🔷 SECTION 3: PASSWORD & SECURITY */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Password & Security</h3>
                 </div>
                 <div className="p-8">
                    <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-4 items-start">
                       <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                       <div>
                          <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Managed Security</p>
                          <p className="text-[9px] font-bold text-amber-600 leading-relaxed uppercase tracking-wider">
                             To change or reset your password, please contact the System Administrator. Reception accounts do not have self-service password modification privileges for compliance and security auditing purposes.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: PHOTO, ATTENDANCE & DEVICE INFO */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* 🔷 SECTION 2: PROFILE PHOTO */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center space-y-6">
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-300">
                       <UserCircle2 className="w-20 h-20" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2.5 bg-teal-600 text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform">
                       <Camera className="w-4 h-4" />
                    </button>
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Profile Photo</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Allowed JPG, GIF or PNG. Max size 2MB</p>
                 </div>
                 <div className="flex gap-3 w-full">
                    <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">Upload New</button>
                    <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all border border-rose-100">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* 🔷 SECTION 4: DEVICE / SESSION INFO */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Active Session Info</h3>
                 </div>
                 <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Monitor className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Current Device</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Windows Desktop • Chrome</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Clock className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Last Login</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">13/04/2026 – 09:12 AM</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Globe className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">IP Address</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">192.168.1.5 (Secure VPN)</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-[9px] font-bold text-amber-700 uppercase leading-relaxed tracking-wider">
                       Session restricted to clinic premises. Account locking enabled for multiple failed login attempts.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default MyProfileView;

