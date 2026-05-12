'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Calendar, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Activity, 
  MoreVertical, 
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Search,
  Wallet,
  AlertCircle,
  BellRing
} from 'lucide-react';

const OpdQueueView = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const queueData = [
    { 
      id: 'C001-001-130426', 
      appTime: '09:00', 
      checkIn: '09:05', 
      name: 'RAMESHBHAI M. PATEL', 
      type: 'Consultation', 
      ageSex: '35/M', 
      billing: 'PAID',
      isNew: false,
      status: 'Completed'
    },
    { 
      id: 'C002-001-130426', 
      appTime: '09:10', 
      checkIn: '09:12', 
      name: 'SNEHA R. SHAH', 
      type: 'Follow-Up', 
      ageSex: '28/F', 
      billing: 'PAID',
      isNew: false,
      status: 'Completed'
    },
    { 
      id: 'C003-001-130426', 
      appTime: '09:20', 
      checkIn: '09:22', 
      name: 'MAHESH K. KUMAR', 
      type: 'Consultation', 
      ageSex: '22/M', 
      billing: 'PENDING',
      isNew: true,
      status: 'In Progress'
    },
    { 
      id: 'C004-001-130426', 
      appTime: '09:30', 
      checkIn: '09:35', 
      name: 'PRIYA N. DESAI', 
      type: 'Procedure', 
      ageSex: '40/F', 
      billing: 'FOC',
      isNew: false,
      status: 'Waiting'
    },
    { 
      id: 'C005-001-130426', 
      appTime: '09:40', 
      checkIn: null, 
      name: 'KISHORE P. JOSHI', 
      type: 'Inquiry', 
      ageSex: '60/M', 
      billing: '--',
      isNew: false,
      status: 'Waiting'
    },
    { 
      id: 'C006-001-130426', 
      appTime: '09:50', 
      checkIn: '09:55', 
      name: 'RITU V. MEHTA', 
      type: 'Consultation', 
      ageSex: '32/F', 
      billing: 'PENDING',
      isNew: true,
      status: 'In Progress'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'In Progress': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse"><Activity className="w-3 h-3" /> In Progress</span>;
      case 'Cancelled': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><Timer className="w-3 h-3" /> Waiting</span>;
    }
  };

  const getBillingBadge = (billing: string) => {
    switch (billing) {
      case 'PAID': return <span className="px-2.5 py-1 bg-emerald-500 text-white rounded text-[9px] font-black uppercase tracking-widest">PAID</span>;
      case 'PENDING': return <span className="px-2.5 py-1 bg-rose-500 text-white rounded text-[9px] font-black uppercase tracking-widest">PENDING</span>;
      case 'FOC': return <span className="px-2.5 py-1 bg-blue-600 text-white rounded text-[9px] font-black uppercase tracking-widest">FOC</span>;
      default: return <span className="text-slate-300 font-bold">--</span>;
    }
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header & Doctor Signal Panel */}
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">OPD Queue Management</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                 <Users className="w-3.5 h-3.5 text-teal-500" />
                 Live OPD Tracking Console
              </p>
           </div>
           
           {/* 🔷 DOCTOR SIGNAL PANEL */}
           <div className="lg:w-96 bg-slate-900 rounded-3xl p-6 border-l-4 border-amber-500 shadow-xl flex items-center gap-6 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                 <BellRing className="w-20 h-20 text-white" />
              </div>
              <div className="relative z-10 w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center animate-bounce">
                 <Stethoscope className="w-6 h-6 text-slate-900" />
              </div>
              <div className="relative z-10">
                 <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Doctor Signal: Next Patient</p>
                 <h4 className="text-white font-black text-lg leading-none">MAHESH KUMAR</h4>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Case: C003-001-130426</p>
              </div>
           </div>
        </div>

        {/* 🔷 TOP FILTER SECTION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-6">
           <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
              <Calendar className="w-4 h-4 text-teal-600" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                 <span className="text-xs font-black text-slate-800">13 April, 2026</span>
              </div>
           </div>

           <div className="flex flex-1 items-center gap-4 flex-wrap">
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Purpose Filter</label>
                 <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-teal-600">
                    <option>All Purposes</option>
                    <option>Consultation</option>
                    <option>Follow-Up</option>
                    <option>Procedure</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status Filter</label>
                 <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-teal-600">
                    <option>All Statuses</option>
                    <option>Waiting</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Age Range Filter</label>
                 <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-teal-600">
                    <option>All Ages</option>
                    <option>0-12 (Child)</option>
                    <option>13-60 (Adult)</option>
                    <option>60+ (Senior)</option>
                 </select>
              </div>
           </div>
           
           <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-all">
              <Search className="w-5 h-5" />
           </button>
        </div>

        {/* 🔷 STATUS LEGEND SECTION */}
        <div className="flex flex-wrap items-center gap-4 py-2">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Legend:
           </div>
           {['Waiting', 'In Progress', 'Completed', 'Cancelled', 'New Patient', 'FOC'].map((l) => (
             <div key={l} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                <div className={`w-2 h-2 rounded-full ${
                  l === 'Waiting' ? 'bg-amber-400' :
                  l === 'In Progress' ? 'bg-blue-500 animate-pulse' :
                  l === 'Completed' ? 'bg-emerald-500' :
                  l === 'Cancelled' ? 'bg-rose-500' :
                  l === 'New Patient' ? 'bg-teal-600' :
                  'bg-blue-800'
                }`}></div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{l}</span>
             </div>
           ))}
        </div>

        {/* 🔷 MAIN OPD QUEUE TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Case ID</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Appt. Time</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Check-In</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Name</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visit Type</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Age/Sex</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Billing</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {queueData.map((patient, idx) => (
                      <tr key={patient.id} className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${patient.status === 'In Progress' ? 'bg-blue-50/30' : ''}`}>
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-slate-500 tracking-wider">{patient.id}</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className="text-xs font-black text-slate-800">{patient.appTime}</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className={`text-xs font-bold ${patient.checkIn ? 'text-teal-600' : 'text-slate-300'}`}>
                               {patient.checkIn || '--:--'}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex flex-col">
                               <div className="flex items-center gap-2">
                                  <span className={`text-sm font-black uppercase tracking-tight ${patient.isNew ? 'text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100' : 'text-slate-800'}`}>
                                     {patient.name}
                                  </span>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${patient.isNew ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                     {patient.isNew ? 'NEW' : 'OLD'}
                                  </span>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-lg">
                               {patient.type}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{patient.ageSex}</span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className={`p-1 rounded-lg inline-block ${patient.billing === 'FOC' ? 'bg-blue-50 border border-blue-100 p-2' : ''}`}>
                               {getBillingBadge(patient.billing)}
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                               {getStatusBadge(patient.status)}
                               <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* 🔷 PAGINATION SECTION */}
           <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last page auto-opens upon check-in</span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Total: <span className="text-slate-800">34 appointments today</span>
                 </p>
              </div>
              
              <div className="flex items-center gap-4">
                 <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-teal-50 transition-all shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                 </button>
                 <div className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                    Page 1 of 2
                 </div>
                 <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-teal-50 transition-all shadow-sm">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </ReceptionLayout>
  );
};

export default OpdQueueView;
