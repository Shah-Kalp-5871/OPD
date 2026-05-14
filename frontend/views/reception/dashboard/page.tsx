'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import Link from 'next/link';
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
import api from '@/lib/api';
import { format } from 'date-fns';

const ReceptionDashboardView = () => {
  const [statsData, setStatsData] = useState({
    total: 0,
    checkedIn: 0,
    waiting: 0,
    completed: 0,
    cancelled: 0
  });
  const [queueData, setQueueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/queue/stats');
        setStatsData(statsRes.data);
        
        const queueRes = await api.get('/queue/live');
        setQueueData(queueRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Today's Entry", value: statsData.total, color: 'text-teal-600', bg: 'bg-teal-50', icon: CalendarPlus },
    { label: 'Checked In', value: statsData.checkedIn, color: 'text-blue-600', bg: 'bg-blue-50', icon: UserCheck },
    { label: 'Waiting', value: statsData.waiting, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    { label: 'Completed', value: statsData.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
    { label: 'Cancelled', value: statsData.cancelled, color: 'text-rose-600', bg: 'bg-rose-50', icon: Ban },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'IN_SESSION': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'CALLING': return 'bg-teal-50 text-teal-600 border-teal-100 animate-bounce';
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
             <Link href="/reception/patients/register" className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                   <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-teal-400">Add Entry</p>
                   <p className="text-sm font-black uppercase tracking-tighter">New Patient</p>
                </div>
             </Link>
             <Link href="/reception/appointments" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <CalendarPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Scheduling</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Book Appointment</p>
                </div>
             </Link>
             <Link href="/reception/patients/search" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Database</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Search Patient</p>
                </div>
             </Link>
             <Link href="/reception/billing" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Wallet className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Financials</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Today's Billing</p>
                </div>
             </Link>
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
                   System Ready: <span className="text-teal-200 underline decoration-teal-300 underline-offset-4">Waiting for next patient...</span>
                 </h3>
              </div>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="px-6 py-2 bg-white text-teal-700 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                 Queue Active: <span className="text-emerald-600">{statsData.waiting} Patients</span>
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
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">[ Real-time Control View ]</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                   <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Updates</span>
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
                  <th className="px-6 py-5">Token</th>
                  <th className="px-6 py-5">Check-In</th>
                  <th className="px-6 py-5">Patient Name</th>
                  <th className="px-6 py-5">MRD No.</th>
                  <th className="px-6 py-5">Visit For</th>
                  <th className="px-6 py-5">Gender</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {queueData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-8 h-8 text-slate-200" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No patients in queue today</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  queueData.map((row, idx) => (
                    <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors group/row ${row.status === 'IN_SESSION' ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-5">
                         <span className="text-xs font-black text-slate-900">{row.tokenDisplay}</span>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{format(new Date(row.checkInTime), 'hh:mm a')}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col">
                            <span className={`text-xs font-black tracking-tight text-slate-800`}>
                               {row.patient.firstName} {row.patient.lastName}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className="text-xs font-bold text-teal-600 tracking-widest uppercase">{row.patient.mrdNumber}</span>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-xs font-bold text-slate-600">{row.case.visitType}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className="text-xs font-black text-slate-400">{row.patient.gender}</span>
                      </td>
                      <td className="px-6 py-5">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(row.status)}`}>
                            {row.status.replace('_', ' ')}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link 
                          href={`/reception/patients/${row.patientId}`}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-teal-300 hover:text-teal-600 transition-all inline-flex items-center gap-2"
                        >
                          View File
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ReceptionLayout>
  );
};

export default ReceptionDashboardView;
