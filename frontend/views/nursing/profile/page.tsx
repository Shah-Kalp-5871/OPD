'use client';

import React, { useState } from 'react';
import NursingLayout from '@/views/layouts/NursingLayout';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Bell,
  LogOut,
  MapPin,
  Briefcase
} from 'lucide-react';

const NursingProfileView = () => {
  const [formData, setFormData] = useState({
    fullName: 'Bhavna Desai',
    email: 'bhavna@clinic.com',
    contact: '9876543210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <NursingLayout>
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* 🔷 PAGE HEADER */}
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">My Profile</h1>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Manage your nursing account information and password.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* 🔷 PROFILE SUMMARY SIDEBAR (Left) */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="h-32 bg-green-600 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                       <div className="relative group">
                          <div className="w-28 h-28 bg-white rounded-[2rem] p-1.5 shadow-xl">
                             <div className="w-full h-full bg-slate-100 rounded-[1.6rem] flex items-center justify-center text-slate-400">
                                <User className="w-12 h-12" />
                             </div>
                          </div>
                          <button className="absolute bottom-1 right-1 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
                             <Camera className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-16 pb-10 px-8 text-center space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{formData.fullName}</h2>
                       <div className="flex items-center justify-center gap-2">
                          <span className="px-4 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-100">NURSING</span>
                          <span className="px-4 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 flex items-center gap-1.5">
                             <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                             Active
                          </span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 space-y-4">
                       <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                             <Mail className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                             <p className="text-[11px] font-bold text-slate-700">{formData.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                             <Phone className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                             <p className="text-[11px] font-bold text-slate-700">{formData.contact}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl shadow-slate-200">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Security Status</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2FA Authentication</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Enabled</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full w-[85%]" />
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Your account security score is high. Keep your password updated regularly.</p>
                 </div>
              </div>
           </div>

           {/* 🔷 PROFILE FORM SECTION (Right) */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                       <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Profile Settings</h2>
                 </div>

                 <div className="p-10 space-y-10">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative group">
                             <User className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500" />
                             <input 
                               type="text" 
                               defaultValue={formData.fullName}
                               className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                             <Mail className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500" />
                             <input 
                               type="email" 
                               defaultValue={formData.email}
                               className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                          <div className="relative group">
                             <Phone className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500" />
                             <input 
                               type="tel" 
                               defaultValue={formData.contact}
                               className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                       </div>
                    </div>

                    {/* Password Section */}
                    <div className="pt-10 border-t border-slate-50 space-y-8">
                       <div className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Security & Password</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                             <input 
                               type="password" 
                               placeholder="••••••••"
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                          <div className="hidden md:block" />
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                             <input 
                               type="password" 
                               placeholder="••••••••"
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                             <input 
                               type="password" 
                               placeholder="••••••••"
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-green-600 focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                       </div>

                       <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                             Password must contain at least 8 characters including uppercase, lowercase, number, and special character.
                          </p>
                       </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-10 border-t border-slate-50 flex items-center justify-end gap-4">
                       <button className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                       <button className="px-16 py-5 bg-green-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5" />
                          UPDATE PROFILE
                       </button>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </NursingLayout>
  );
};

export default NursingProfileView;
