'use client';

import React from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  UserPlus, 
  CalendarPlus, 
  Search, 
  Wallet, 
  BellRing, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Ban, 
  Activity,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

const ReceptionDashboardView = () => {
  const stats = [
    { label: "Today's Appts", value: 34, color: 'text-teal-600', bg: 'bg-teal-50', icon: CalendarPlus },
    { label: 'Checked In', value: 18, color: 'text-blue-600', bg: 'bg-blue-50', icon: UserCheck },
    { label: 'Waiting', value: 8, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    { label: 'Completed', value: 6, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
    { label: 'Cancelled', value: 2, color: 'text-rose-600', bg: 'bg-rose-50', icon: Ban },
  ];

  const queueData = [
    { id: 'C001-001', appt: '09:00', checkin: '09:05', name: 'Rameshbhai M. Patel', visit: 'Consultation', age: 35, payment: 'PAID', status: 'Completed', isNew: false },
    { id: 'C002-001', appt: '09:10', checkin: '09:12', name: 'Sneha R. Shah', visit: 'Follow-Up', age: 28, payment: 'PAID', status: 'In Progress', isNew: true },
    { id: 'C003-001', appt: '09:20', checkin: '—', name: 'Mahesh K. Kumar', visit: 'Consultation', age: 45, payment: 'PENDING', status: 'Waiting', isNew: false },
    { id: 'C004-001', appt: '09:30', checkin: '—', name: 'Priya N. Desai', visit: 'Procedure', age: 22, payment: 'FOC', status: 'Waiting', isNew: false },
    { id: 'C005-001', appt: '09:40', checkin: '—', name: 'Kishore P. Joshi', visit: 'Inquiry', age: 60, payment: 'CANCELLED', status: 'Cancelled', isNew: false },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-10 pb-20">
        
        {/* 🔷 TOP SECTION: QUICK ACTIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <button className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                   <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-teal-400">Add Entry</p>
                   <p className="text-sm font-black uppercase tracking-tighter">New Patient</p>
                </div>
             </button>
             <button className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <CalendarPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Scheduling</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Book Appointment</p>
                </div>
             </button>
             <button className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Database</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Search Patient</p>
                </div>
             </button>
             <button className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Wallet className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Financials</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Today's Billing</p>
                </div>
             </button>
          </div>
        </div>

        {/* 🔷 NOTIFICATION PANEL (LEFT ALERT BOX) */}
        <div className="bg-teal-600 rounded-2xl p-6 shadow-xl shadow-teal-100 flex items-center justify-between border-2 border-teal-500 overflow-hidden relative group">
           <div className="absolute right-0 top-0 h-full w-32 bg-white/5 skew-x-[30deg] translate-x-16"></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                 <BellRing className="w-6 h-6 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-teal-100 uppercase tracking-widest leading-none">Notification: Dr. Valaki</span>
                    <span className="w-1 h-1 rounded-full bg-teal-300"></span>
                    <span className="text-[10px] font-black text-teal-200 uppercase tracking-widest leading-none">Clinical Signal</span>
                 </div>
                 <h3 className="text-lg font-black text-white mt-1 uppercase tracking-tight">
                   Next Patient: <span className="text-teal-200 underline decoration-teal-300 underline-offset-4">Mahesh K. Kumar (C003-001)</span>
                 </h3>
              </div>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="px-6 py-2 bg-white text-teal-700 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                 Payment Status: <span className="text-emerald-600">PAID</span>
              </div>
              <button className="p-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-colors">
                 <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* 🔷 STATS CARDS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
           {stats.map((item, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-teal-200 transition-all">
                <div className={`p-3 ${item.bg} ${item.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                   <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{item.value}</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{item.label}</p>
             </div>
           ))}
        </div>

        {/* 🔷 OPD QUEUE TABLE (MAIN SECTION) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-teal-100 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-600 rounded-lg text-white">
                   <Activity className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Today's OPD Queue</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">[ Default Control View ]</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                   <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Updates Enabled</span>
                </div>
                <button className="p-2.5 hover:bg-white rounded-xl text-slate-400 border border-transparent hover:border-slate-200 transition-all">
                   <MoreVertical className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-5">Case ID</th>
                  <th className="px-6 py-5">Appt Time</th>
                  <th className="px-6 py-5">Check-In</th>
                  <th className="px-6 py-5">Patient Name</th>
                  <th className="px-6 py-5">Visit For</th>
                  <th className="px-6 py-5">Age</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {queueData.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/50 transition-colors group/row ${row.status === 'In Progress' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-slate-900">{row.id}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{row.appt}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-bold text-slate-400 uppercase">{row.checkin}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <span className={`text-xs font-black tracking-tight ${row.isNew ? 'text-teal-700 bg-teal-50 px-3 py-1 rounded-lg w-fit border border-teal-100' : 'text-slate-800'}`}>
                             {row.name}
                          </span>
                          {row.isNew && <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest mt-1">New Patient Entry</span>}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-xs font-bold text-slate-600">{row.visit}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-slate-400">{row.age}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(row.status)}`}>
                          {row.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       {row.payment === 'FOC' ? (
                         <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-200">
                            FOC
                         </span>
                       ) : (
                         <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                           row.payment === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                           row.payment === 'PENDING' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                           'bg-slate-100 text-slate-400 border-slate-200'
                         }`}>
                           {row.payment}
                         </span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ReceptionLayout>
  );
};

export default ReceptionDashboardView;
