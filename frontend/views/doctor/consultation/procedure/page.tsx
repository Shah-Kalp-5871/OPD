'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import Link from 'next/link';
import { 
  ClipboardList, 
  FlaskConical, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  CheckCircle2, 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  Save,
  Scissors,
  CheckCircle,
  AlertCircle,
  FileSignature,
  Target,
  IndianRupee,
  CalendarCheck
} from 'lucide-react';

const ProcedureView = () => {
  const [procedureSearch, setProcedureSearch] = useState('');
  const [showDelayAlert, setShowDelayAlert] = useState(true);

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, completed: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, completed: true, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, active: true, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const procedureSessions = [
    { date: '25/03/2026', name: 'Hair Removal Diode', bodyPart: 'Face', session: '1/4', nextFu: '14/04/2026', status: 'Done', amount: '2,000', payStatus: 'Paid' },
    { date: '13/04/2026', name: 'Hair Removal Diode', bodyPart: 'Face', session: '2/4', nextFu: '03/05/2026', status: 'Pending', amount: '2,000', payStatus: 'Pending' },
    { date: '-', name: 'Hair Removal Diode', bodyPart: 'Face', session: '3/4', nextFu: '23/05/2026', status: 'Scheduled', amount: '2,000', payStatus: '-' },
    { date: '-', name: 'Hair Removal Diode', bodyPart: 'Face', session: '4/4', nextFu: '12/06/2026', status: 'Scheduled', amount: '2,000', payStatus: '-' },
  ];

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🔷 TOP CONSULTATION WORKFLOW TABS */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex overflow-x-auto scrollbar-hide gap-1">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href || '#'}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                 : tab.completed 
                 ? 'text-emerald-600 bg-emerald-50' 
                 : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
               }`}
             >
                <div className="relative">
                  <tab.icon className={`w-4 h-4 ${tab.active ? 'text-blue-400' : tab.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                  {tab.completed && <CheckCircle2 className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white rounded-full text-emerald-600" />}
                </div>
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        {/* 🔷 SECTION 1: PROCEDURE SELECTION */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Procedure Selection</h3>
              <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">
                 Live Billing Integration
              </div>
           </div>
           <div className="p-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                 <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text"
                   value={procedureSearch}
                   onChange={(e) => setProcedureSearch(e.target.value)}
                   placeholder="Select procedure from master list or type manually..."
                   className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                 />
              </div>
              <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
                 <Plus className="w-5 h-5" />
                 Add Procedure
              </button>
           </div>
           <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-300" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Adding procedure instantly updates Reception billing counter balance.</p>
           </div>
        </div>

        {/* 🔷 SECTION 2: PROCEDURE SESSION TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <CalendarCheck className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Procedure Sessions</h3>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-50">
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Procedure</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Body Part</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Session</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Next F/U</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Pay Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {procedureSessions.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.date}</td>
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{item.name}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">
                               {item.bodyPart}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-[11px] font-black text-blue-600 tracking-widest">{item.session}</td>
                         <td className="px-8 py-6 text-[11px] font-black text-slate-600 tracking-widest">{item.nextFu}</td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              item.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-slate-50 text-slate-400 border border-slate-100'
                            }`}>
                               {item.status}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-1 text-[11px] font-black text-slate-800">
                               <IndianRupee className="w-3 h-3" />
                               {item.amount}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.payStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                               {item.payStatus}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* 🔷 DELAY ALERT PANEL */}
        {showDelayAlert && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-l-[6px] border-l-rose-500">
             <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 shrink-0">
                   <Clock className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em]">DELAYED APPOINTMENT DETECTED</h4>
                   <p className="text-[13px] font-black text-slate-800 uppercase tracking-widest mt-1">
                      Patient arrived <span className="text-rose-600">10 days after</span> scheduled procedure date.
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="px-6 py-3.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                   AUTO UPGRADE (Reschedule)
                </button>
                <button onClick={() => setShowDelayAlert(false)} className="px-6 py-3.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                   KEEP ORIGINAL DATE
                </button>
             </div>
          </div>
        )}

        {/* 🔷 NOTES SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* PRE-PROCEDURE NOTES */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Pre-Procedure Notes</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auto-loaded from template – Editable</p>
                 </div>
                 <FileSignature className="w-4 h-4 text-slate-300" />
              </div>
              <div className="p-8">
                 <textarea 
                   rows={4}
                   defaultValue="Avoid sun exposure 2 days prior. No waxing or threading for 1 week."
                   className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-600 leading-relaxed outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                 />
              </div>
           </div>

           {/* POST-PROCEDURE NOTES */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Post-Procedure Notes</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auto-loaded – Editable</p>
                 </div>
                 <CheckCircle className="w-4 h-4 text-slate-300" />
              </div>
              <div className="p-8">
                 <textarea 
                   rows={4}
                   defaultValue="Apply cooling gel. Avoid direct sun for 48 hrs. Use SPF 50+."
                   className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-600 leading-relaxed outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                 />
              </div>
           </div>

        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
           <Info className="w-4 h-4 text-blue-400" />
           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">
              Consent form auto-generated when procedure selected.
           </p>
        </div>

        {/* 🔷 ACTION BUTTONS (STICKY BAR) */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-between gap-4 z-40">
           <Link 
             href="/doctor/consultation/drugs"
             className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <ChevronLeft className="w-4 h-4" />
              Back to Drugs
           </Link>
           
           <div className="flex gap-4">
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Procedure
              </button>
              <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group">
                 Next → Images
                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default ProcedureView;
