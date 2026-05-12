'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Camera, 
  Save, 
  CheckCircle2, 
  KeyRound,
  AlertCircle
} from 'lucide-react';

const MyProfileView = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(65); // Simulation

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-300">
               <User className="w-16 h-16 text-slate-300" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
               </div>
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
               <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">My Profile</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">Manage your personal account & security settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* 🔷 SECTION 1: PROFILE DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Profile Details</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" defaultValue="Dr. Kalp Shah" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="email" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" defaultValue="kalp.shah@medflow.com" />
                  </div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter ml-1">Contact admin to update primary email</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" defaultValue="+91 98765 43210" />
                </div>
              </div>
            </div>
          </div>

          {/* 🔷 SECTION 2: PASSWORD CHANGE */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Change Password</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type={showCurrentPass ? 'text' : 'password'} 
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-rose-600 focus:bg-white transition-all" 
                    placeholder="Enter current password"
                  />
                  <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type={showNewPass ? 'text' : 'password'} 
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-600 focus:bg-white transition-all" 
                      placeholder="Create new password"
                    />
                    <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Indicator */}
                  <div className="space-y-1.5 pt-1">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Password Strength: Strong</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">65%</span>
                     </div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                     </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type={showConfirmPass ? 'text' : 'password'} 
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-600 focus:bg-white transition-all" 
                      placeholder="Confirm new password"
                    />
                    <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔷 UPDATE BUTTON */}
          <div className="flex flex-col items-center gap-4">
            <button className="flex items-center gap-3 px-20 py-4 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg">
              <Save className="w-4 h-4" />
              UPDATE PROFILE
            </button>
            <div className="flex items-center gap-2 text-slate-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Security measures require a session re-login after password change</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MyProfileView;
