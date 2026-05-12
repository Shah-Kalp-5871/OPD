'use client';

import React, { useState } from 'react';
import NursingLayout from '@/views/layouts/NursingLayout';
import { 
  PhoneCall, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Smartphone, 
  User, 
  ArrowRight,
  MoreHorizontal,
  ChevronRight,
  ClipboardList,
  Info
} from 'lucide-react';

const NursingFollowupView = () => {
  const [selectedOutcome, setSelectedOutcome] = useState('Rescheduled');
  const [selectedPatient, setSelectedPatient] = useState('Rameshbhai Patel');

  const followUpQueue = [
    { priority: 1, patient: 'Rameshbhai Patel', mrd: 'P03-260001', type: 'Consultation', date: '01/04/2026', status: 'Pending', newAppt: '-' },
    { priority: 2, patient: 'Sneha Shah', mrd: 'P03-260002', type: 'Follow-Up', date: '20/04/2026', status: 'Rescheduled', newAppt: '20/04/2026' },
    { priority: 3, patient: 'Mahesh Kumar', mrd: 'P03-260003', type: 'Procedure', date: '-', status: 'Called – No Answer', newAppt: '-' },
    { priority: 4, patient: 'Kishore Joshi', mrd: 'P03-260010', type: 'Consultation', date: '08/04/2026', status: 'Do Not Call', newAppt: '-' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Called – No Answer': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Rescheduled': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Do Not Call': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const outcomeOptions = [
    { id: 'Rescheduled', label: 'Called & Appointment Rescheduled', icon: CheckCircle2 },
    { id: 'NoAnswer', label: 'Called — No Answer (F/U Missed)', icon: AlertCircle },
    { id: 'DoNotCall', label: 'Do Not Call (Patient Request)', icon: XCircle },
    { id: 'UnableReach', label: 'Unable to Reach', icon: Info },
  ];

  return (
    <NursingLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        
        {/* 🔷 PAGE HEADER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                 <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Follow-Up Call Management</h1>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1.5 ml-1">Forwarded by Doctor Coordination Team</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Calls</p>
                 <p className="text-xl font-black text-slate-800">12 Patients</p>
              </div>
           </div>
        </div>

        {/* 🔷 FOLLOW-UP TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pr.</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MRD</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">F/U Type</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sched Date</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">New Appt</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {followUpQueue.map((row, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedPatient(row.patient)}
                        className={`group cursor-pointer transition-all ${selectedPatient === row.patient ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
                      >
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-slate-400">{row.priority}</span>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${selectedPatient === row.patient ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                  {row.patient[0]}
                               </div>
                               <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.patient}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 tracking-wider uppercase">{row.mrd}</td>
                         <td className="px-6 py-6">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{row.type}</span>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-600">{row.date}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <span className="text-[11px] font-black text-slate-800">{row.newAppt}</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-6 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    “No Answer” outcome auto-creates Special Note: <span className="text-slate-800">08/04/F/U Missed</span> in patient record.
                 </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    After rescheduling: system will <span className="text-slate-800">auto-create appointment</span> + auto-send confirmation.
                 </p>
              </div>
           </div>
        </div>

        {/* 🔷 CALL OUTCOME LOGGING SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Log Call Outcome</h2>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Selected Patient: {selectedPatient}</p>
                 </div>
              </div>
           </div>

           <div className="p-10 space-y-10">
              {/* Call Outcome Options */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Call Outcome:</label>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {outcomeOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setSelectedOutcome(opt.id)}
                        className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4 shadow-sm ${
                          selectedOutcome === opt.id 
                          ? 'border-blue-600 bg-blue-50 shadow-blue-100' 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                         <opt.icon className={`w-6 h-6 ${selectedOutcome === opt.id ? 'text-blue-600' : 'text-slate-400'}`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest leading-tight ${selectedOutcome === opt.id ? 'text-blue-900' : 'text-slate-500'}`}>
                            {opt.label}
                         </span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New F/U Date</label>
                          <div className="relative">
                             <Calendar className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                             <input type="date" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New F/U Time</label>
                          <div className="relative">
                             <Clock className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                             <input type="time" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Feedback / Notes</label>
                       <textarea 
                         placeholder="Mention patient's health status or reason for rescheduling..."
                         className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner h-32 resize-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drug Taken? (Y/N/P)</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                             <option value="Yes">Yes</option>
                             <option value="No">No</option>
                             <option value="Partial">Partial</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Advice Followed? (Y/N)</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                             <option value="Yes">Yes</option>
                             <option value="No">No</option>
                          </select>
                       </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-[2rem] p-8 space-y-6 shadow-xl shadow-slate-200">
                       <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Automation Summary</h3>
                       </div>
                       <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             Create New Appointment
                          </li>
                          <li className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             Send Confirmation SMS
                          </li>
                          <li className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             Update Doctor Dashboard
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-100">
                 <button className="w-full md:w-auto px-12 py-5 bg-white border border-slate-200 text-slate-800 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    SEND SMS/WHATSAPP CONFIRMATION
                 </button>
                 <button className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-4 h-4" />
                    SAVE CALL LOG
                 </button>
              </div>
           </div>
        </div>

      </div>
    </NursingLayout>
  );
};

export default NursingFollowupView;
