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
  ChevronRight,
  UserPlus,
  Search,
  CalendarDays
} from 'lucide-react';
import ClinicalWorkflowWidget from '@/components/dashboard/ClinicalWorkflowWidget';

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

  const handleCallPatient = async (queueId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSubmitting(true);
    try {
      await api.patch(`/queue/${queueId}/status`, { status: 'CALLING' });
      toast.success('Patient called. Waiting for arrival...');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to call patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSessionEntry = queue.find(q => q.status === 'IN_SESSION');
  const nextPatientEntry = queue.find(q => q.status === 'WAITING' || q.status === 'CALLING');

  const activePatientName = activeSessionEntry 
    ? `${activeSessionEntry.patient.firstName} ${activeSessionEntry.patient.lastName}` 
    : nextPatientEntry 
    ? `${nextPatientEntry.patient.firstName} ${nextPatientEntry.patient.lastName}` 
    : undefined;

  const handlePrescribe = (med: any) => {
    toast.success(`Draft prescription created for ${activePatientName || 'Patient'}: ${med.name} ${med.dosage}`);
  };

  const handleReferral = (specialty: string) => {
    toast.success(`Referral request logged to ${specialty} specialty`);
  };

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
        <div className="bg-[#036d92] rounded-[2.5rem] p-2 pr-2 overflow-hidden shadow-2xl flex items-center justify-between border-4 border-[#025674]">
           <div className="flex items-center gap-8 px-10 py-8">
              <div className="w-14 h-14 bg-white shadow-black/10 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                 {activeSessionEntry ? <Activity className="w-7 h-7 text-[#036d92]" /> : <Zap className="w-7 h-7 text-[#036d92]" />}
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                       {activeSessionEntry ? 'Currently In Session' : 'Next Patient Prepared'}
                    </span>
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight mt-2 flex items-center gap-4">
                    {activeSessionEntry ? (
                      <>
                        {activeSessionEntry.patient.firstName} {activeSessionEntry.patient.lastName}
                        <span className="text-white/50">/</span>
                        <span className="text-white text-lg uppercase tracking-widest">{activeSessionEntry.tokenDisplay}</span>
                      </>
                    ) : nextPatientEntry ? (
                      <>
                        {nextPatientEntry.patient.firstName} {nextPatientEntry.patient.lastName}
                        <span className="text-white/50">/</span>
                        <span className="text-white text-lg uppercase tracking-widest">{nextPatientEntry.tokenDisplay}</span>
                      </>
                    ) : (
                      'NO PATIENTS WAITING'
                    )}
                 </h2>
                 <p className="text-[11px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1 italic">
                    {activeSessionEntry ? `Case ID: ${activeSessionEntry.case.caseNumber}` : nextPatientEntry ? `Awaiting Room Entry | ${nextPatientEntry.case.visitType}` : 'Ready for next check-in'}
                 </p>
              </div>
           </div>

           {(activeSessionEntry || nextPatientEntry) && (
             <div className="flex items-center gap-2 px-6">
                <button 
                  onClick={() => {
                    const target = activeSessionEntry || nextPatientEntry;
                    router.push(`/reception/patients/${target.patientId}`);
                  }}
                  className="bg-[#025674] hover:bg-[#01425a] text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border border-[#01425a] min-w-[120px]"
                >
                   <User className="w-6 h-6 text-white/80" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Profile</span>
                </button>

                {(!activeSessionEntry && nextPatientEntry?.status === 'WAITING' && !queue.some(q => q.status === 'CALLING')) ? (
                  <button 
                    onClick={() => handleCallPatient(nextPatientEntry.id)}
                    disabled={isSubmitting}
                    className="bg-amber-400 hover:bg-amber-500 text-amber-950 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all min-w-[160px] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Zap className="w-6 h-6 animate-bounce" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Call Patient
                     </span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      const target = activeSessionEntry || nextPatientEntry;
                      handleStartConsultation(target.caseId, target.patientId);
                    }}
                    disabled={isSubmitting}
                    className="bg-white hover:bg-gray-50 text-[#036d92] p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all min-w-[160px]"
                  >
                     <ClipboardList className="w-6 h-6" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {activeSessionEntry ? 'Resume Chart' : 'Start Chart'}
                     </span>
                  </button>
                )}
             </div>
           )}
        </div>
        <div className="grid grid-cols-1 gap-10 items-start">
           
           {/* LEFT COLUMN: LIVE DOCTOR QUEUE */}
           <div className="space-y-8">
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
                     <table className="w-full text-left border-collapse border border-slate-200">
                       <thead className="sticky top-0 z-20 shadow-md">
                          <tr className="bg-[#107ca3] text-white">
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Case No</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Time</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282]">Patient Name</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Visit For</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Age</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Gender</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282]">Address</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Payment Status</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Mobile No</th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Action Buttons</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200">
                          {isLoading ? (
                            <tr>
                              <td colSpan={10} className="py-20 text-center border border-slate-200">
                                 <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-slate-100 border-t-[#107ca3] rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Board...</span>
                                 </div>
                              </td>
                            </tr>
                          ) : queue.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-20 text-center border border-slate-200">
                                 <div className="flex flex-col items-center gap-4 opacity-30">
                                    <Users className="w-12 h-12 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Queue is Empty</span>
                                 </div>
                              </td>
                            </tr>
                          ) : queue.map((entry, index) => {
                             const hasActiveOrCalling = queue.some(q => q.status === 'IN_SESSION' || q.status === 'CALLING');
                             
                             return (
                             <tr 
                               key={entry.id} 
                               className={`group transition-all duration-200 ${
                                 entry.status === 'IN_SESSION' ? 'bg-emerald-100/50' 
                                 : entry.status === 'CALLING' ? 'bg-blue-100/50' 
                                 : index % 2 === 0 ? 'bg-slate-100' : 'bg-white'
                               }`}
                             >
                                <td className="px-4 py-4 border border-slate-200 text-center">
                                   <span className={`w-fit mx-auto text-[12px] font-black tracking-widest px-3 py-1.5 rounded-xl border transition-all ${entry.status === 'IN_SESSION' ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-900 border-slate-300 shadow-sm'}`}>
                                      {entry.case?.caseNumber || entry.tokenDisplay}
                                   </span>
                                </td>
                                <td className="px-4 py-4 text-center border border-slate-200">
                                   <span className="text-[12px] font-bold text-slate-700 flex items-center justify-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      {entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                                   </span>
                                </td>
                                <td className="px-4 py-4 border border-slate-200">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[14px] font-bold text-slate-900 tracking-tight uppercase">{entry.patient.firstName} {entry.patient.lastName}</span>
                                      {getPriorityBadge(entry.priority)}
                                   </div>
                                </td>
                                <td className="px-4 py-4 text-center border border-slate-200">
                                   <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest bg-slate-50/50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                      {entry.case?.visitType || '--'}
                                   </span>
                                </td>
                                <td className="px-4 py-4 text-center text-[12px] font-bold text-slate-700 border border-slate-200">
                                   {entry.patient?.dateOfBirth ? `${Math.abs(new Date(Date.now() - new Date(entry.patient.dateOfBirth).getTime()).getUTCFullYear() - 1970)} Years` : '--'}
                                </td>
                                <td className="px-4 py-4 text-center text-[12px] font-bold text-slate-700 capitalize border border-slate-200">
                                   {entry.patient?.gender?.toLowerCase() || '--'}
                                </td>
                                <td className="px-4 py-4 text-[12px] font-bold text-slate-700 truncate max-w-[120px] border border-slate-200">
                                   {entry.patient?.address?.city || '--'}
                                </td>
                                <td className="px-4 py-4 text-center border border-slate-200">
                                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                                     entry.patient?.isFoc || entry.case?.bill?.paymentStatus === 'COMPLETED'
                                       ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                       : 'bg-amber-50 text-amber-600 border-amber-200'
                                   }`}>
                                      {entry.patient?.isFoc ? 'FOC' : (entry.case?.bill?.paymentStatus || 'PENDING')}
                                   </span>
                                </td>
                                <td className="px-4 py-4 text-center text-[12px] font-bold text-slate-700 border border-slate-200">
                                   {entry.patient?.phone || '--'}
                                </td>
                                <td className="px-4 py-4 text-center border border-slate-200">
                                   {entry.status === 'IN_SESSION' ? (
                                     <div className="flex items-center justify-center gap-2.5">
                                       <button 
                                          onClick={() => router.push(`/doctor/consultation/${entry.caseId}`)}
                                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-sm transition-colors"
                                       >
                                          <Activity className="w-3 h-3 animate-pulse" /> RESUME
                                       </button>
                                     </div>
                                   ) : entry.status === 'CALLING' ? (
                                     <div className="flex items-center justify-center gap-2.5">
                                       <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 animate-pulse">
                                          CALLING...
                                       </span>
                                       <button 
                                          onClick={() => handleStartConsultation(entry.caseId, entry.patientId)}
                                          className="flex items-center justify-center gap-2 transition-all duration-300 group/start"
                                       >
                                          <span className="text-[10px] font-black text-blue-600 group-hover/start:text-blue-700 uppercase tracking-widest">Start</span>
                                          <div className="w-8 h-8 bg-blue-600 group-hover/start:bg-blue-700 rounded-full flex items-center justify-center shadow-sm">
                                             <ChevronRight className="w-4 h-4 text-white" />
                                          </div>
                                       </button>
                                     </div>
                                   ) : (
                                     <div className="flex items-center justify-center gap-2 transition-all duration-300">
                                        <button 
                                          onClick={(e) => handleCallPatient(entry.id, e)}
                                          disabled={isSubmitting || hasActiveOrCalling}
                                          className="flex items-center gap-2 px-6 py-1.5 bg-white text-slate-700 hover:bg-[#107ca3] hover:text-white rounded-full transition-colors border border-slate-300 hover:border-[#107ca3] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300 font-bold"
                                        >
                                          <span className="text-[11px] font-black uppercase tracking-widest">Call</span>
                                        </button>
                                     </div>
                                   )}
                                </td>
                             </tr>
                          )})}
                       </tbody>
                    </table>
                  </div>
               </div>
           </div>


        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboardView;
