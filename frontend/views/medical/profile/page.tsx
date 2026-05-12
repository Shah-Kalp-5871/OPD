'use client';

import React, { useState } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  IdCard, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera,
  CheckCircle2,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const MedicalProfileView = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <MedicalLayout>
      <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
        
        {/* 🔷 PAGE HEADER */}
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Manage your pharmacy account information and password settings.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* 🔷 LEFT COLUMN: AVATAR & QUICK INFO */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-32 bg-slate-900 -z-0" />
                 
                 <div className="relative mt-8">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500 border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-black z-10 relative">
                       SS
                    </div>
                    <button className="absolute bottom-0 right-0 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-emerald-600 hover:scale-110 transition-transform z-20">
                       <Camera className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="mt-6 z-10">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Suresh Shah</h2>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Medical / Pharmacy Staff</p>
                 </div>

                 <div className="w-full mt-10 pt-8 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <IdCard className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</span>
                       </div>
                       <span className="text-[11px] font-black text-slate-800">MED-003</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Account Status</span>
                       </div>
                       <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
                    </div>
                 </div>
              </div>

              <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                 <Lock className="w-32 h-32 absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Security Tip</h3>
                 <p className="text-[13px] font-bold leading-relaxed mt-4 relative z-10">
                    Always use a unique password for your pharmacy account to ensure drug inventory integrity.
                 </p>
              </div>
           </div>

           {/* 🔷 RIGHT COLUMN: FORMS */}
           <div className="lg:col-span-8 space-y-10">
              
              {/* 🏠 PROFILE INFORMATION CARD */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                       <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Profile Information</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                       <div className="relative">
                          <User className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type="text" defaultValue="Suresh Shah" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type="email" defaultValue="suresh@clinic.com" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                       <div className="relative">
                          <Phone className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type="text" defaultValue="9876543210" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                       </div>
                    </div>
                    <div className="space-y-3 opacity-60">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                       <div className="relative">
                          <ShieldCheck className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" readOnly value="Medical / Pharmacy Staff" className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-[13px] font-black text-slate-500 outline-none cursor-not-allowed" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* 🔒 PASSWORD CHANGE CARD */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400">
                       <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Change Password</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                       <div className="relative">
                          <Lock className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type={showCurrentPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                          <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                             {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                       <div className="relative">
                          <Lock className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type={showNewPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                          <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                             {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                       <div className="relative">
                          <Lock className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                          <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                             {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                          Password must contain at least 8 characters, uppercase letter, lowercase letter, number, and special character.
                       </p>
                    </div>
                 </div>
              </div>

              {/* 🔷 ACTION FOOTER */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-10">
                    <CheckCircle2 className="w-24 h-24 text-emerald-400 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                 </div>
                 <div className="text-center md:text-left relative z-10">
                    <h4 className="text-lg font-black text-white tracking-tight">Ready to save changes?</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profile updates are reflected immediately.</p>
                 </div>
                 <button className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3 relative z-10">
                    UPDATE PROFILE
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </div>

           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default MedicalProfileView;
