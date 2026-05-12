'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Activity,
  History,
  Info,
  TrendingUp,
  CreditCard,
  User,
  Zap,
  MoreVertical
} from 'lucide-react';

const DoctorDashboardView = () => {
  const [blinkingPatients, setBlinkingPatients] = useState<Set<string>>(new Set(['Kishore Joshi', 'Ritu Mehta']));

  const stopBlinking = (name: string) => {
    const newSet = new Set(blinkingPatients);
    newSet.delete(name);
    setBlinkingPatients(newSet);
  };

  const queueData = [
    { caseId: 'C001-001', time: '09:00', name: 'Rameshbhai Patel', type: 'Consultation', status: null },
    { caseId: 'C002-001', time: '09:10', name: 'Sneha Shah', type: 'F/U', status: 'IN PROG' },
    { caseId: 'C003-001', time: '09:20', name: 'Mahesh Kumar', type: 'Consultation', status: 'NEXT' },
    { caseId: 'C004-001', time: '09:30', name: 'Priya Desai', type: 'Procedure', status: 'FOC' },
    { caseId: 'C005-001', time: '09:40', name: 'Kishore Joshi', type: 'Inquiry', status: null },
    { caseId: 'C006-001', time: '09:50', name: 'Ritu Mehta', type: 'Consultation', status: null },
    { caseId: 'C007-001', time: '10:00', name: 'Arjun Patel', type: 'Follow-Up', status: null },
  ];

  const vitalsHistory = [
    { date: '01/04', bp: '122/80', bmi: '24.1', wt: '72kg', type: 'Inquiry' },
    { date: '15/03', bp: '118/78', bmi: '24.0', wt: '71kg', type: 'Consultation' },
    { date: '01/03', bp: '124/82', bmi: '24.3', wt: '73kg', type: 'F/U' },
    { date: '10/02', bp: '120/80', bmi: '23.8', wt: '70kg', type: 'Follow-Up' },
  ];

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* 🔷 SECTION 1: NEXT PATIENT ALERT */}
        <div className="bg-slate-900 rounded-[2rem] p-2 pr-2 overflow-hidden shadow-2xl flex items-center justify-between border-4 border-slate-800">
           <div className="flex items-center gap-6 px-8 py-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Next Patient</span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight mt-1">
                    MAHESH K. KUMAR <span className="text-slate-500 mx-2">|</span> 45M <span className="text-slate-500 mx-2">|</span> New Consultation
                 </h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Case: C003-001-130426</p>
              </div>
           </div>
           <button className="bg-white hover:bg-blue-50 text-slate-900 px-12 py-8 rounded-[1.5rem] flex items-center gap-3 transition-all group border-l border-slate-800">
              <span className="text-xs font-black uppercase tracking-[0.2em]">Next Patient</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
           
           {/* LEFT COLUMN: TODAY'S OPD QUEUE */}
           <div className="xl:col-span-8 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[700px]">
                 <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                          <ClipboardList className="w-5 h-5" />
                       </div>
                       <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Today's OPD Queue</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                       <span className="text-[10px] font-black uppercase tracking-widest">Live Feed</span>
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50/30">
                             <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Case ID</th>
                             <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Time</th>
                             <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Patient</th>
                             <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Visit Type</th>
                             <th className="px-8 py-6 border-b border-slate-50"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {queueData.map((patient, idx) => (
                            <tr key={idx} className={`group transition-all ${patient.status === 'NEXT' ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                               <td className="px-8 py-6">
                                  <span className={`text-[11px] font-black tracking-widest ${patient.status === 'NEXT' ? 'text-blue-600' : 'text-slate-400 uppercase'}`}>
                                     {patient.caseId}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                     <Clock className="w-3.5 h-3.5 text-slate-300" />
                                     {patient.time}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <button 
                                       onClick={() => stopBlinking(patient.name)}
                                       className={`text-xs font-black uppercase tracking-widest transition-all ${blinkingPatients.has(patient.name) ? 'animate-pulse text-blue-600 scale-105' : 'text-slate-800'}`}
                                     >
                                        {patient.name}
                                     </button>
                                     {patient.status === 'IN PROG' && (
                                       <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-lg shadow-blue-500/20">
                                          <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                                          IN PROG
                                       </span>
                                     )}
                                     {patient.status === 'NEXT' && (
                                       <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20">
                                          NEXT
                                       </span>
                                     )}
                                     {patient.status === 'FOC' && (
                                       <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-200">
                                          FOC
                                       </span>
                                     )}
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.type}</span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button className="p-2 text-slate-200 group-hover:text-slate-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
                       <Info className="w-3 h-3" />
                       Click patient name to stop blinking after consultation start.
                    </p>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: PATIENT SUMMARY PANEL */}
           <div className="xl:col-span-4 space-y-8 sticky top-28">
              
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                 <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Patient Summary</h3>
                 </div>

                 {/* 🔷 SPECIAL NOTE SECTION */}
                 <div className="p-6 bg-amber-50/50 border-b border-amber-100">
                    <div className="flex items-center gap-2 mb-4 text-amber-600">
                       <AlertCircle className="w-4 h-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Special Note</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                          <p className="text-[11px] font-black text-slate-800 uppercase leading-relaxed tracking-wider">
                             Drug (S) Levocip – NOT TAKEN (01/04)
                          </p>
                       </div>
                       <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                          <p className="text-[11px] font-black text-slate-800 uppercase leading-relaxed tracking-wider">
                             F/U Missed – 08/04 (Call no answer)
                          </p>
                       </div>
                    </div>
                    <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest mt-3 italic">
                       * Always visible at top. Never dismissible.
                    </p>
                 </div>

                 {/* PATIENT BASIC INFO */}
                 <div className="p-8 space-y-6">
                    <div>
                       <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">RAMESHBHAI MANUBHAI PATEL</h2>
                       <div className="flex flex-wrap gap-3 mt-4">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">MRD: P03-260001</span>
                          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">35M</span>
                          <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">Blood: B+</span>
                       </div>
                    </div>

                    {/* 🔷 SECTION 4: VITALS HISTORY */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <Activity className="w-3.5 h-3.5" /> Vitals History
                          </h4>
                          <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Trends</button>
                       </div>
                       <div className="overflow-hidden rounded-2xl border border-slate-50 shadow-inner bg-slate-50/30">
                          <table className="w-full text-left text-[10px]">
                             <thead>
                                <tr className="bg-slate-100/50">
                                   <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                                   <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">BP</th>
                                   <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">BMI</th>
                                   <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Wt</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {vitalsHistory.map((vital, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                     <td className="px-4 py-3 font-black text-slate-400 tracking-tighter">{vital.date}</td>
                                     <td className="px-4 py-3 font-black text-slate-800">{vital.bp}</td>
                                     <td className="px-4 py-3 font-black text-blue-600">{vital.bmi}</td>
                                     <td className="px-4 py-3 font-black text-slate-600">{vital.wt}</td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    {/* 🔷 SECTION 5: BILLING SUMMARY */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" /> Billing Summary
                       </h4>
                       <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Today', value: '₹500', color: 'text-blue-600' },
                            { label: 'Monthly', value: '₹3,200', color: 'text-indigo-600' },
                            { label: 'Total', value: '₹18,500', color: 'text-slate-800' },
                            { label: 'FOC/Disc', value: '₹200', color: 'text-rose-500' },
                          ].map((bill, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-20 group hover:border-blue-200 transition-all">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{bill.label}</p>
                               <p className={`text-sm font-black ${bill.color}`}>{bill.value}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 bg-blue-600">
                    <button className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20">
                       Open Patient Case File
                    </button>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboardView;
