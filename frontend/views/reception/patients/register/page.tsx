'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  UserPlus, 
  Save, 
  Printer, 
  CalendarCheck, 
  Lock, 
  Info, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Fingerprint,
  AlertCircle,
  Hash,
  ChevronRight,
  Barcode
} from 'lucide-react';

const PatientRegistrationView = () => {
  const [mrdNumber] = useState('P03-260001'); // UI Simulation

  return (
    <ReceptionLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">New Patient Registration</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-teal-500" />
              Fields marked with * are mandatory for registration
            </p>
          </div>
          
          {/* MRD Display Box */}
          <div className="bg-teal-50 px-6 py-4 rounded-2xl border border-teal-100 flex flex-col items-end">
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">MRD No. (Auto-generated)</span>
             <h3 className="text-xl font-black text-slate-800 tracking-widest">{mrdNumber}</h3>
          </div>
        </div>

        <div className="space-y-10">
          {/* 🔷 SECTION 1: BASIC REGISTRATION DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                   <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Basic Registration Details</h3>
             </div>
             
             <div className="p-8 space-y-8">
                {/* Name Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Surname *</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" placeholder="Enter Surname" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Middle Name</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" placeholder="Enter Middle Name" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" placeholder="Enter Last Name" />
                   </div>
                </div>

                {/* Contact & Gender Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2 md:col-span-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Number *</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                         <input type="text" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 transition-all" placeholder="Mobile / WhatsApp" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gender *</label>
                      <div className="flex gap-2">
                         {['M', 'F', 'Other'].map(opt => (
                           <button key={opt} className="flex-1 py-3.5 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-50 hover:border-teal-200 transition-all text-slate-500">
                              {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Language *</label>
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer">
                         <option>English</option>
                         <option>Gujarati</option>
                         <option>Hindi</option>
                      </select>
                   </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Address</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                      <textarea rows={2} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-teal-600 transition-all resize-none" placeholder="Enter full patient address..."></textarea>
                   </div>
                </div>
             </div>
          </div>

          {/* 🔷 SECTION 3: PROFILE UPGRADE (LOCKED) */}
          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed overflow-hidden relative">
             <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center max-w-[280px]">
                   <Lock className="w-8 h-8 text-slate-300 mb-3" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                     Locked Fields<br/>
                     <span className="text-teal-600 text-[11px]">Doctor / Admin Privileges Required</span>
                   </p>
                </div>
             </div>
             
             <div className="p-6 opacity-40 grayscale">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em] mb-6 flex items-center gap-3">
                   <Fingerprint className="w-5 h-5 text-slate-400" />
                   Profile Upgrade Fields
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                      <input type="date" disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                      <input type="text" disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Allergies</label>
                      <input type="text" disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Medical History</label>
                      <input type="text" disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl" />
                   </div>
                </div>
             </div>
          </div>

          {/* 🔷 BOTTOM SECTION: ACTIONS & STICKER PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Action Buttons Column */}
             <div className="space-y-6">
                <div className="flex flex-col gap-4">
                   <button className="w-full flex items-center justify-center gap-3 py-5 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100">
                      <CalendarCheck className="w-4 h-4" />
                      SAVE & BOOK APPOINTMENT
                   </button>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                         <Save className="w-4 h-4" />
                         SAVE ONLY
                      </button>
                      <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-teal-300 transition-all shadow-sm">
                         <Printer className="w-4 h-4" />
                         PRINT STICKER
                      </button>
                   </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                   <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                   <div>
                      <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Sticker Printing Note</h4>
                      <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                         Ensure thermal printer is connected and loaded with 50mm x 25mm labels. 
                         Verify MRD sequence before final registration.
                      </p>
                   </div>
                </div>
             </div>

             {/* 🔷 PATIENT STICKER PREVIEW CARD */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Sticker Preview</h4>
                   <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase tracking-widest">Ready to Print</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 font-mono relative overflow-hidden group max-w-sm mx-auto">
                   {/* Sticker Background Texture */}
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none text-[8px] flex flex-wrap gap-4 overflow-hidden">
                      {Array(50).fill('MEDFLOW-STK-001')}
                   </div>

                   <div className="space-y-4 relative z-10">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Patient Full Name</p>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">RAMESHBHAI MANUBHAI PATEL</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">MRD Number</p>
                            <p className="text-sm font-black text-teal-700 tracking-widest">{mrdNumber}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Gender | Age</p>
                            <p className="text-xs font-black text-slate-800">M | 35 Yrs</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 border-dashed flex flex-col items-center gap-2">
                         <div className="w-full h-12 flex items-center justify-center opacity-70">
                            {/* Visual Barcode Placeholder */}
                            <div className="flex gap-[1px] h-full items-end">
                               {[2, 4, 1, 3, 2, 5, 2, 4, 1, 6, 2, 4, 2, 3, 1, 5, 2, 4].map((w, i) => (
                                 <div key={i} className="bg-slate-900" style={{ width: `${w}px`, height: '100%' }}></div>
                               ))}
                            </div>
                         </div>
                         <span className="text-[8px] font-black text-slate-400 tracking-[0.5em]">{mrdNumber}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </ReceptionLayout>
  );
};

export default PatientRegistrationView;
