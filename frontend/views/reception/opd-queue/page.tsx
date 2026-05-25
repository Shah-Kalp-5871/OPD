'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';

import Link from 'next/link';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  MoreVertical, 
  Stethoscope,
  Search,
  AlertCircle,
  BellRing,
  PhoneCall,
  UserX,
  UserCheck,
  ChevronRight,
  FileSignature,
  Upload
} from 'lucide-react';

const OpdQueueView = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, checkedIn: 0, waiting: 0, completed: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'live' | 'appointments'>('live');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isApptLoading, setIsApptLoading] = useState(false);

  const { entries: sseEntries, stats: sseStats, lastEvent } = useQueueSSE({
    doctorId: selectedDoctor === 'all' ? undefined : selectedDoctor
  });

  useEffect(() => {
    if (sseEntries.length > 0) {
      setQueue(sseEntries);
    }
  }, [sseEntries]);

  useEffect(() => {
    if (sseStats) {
      setStats(sseStats);
    }
  }, [sseStats]);

  useEffect(() => {
    fetchQueue();
    fetchStats();
    fetchDoctors();
    if (viewMode === 'appointments') {
      fetchAppointments();
    }
  }, [selectedDoctor, viewMode]);

  const fetchAppointments = async () => {
    setIsApptLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = selectedDoctor === 'all' 
        ? `/appointments?date=${today}` 
        : `/appointments?date=${today}&doctorId=${selectedDoctor}`;
      const response = await api.get(url);
      // Backend returns { data: [...], meta: { total, page, ... } }
      const list: any[] = response.data?.data ?? response.data ?? [];
      // Only show scheduled ones (not yet arrived)
      setAppointments(list.filter((a: any) => a.status === 'SCHEDULED'));
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setIsApptLoading(false);
    }
  };


  const fetchQueue = async () => {
    try {
      const url = selectedDoctor === 'all' ? '/queue/live' : `/queue/live?doctorId=${selectedDoctor}`;
      const response = await api.get(url);
      setQueue(response.data);
    } catch (error) {
      toast.error('Failed to refresh queue');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/queue/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, actionLabel: string) => {
    setIsActionLoading(id);
    try {
      await api.patch(`/queue/${id}/status`, { 
        status, 
        action: actionLabel 
      });
      toast.success(`Patient marked as ${status.replace('_', ' ')}`);
      fetchQueue();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_SESSION': 
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 animate-pulse">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-wider">In Doctor Room</span>
          </div>
        );
      case 'CALLING': 
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <BellRing className="w-3 h-3 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-wider">Calling Now</span>
          </div>
        );
      case 'NO_RESPONSE': 
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
            <UserX className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-wider">No Response</span>
          </div>
        );
      case 'COMPLETED': 
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 opacity-60">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-wider">Consulted</span>
          </div>
        );
      default: 
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-200">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-wider">Waiting</span>
          </div>
        );
    }
  };

  const getBillStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-200">PAID</span>;
      case 'PARTIAL':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase tracking-widest border border-amber-200">PARTIAL</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase tracking-widest border border-rose-200">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest border border-slate-200">UNBILLED</span>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'URGENT': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const filteredQueue = queue.filter(entry => 
    entry.tokenDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${entry.patient.firstName} ${entry.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.patient.mrdNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ReceptionLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                    <Activity className="w-6 h-6 text-white animate-pulse" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">OPD Control Board</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Patient Flow Synchronizer</p>
                 </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap gap-2 pt-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-200 rounded-xl transition-all group">
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider">New Patient</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl transition-all group">
                    <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Book Appointment</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 hover:border-amber-200 rounded-xl transition-all group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider ml-6">Quick Search</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl transition-all group">
                    <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Billing View</span>
                 </button>
              </div>
           </div>

           <div className="flex flex-wrap gap-4 self-stretch">
              <div className="bg-slate-50 rounded-3xl p-5 flex flex-col min-w-[140px] border border-slate-100 justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Visit</span>
                 <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-slate-900 leading-none">{stats.total}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Today</span>
                 </div>
              </div>
              <div className="bg-teal-50 border border-teal-100 rounded-3xl p-5 flex flex-col min-w-[140px] justify-between">
                 <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">In Session</span>
                 <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-teal-700 leading-none">{stats.checkedIn - stats.waiting}</span>
                    <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                 </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex flex-col min-w-[140px] justify-between">
                 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Waiting</span>
                 <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-amber-700 leading-none">{stats.waiting}</span>
                    <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                 </div>
              </div>
           </div>
        </div>

        {/* Filters & Control Strip */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3 pr-6 border-r border-slate-200 min-w-[250px]">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <Stethoscope className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Doctor Station</span>
                    <select 
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="text-[11px] font-black text-slate-800 outline-none bg-transparent cursor-pointer hover:text-teal-600 transition-colors uppercase"
                    >
                       <option value="all">ALL ACTIVE DOCTORS</option>
                       {doctors.map(doc => (
                         <option key={doc.id} value={doc.id}>DR. {doc.name.toUpperCase()}</option>
                       ))}
                    </select>
                 </div>
              </div>
              
              <div className="flex-1 max-w-xl relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="SEARCH BY TOKEN, NAME OR MRD NUMBER..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-black outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all uppercase tracking-[0.1em]"
                 />
              </div>
           </div>

            <div className="flex gap-2">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mr-4">
                 <button 
                   onClick={() => setViewMode('live')}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'live' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Live Queue
                 </button>
                 <button 
                   onClick={() => setViewMode('appointments')}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'appointments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Today's Schedule
                 </button>
              </div>
              <button 
                onClick={viewMode === 'live' ? fetchQueue : fetchAppointments}
                className="bg-slate-900 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-slate-200 active:scale-95"
              >
                <Activity className="w-4 h-4" />
                Refresh Board
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px] relative">
           {(isLoading || (viewMode === 'appointments' && isApptLoading)) ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
                   <Activity className="w-6 h-6 text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Synchronizing Board</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Updating data...</p>
                </div>
             </div>
           ) : viewMode === 'live' ? (
             filteredQueue.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-60 space-y-6 opacity-40">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                     <Users className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">The queue is currently empty</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Token ID</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Info</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Billing Status</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredQueue.map((entry) => (
                          <tr key={entry.id} className={`group transition-all duration-300 ${entry.status === 'IN_SESSION' ? 'bg-teal-50/20' : 'hover:bg-slate-50/50'}`}>
                             <td className="px-8 py-7">
                                <div className="inline-flex flex-col items-center min-w-[90px] h-[90px] justify-center bg-white border-2 border-slate-900 rounded-2xl shadow-sm group-hover:scale-105 group-hover:border-teal-600 transition-all overflow-hidden relative">
                                   <div className="absolute top-0 inset-x-0 h-1 bg-slate-900 group-hover:bg-teal-600 transition-colors"></div>
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">TOKEN</span>
                                   <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                                      {entry.tokenDisplay.split('-')[1]}
                                   </span>
                                   <div className="mt-1 px-2 py-0.5 bg-slate-900 text-white rounded-[4px]">
                                      <span className="text-[7px] font-black uppercase tracking-widest">{entry.tokenDisplay.split('-')[0]}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[14px] font-black text-slate-900 uppercase tracking-tight group-hover:text-teal-600 transition-colors">{entry.patient.firstName} {entry.patient.lastName}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">
                                         <Activity className="w-2.5 h-2.5" />
                                         {entry.patient.mrdNumber}
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                <div className="flex flex-col gap-2">
                                   <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest flex items-center gap-1.5 ${getPriorityColor(entry.priority)}`}>
                                      {entry.priority}
                                   </span>
                                   <div className="flex items-center gap-2 text-slate-400">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-black uppercase tracking-tight">Wait: {Math.floor((new Date().getTime() - new Date(entry.checkInTime).getTime()) / 60000)} MINS</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                {getBillStatusBadge(entry.case.bill?.paymentStatus)}
                             </td>
                             <td className="px-8 py-7">
                                {getStatusBadge(entry.status)}
                             </td>
                             <td className="px-8 py-7 text-right">
                                                                 <div className="flex items-center justify-end gap-3">
                                    <Link 
                                      href={`/reception/consent?caseId=${entry.caseId}`}
                                      className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-teal-600 rounded-xl transition-all"
                                      title="Consent Form"
                                    >
                                       <FileSignature className="w-4 h-4" />
                                    </Link>
                                    <Link 
                                      href={`/reception/lab-upload?caseId=${entry.caseId}`}
                                      className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                                      title="Lab Upload"
                                    >
                                       <Upload className="w-4 h-4" />
                                    </Link>

                                   {entry.status === 'WAITING' && (
                                     <button 
                                       onClick={() => handleUpdateStatus(entry.id, 'CALLING', 'CALL_PATIENT')}
                                       disabled={isActionLoading === entry.id}
                                       className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-blue-100 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                     >
                                        <PhoneCall className="w-3.5 h-3.5" />
                                        Call Patient
                                     </button>
                                   )}
                                   <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90">
                                      <MoreVertical className="w-5 h-5" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             )
           ) : (
             appointments.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-60 space-y-6 opacity-40">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                     <Clock className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">No appointments scheduled for today</p>
               </div>
             ) : (
               <div className="overflow-x-auto animate-in fade-in slide-in-from-right-4 duration-500">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scheduled Time</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor / Clinic</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                             <td className="px-8 py-7">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-200 transition-all">
                                      <Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                   </div>
                                   <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                      {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{appt.patient?.firstName} {appt.patient?.lastName}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{appt.patient?.mrdNumber}</span>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">DR. {appt.doctor?.user?.name.toUpperCase()}</span>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase">{appt.doctor?.department?.name || 'GENERAL OPD'}</span>
                                </div>
                             </td>
                             <td className="px-8 py-7">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                   {appt.purpose || 'GENERAL VISIT'}
                                </span>
                             </td>
                             <td className="px-8 py-7 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => toast.error('Please check-in the patient first to generate a Consent Form.')}
                                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-teal-600 rounded-xl transition-all"
                                    title="Check-in required for Consent Form"
                                  >
                                     <FileSignature className="w-4 h-4" />
                                  </button>
                                  <Link 
                                    href={`/reception/checkin?mrd=${appt.patient?.mrdNumber}&appt=${appt.id}`}
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
                                  >
                                     Arrived
                                     <ChevronRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             )
           )}
        </div>

        {/* Operational Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-8 border-t border-slate-200">
           <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-rose-500 rounded-full shadow-lg shadow-rose-200 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Emergency Alert</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-200"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Urgent Protocol</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-teal-500 rounded-full shadow-lg shadow-teal-200"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Session</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
                 <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">System Health: Optimal</span>
              </div>
              <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200">
                 <BellRing className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Real-time Sync Active</span>
              </div>
           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default OpdQueueView;
