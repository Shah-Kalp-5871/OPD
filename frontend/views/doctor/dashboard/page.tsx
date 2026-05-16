'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';
import { useClinicalSSE } from '@/hooks/useClinicalSSE';


import { 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Activity,
  User,
  Zap,
  MoreVertical,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

const DoctorDashboardView = () => {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { entries: sseEntries } = useQueueSSE();
  const { lastEvent: clinicalEvent } = useClinicalSSE();

  useEffect(() => {
    if (sseEntries.length > 0) {
      setQueue(sseEntries);
    }
  }, [sseEntries]);

  useEffect(() => {
    if (clinicalEvent?.type === 'VITALS_SAVED') {
      fetchMyQueue(); // Refresh queue when vitals are saved as it might change stage visibility
    }
  }, [clinicalEvent]);

  useEffect(() => {
    fetchMyQueue();
  }, []);



  const fetchMyQueue = async () => {
    try {
      // Backend automatically filters by current user (doctor) if we use /queue/live without doctorId,
      // but let's assume we want to be explicit or the backend handles it via JWT.
      const response = await api.get('/queue/live');
      setQueue(response.data);
    } catch (error) {
      console.error('Failed to fetch queue', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = async (caseId: string, patientId: string) => {
    setIsSubmitting(true);
    try {
      await api.post('/queue/session/start', { caseId });
      toast.success('Consultation started');
      // Redirect to the consultation page (assuming route structure)
      router.push(`/doctor/consultation/${caseId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSessionEntry = queue.find(q => q.status === 'IN_SESSION');
  const nextPatientEntry = queue.find(q => q.status === 'WAITING' || q.status === 'CALLING');

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY': return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[8px] font-black tracking-widest border border-rose-200 uppercase">Emergency</span>;
      case 'URGENT': return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black tracking-widest border border-amber-200 uppercase">Urgent</span>;
      default: return null;
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-6">
        
        {/* 🔷 SECTION 1: ACTIVE / NEXT PATIENT ALERT */}
        <div className="bg-slate-900 rounded-[2.5rem] p-2 pr-2 overflow-hidden shadow-2xl flex items-center justify-between border-4 border-slate-800">
           <div className="flex items-center gap-8 px-10 py-8">
              <div className={`w-14 h-14 ${activeSessionEntry ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'} rounded-2xl flex items-center justify-center shadow-lg animate-pulse`}>
                 {activeSessionEntry ? <Activity className="w-7 h-7 text-white" /> : <Zap className="w-7 h-7 text-white" />}
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black ${activeSessionEntry ? 'text-emerald-400' : 'text-blue-400'} uppercase tracking-[0.3em]`}>
                       {activeSessionEntry ? 'Currently In Session' : 'Next Patient Prepared'}
                    </span>
                    <span className={`w-2 h-2 ${activeSessionEntry ? 'bg-emerald-500' : 'bg-blue-500'} rounded-full animate-ping`}></span>
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight mt-2 flex items-center gap-4">
                    {activeSessionEntry ? (
                      <>
                        {activeSessionEntry.patient.firstName} {activeSessionEntry.patient.lastName}
                        <span className="text-slate-600">/</span>
                        <span className="text-emerald-500 text-lg uppercase tracking-widest">{activeSessionEntry.tokenDisplay}</span>
                      </>
                    ) : nextPatientEntry ? (
                      <>
                        {nextPatientEntry.patient.firstName} {nextPatientEntry.patient.lastName}
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-500 text-lg uppercase tracking-widest">{nextPatientEntry.tokenDisplay}</span>
                      </>
                    ) : (
                      'NO PATIENTS WAITING'
                    )}
                 </h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                    {activeSessionEntry ? `Case ID: ${activeSessionEntry.case.caseNumber}` : nextPatientEntry ? `Awaiting Room Entry | ${nextPatientEntry.case.visitType}` : 'Ready for next check-in'}
                 </p>
              </div>
           </div>

           {(activeSessionEntry || nextPatientEntry) && (
             <button 
               onClick={() => {
                 const target = activeSessionEntry || nextPatientEntry;
                 handleStartConsultation(target.caseId, target.patientId);
               }}
               disabled={isSubmitting}
               className={`${activeSessionEntry ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white hover:bg-blue-50'} text-slate-900 px-16 py-10 rounded-[2rem] flex items-center gap-4 transition-all group border-l border-slate-800 min-w-[280px] justify-center`}
             >
                <span className={`text-xs font-black uppercase tracking-[0.2em] ${activeSessionEntry ? 'text-white' : ''}`}>
                   {activeSessionEntry ? 'RESUME CHART' : 'START SESSION'}
                </span>
                <ArrowRight className={`w-6 h-6 ${activeSessionEntry ? 'text-white' : 'text-blue-600'} group-hover:translate-x-3 transition-transform`} />
             </button>
           )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
           
           {/* LEFT COLUMN: LIVE DOCTOR QUEUE */}
           <div className="xl:col-span-8 space-y-8">
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[600px]">
                 <div className="p-8 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-200">
                          <Stethoscope className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Flow</h3>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight">Today's Active Queue</h4>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                       <span className="text-[10px] font-black uppercase tracking-widest">Live Sync Active</span>
                       <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                    </div>
                 </div>
                 
                  <div className="table-scroll-container rounded-b-[3rem] max-h-[620px] overflow-y-auto scrollbar-hover-only">
                    <table className="w-full text-left border-collapse">
                       <thead className="sticky top-0 z-20 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                          <tr className="bg-white/95 backdrop-blur-sm">
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Token</th>
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">In Time</th>
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Patient Detail</th>
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Stage</th>
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Visit Type</th>
                             <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {isLoading ? (
                            <tr>
                              <td colSpan={6} className="py-20 text-center">
                                 <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Board...</span>
                                 </div>
                              </td>
                            </tr>
                          ) : queue.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-20 text-center">
                                 <div className="flex flex-col items-center gap-4 opacity-30">
                                    <Users className="w-12 h-12 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Queue is Empty</span>
                                 </div>
                              </td>
                            </tr>
                          ) : queue.map((entry) => (
                             <tr 
                               key={entry.id} 
                               onClick={() => entry.status === 'IN_SESSION' ? router.push(`/doctor/consultation/${entry.caseId}`) : handleStartConsultation(entry.caseId, entry.patientId)}
                               className={`group cursor-pointer transition-all duration-200 border-l-4 ${entry.status === 'IN_SESSION' ? 'bg-emerald-50/40 border-emerald-500 hover:bg-emerald-50' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                             >
                                <td className="px-10 py-6">
                                   <div className={`w-fit text-[12px] font-black tracking-widest px-3 py-1.5 rounded-xl border-2 transition-all group-hover:scale-105 ${entry.status === 'IN_SESSION' ? 'bg-emerald-600 text-white border-emerald-700 shadow-[4px_4px_0px_rgba(16,185,129,0.2)]' : 'bg-white text-slate-900 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]'}`}>
                                      {entry.tokenDisplay}
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-center">
                                   <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      {new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                </td>
                                <td className="px-10 py-6">
                                   <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                         <span className="text-[15px] font-bold text-slate-900 tracking-tight">{entry.patient.firstName} {entry.patient.lastName}</span>
                                         {getPriorityBadge(entry.priority)}
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">{entry.patient.mrdNumber}</span>
                                         <span className="text-[10px] font-bold text-slate-300">•</span>
                                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.patient.gender}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-center">
                                   <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                     entry.case.stage === 'NURSING' 
                                       ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                       : entry.case.stage === 'DOCTOR'
                                       ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                       : 'bg-slate-50 text-slate-400 border-slate-200'
                                   }`}>
                                      {entry.case.stage}
                                   </span>
                                </td>
                                <td className="px-10 py-6">
                                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                      {entry.case.visitType}
                                   </span>
                                </td>

                                <td className="px-10 py-6 text-right">
                                   {entry.status === 'IN_SESSION' ? (
                                     <div className="flex items-center justify-end gap-2.5">
                                       <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                                          <Activity className="w-3 h-3 animate-pulse" /> ACTIVE
                                       </span>
                                     </div>
                                   ) : (
                                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Consult</span>
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                                           <ChevronRight className="w-4 h-4 text-white" />
                                        </div>
                                     </div>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
           </div>

           {/* RIGHT COLUMN: CLINICAL SNAPSHOT */}
           <div className="xl:col-span-4 space-y-8 sticky top-28">
              
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden min-h-[500px]">
                 <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <User className="w-5 h-5 text-blue-400" />
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Patient Focus</h3>
                    </div>
                    <MoreVertical className="w-5 h-5 text-slate-600" />
                 </div>

                 {!activeSessionEntry && !nextPatientEntry ? (
                   <div className="p-20 text-center opacity-30 flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                         <User className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Selection</p>
                   </div>
                 ) : (
                   <div className="p-8 space-y-8">
                      {/* FOCUS PATIENT INFO */}
                      <div className="space-y-6">
                         <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-[1.1]">
                               {activeSessionEntry ? activeSessionEntry.patient.firstName + ' ' + activeSessionEntry.patient.lastName : nextPatientEntry.patient.firstName + ' ' + nextPatientEntry.patient.lastName}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-5">
                               <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">MRD: {(activeSessionEntry || nextPatientEntry).patient.mrdNumber}</span>
                               <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{(activeSessionEntry || nextPatientEntry).patient.gender}</span>
                            </div>
                         </div>

                         {/* ACTION PANEL */}
                         <div className="pt-8 border-t border-slate-100">
                            <button 
                              onClick={() => {
                                const target = activeSessionEntry || nextPatientEntry;
                                handleStartConsultation(target.caseId, target.patientId);
                              }}
                              className="w-full py-5 bg-blue-600 text-white rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-4 group"
                            >
                               {activeSessionEntry ? 'CONTINUE CHARTING' : 'OPEN CASE FILE'}
                               <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-5 italic">
                               {activeSessionEntry ? 'Chart currently open on your workstation' : 'Review patient vitals and clinical history'}
                            </p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

           </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboardView;
