'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import { 
  Phone, 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Send, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Stethoscope,
  Activity,
  Plus
} from 'lucide-react';

const FollowUpCallListView = () => {
  const [activeTab, setActiveTab] = useState('Today\'s F/U');
  const [currentMonth, setCurrentMonth] = useState('APRIL 2026');

  const filterTabs = [
    "Today's F/U",
    "Missed F/U",
    "Pending Procedures",
    "All F/U"
  ];

  const followUpData = [
    {
      id: 1,
      priority: 'High',
      patient: 'Rameshbhai Patel',
      mrd: 'P03-260001',
      lastFu: '01/04/2026',
      fuType: 'Consultation',
      lastDrug: 'Not Taken: Dolo',
      note: 'Check SGPT result',
      status: 'Critical'
    },
    {
      id: 2,
      priority: 'Medium',
      patient: 'Sneha Shah',
      mrd: 'P03-260002',
      lastFu: '08/04/2026',
      fuType: 'Follow-Up',
      lastDrug: 'Taken all',
      note: '-',
      status: 'Stable'
    },
    {
      id: 3,
      priority: 'High',
      patient: 'Mahesh Kumar',
      mrd: 'P03-260003',
      lastFu: '13/04/2026',
      fuType: 'Procedure',
      lastDrug: 'Not Taken: Zylivo',
      note: '-',
      status: 'Pending'
    },
    {
      id: 4,
      priority: 'Low',
      patient: 'Priya Desai',
      mrd: 'P03-260004',
      lastFu: '05/04/2026',
      fuType: 'Missed F/U',
      lastDrug: '-',
      note: 'Procedure due',
      status: 'Warning'
    },
    {
      id: 5,
      priority: 'High',
      patient: 'Kishore Joshi',
      mrd: 'P03-260010',
      lastFu: '01/03/2026',
      fuType: 'Consultation',
      lastDrug: '3 missed F/Us',
      note: 'Call not answered',
      status: 'Error'
    }
  ];

  const calendarLegend = [
    { label: 'C', desc: 'Consultation', color: 'bg-blue-500' },
    { label: 'P', desc: 'Procedure', color: 'bg-purple-500' },
    { label: 'FU', desc: 'Follow-Up', color: 'bg-emerald-500' },
    { label: 'NW', desc: 'New Case', color: 'bg-amber-500' },
    { label: 'INQ', desc: 'Inquiry', color: 'bg-slate-500' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-32">
        
        {/* 🔷 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400">
                    <Phone className="w-6 h-6" />
                 </div>
                 Follow-Up Call List – Generate & Forward to Nursing
              </h1>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 ml-1">
                 Doctor-to-Nursing Coordination Workflow Dashboard
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="relative group">
                 <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search Patient / MRD..."
                   className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-600 focus:bg-white transition-all w-64 shadow-inner"
                 />
              </div>
              <button className="p-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl hover:bg-white hover:text-blue-600 transition-all shadow-inner group">
                 <Filter className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
           </div>
        </div>

        {/* 🔷 TOP: TABLE SECTION */}
        <div className="space-y-6">
           <div className="flex overflow-x-auto scrollbar-hide gap-2 p-1 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm w-fit">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last F/U</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Status</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dr. Note</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {followUpData.map((row) => (
                         <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${getPriorityColor(row.priority)}`}>
                                  {row.priority}
                               </span>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.patient}</span>
                                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{row.mrd}</span>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-2">
                                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                  <span className="text-[11px] font-black text-slate-600">{row.lastFu}</span>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{row.fuType}</span>
                            </td>
                            <td className="px-6 py-6">
                               <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 w-fit ${
                                 row.lastDrug.includes('Not Taken') || row.lastDrug.includes('missed')
                                 ? 'bg-rose-50 border-rose-100 text-rose-600'
                                 : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                               }`}>
                                  {row.lastDrug.includes('Not Taken') ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                  <span className="text-[10px] font-black uppercase tracking-widest">{row.lastDrug}</span>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <p className={`text-[11px] font-bold leading-relaxed max-w-[150px] ${row.note.includes('answered') ? 'text-rose-500 font-black italic' : 'text-slate-500'}`}>
                                  {row.note}
                               </p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-blue-400 hover:border-slate-900 transition-all shadow-sm group/btn">
                                  <MoreHorizontal className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* 🔷 ACTION BUTTONS */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button className="flex items-center justify-center gap-4 py-6 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                 <Send className="w-5 h-5 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 FORWARD TO NURSING
              </button>
              <button className="flex items-center justify-center gap-4 py-6 bg-white border border-slate-200 text-slate-800 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                 <FileText className="w-5 h-5 text-emerald-500" />
                 GENERATE MORNING REPORT
              </button>
              <button className="flex items-center justify-center gap-4 py-6 bg-white border border-slate-200 text-slate-800 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                 <Download className="w-5 h-5 text-blue-500" />
                 EXPORT LIST
              </button>
           </div>
        </div>

        {/* 🔷 BOTTOM: CALENDAR & LEGEND SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-6 border-t border-slate-100">
           
           {/* Smart Calendar (Takes more space) */}
           <div className="xl:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{currentMonth}</h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Smart Calendar – All Appointment Types</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-white hover:text-blue-600 transition-all shadow-inner">
                       <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-white hover:text-blue-600 transition-all shadow-inner">
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                         {day}
                      </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`aspect-video p-3 rounded-2xl border transition-all relative group cursor-pointer ${
                          i + 1 === 15 
                          ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md'
                        }`}
                      >
                         <span className={`text-[11px] font-black ${i + 1 === 15 ? 'text-white' : 'text-slate-700'}`}>
                            {i + 1}
                         </span>
                         {(i + 1 === 5 || i + 1 === 12 || i + 1 === 15 || i + 1 === 22) && (
                           <div className="absolute bottom-3 right-3">
                              <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                                i + 1 === 15 ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
                              }`}>
                                 {i + 1 === 15 ? '8 FU' : '3 C'}
                              </div>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Legend & Summary (Takes less space) */}
           <div className="xl:col-span-4 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 h-full flex flex-col">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Appointment Legend</h3>
                 <div className="grid grid-cols-1 gap-4 flex-1">
                    {calendarLegend.map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm`}>
                               {item.label}
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.desc}</span>
                         </div>
                         <div className="text-[10px] font-black text-slate-400">12 Patients</div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                       <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                          <Activity className="w-20 h-20" />
                       </div>
                       <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Calls Due</span>
                             <span className="text-xl font-black">24</span>
                          </div>
                          <button className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                             <Plus className="w-3 h-3" />
                             New Call
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </DoctorLayout>
  );
};

export default FollowUpCallListView;
