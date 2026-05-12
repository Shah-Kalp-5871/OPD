'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Settings, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Share2, 
  Save, 
  Laptop, 
  Lock, 
  Eye, 
  EyeOff, 
  Monitor, 
  Smartphone, 
  Trash2, 
  Ban, 
  CheckCircle2, 
  Info,
  ChevronDown,
  Type
} from 'lucide-react';

const SettingsView = () => {
  const [sectionVisibility, setSectionVisibility] = useState({
    patientInfo: true,
    doctorInfo: true,
    drugList: true,
    labSection: true,
    signatureBlock: true
  });

  const devices = [
    { name: 'Admin - Front Desk (Dell)', ip: '192.168.1.102', mac: '00:1A:2B:3C:4D:5E', status: 'Authorized', lastLogin: '13/04/2026 - 09:45 AM' },
    { name: 'Doctor - OPD 1 (iPad)', ip: '192.168.1.105', mac: '00:1A:2B:3C:4D:5F', status: 'Authorized', lastLogin: '13/04/2026 - 10:15 AM' },
    { name: 'Reception - Billing (Mac)', ip: '192.168.1.110', mac: '00:1A:2B:3C:4D:6G', status: 'Authorized', lastLogin: '13/04/2026 - 08:30 AM' },
    { name: 'Unidentified Phone', ip: '192.168.4.22', mac: '00:1A:2B:3C:4D:6H', status: 'Blocked', lastLogin: '12/04/2026 - 11:20 PM' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 pb-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">System Settings</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Central Clinic Configuration Panel</p>
        </div>

        {/* 🔷 SECTION 1: CLINIC PROFILE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Building2 className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Clinic Profile</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Clinic Name</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all" defaultValue="MedFlow Speciality Clinic" />
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all" defaultValue="102-105 Royal Square, Health City, MH 40001" />
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all" defaultValue="+91 98765 43210" />
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all" defaultValue="contact@medflowclinic.com" />
             </div>
          </div>
        </div>

        {/* 🔷 SECTION 2: PRESCRIPTION TEMPLATE CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                   <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Prescription Template Settings</h3>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                <Info className="w-3.5 h-3.5" />
                Admin Controlled
             </div>
          </div>
          <div className="p-8 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Page Size</label>
                   <div className="relative">
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                         <option>A4 Format</option>
                         <option>A3 Format</option>
                         <option>4-Side Format</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Font</label>
                   <div className="relative">
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                         <option>Inter (Modern)</option>
                         <option>Roboto (Standard)</option>
                         <option>Outfit (Premium)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Type className="w-3.5 h-3.5 text-blue-500" />
                      Font Size
                   </label>
                   <div className="flex items-center gap-4">
                      <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="12" />
                      <span className="text-[10px] font-black text-slate-300 uppercase whitespace-nowrap tracking-widest">Doctors can edit this</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Header Content</label>
                   <textarea rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none focus:bg-white transition-all" placeholder="Enter header text or HTML..."></textarea>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Footer Content</label>
                   <textarea rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none focus:bg-white transition-all" placeholder="Enter footer text (license info, address)..."></textarea>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Section Visibility Toggles</label>
                <div className="flex flex-wrap gap-4">
                   {Object.entries(sectionVisibility).map(([key, value]) => (
                     <button 
                        key={key}
                        onClick={() => setSectionVisibility(prev => ({ ...prev, [key]: !value }))}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          value ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-200'
                        }`}
                     >
                        {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* 🔷 SECTION 3: SECURITY SETTINGS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Security & Device Controls</h3>
             </div>
             <div className="flex items-center gap-2 text-rose-500 animate-pulse">
                <Lock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Auto-Block Active</span>
             </div>
          </div>
          <div className="p-8 space-y-8">
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Only authorized devices can access clinical data modules.</p>
                <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest hover:border-blue-300 transition-all shadow-sm">
                   + Authorize Current Device
                </button>
             </div>

             <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-[10px]">
                         <th className="px-6 py-4">Device Name</th>
                         <th className="px-6 py-4">IP / MAC</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Last Activity</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {devices.map((device, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 {device.name.includes('Phone') ? <Smartphone className="w-4 h-4 text-slate-400" /> : <Monitor className="w-4 h-4 text-slate-400" />}
                                 <span className="text-xs font-bold text-slate-800">{device.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              <span className="block">{device.ip}</span>
                              <span className="text-slate-300">{device.mac}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                device.status === 'Authorized' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                 {device.status === 'Authorized' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                 {device.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{device.lastLogin}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-300">
                                 <button className="p-1.5 hover:text-rose-600 transition-colors"><Ban className="w-4 h-4" /></button>
                                 <button className="p-1.5 hover:text-slate-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* 🔷 SECTION 4: GOOGLE REVIEW INTEGRATION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Share2 className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Google Review Integration</h3>
          </div>
          <div className="p-8 space-y-4">
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Clinic Google Review URL
                </label>
                <div className="relative">
                   <input 
                     type="text" 
                     className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                     defaultValue="https://g.page/medflow-speciality-clinic/review" 
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Link
                   </div>
                </div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed px-2 italic">
               This link is dynamically injected into Post-Appointment SMS, WhatsApp Follow-ups, and Google Review triggers.
             </p>
          </div>
        </div>

        {/* 🔷 SECTION 5: SAVE BUTTON */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
           <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All modifications are logged for audit trail</span>
              </div>
              <button className="flex items-center gap-3 px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em]">
                <Save className="w-4 h-4" />
                SAVE ALL SETTINGS
              </button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsView;
