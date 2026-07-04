'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';
import { useClinicalSSE } from '@/hooks/useClinicalSSE';
import { useAuthStore } from '@/store/authStore';


import InitialConsultationPaymentModal from '@/views/reception/components/InitialConsultationPaymentModal';

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
  const [appointmentsQueue, setAppointmentsQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = useAuthStore((state: any) => state.user);
  const doctorId = user?.id;

  const { entries: sseEntries, refreshData: refreshSseData } = useQueueSSE({ doctorId });
  const { lastEvent: clinicalEvent } = useClinicalSSE();

  useEffect(() => {
    setQueue([...sseEntries, ...appointmentsQueue]);
  }, [sseEntries, appointmentsQueue]);

  useEffect(() => {
    if (clinicalEvent?.type === 'VITALS_SAVED') {
      fetchMyQueue(); // Refresh queue when vitals are saved as it might change stage visibility
    }
  }, [clinicalEvent]);

  useEffect(() => {
    if (doctorId) {
      fetchMyQueue();
    }
  }, [doctorId]);

  const fetchMyQueue = async () => {
    try {
      if (!doctorId) return;
      const dateFilter = new Date().toISOString().split('T')[0];
      const apptUrl = `/appointments?date=${dateFilter}&doctorId=${doctorId}`;
      
      const response = await api.get(apptUrl);
      const apptData = (response.data?.data || [])
        .filter((a: any) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED')
        .map((a: any) => ({
          isAppointment: true,
          appointmentId: a.id,
          id: a.id,
          status: 'SCHEDULED_APPOINTMENT',
          tokenDisplay: 'APP-' + new Date(a.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokenNumber: 9999,
          patient: a.patient,
          doctor: a.doctor,
          case: { visitType: a.purpose, createdAt: a.appointmentTime },
          checkInTime: null,
          createdAt: a.createdAt,
        }));
        
      setAppointmentsQueue(apptData);
    } catch (error) {
      console.error('Failed to fetch queue', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedAppointmentForCheckIn, setSelectedAppointmentForCheckIn] = useState<string | null>(null);
  const [selectedPatientForCheckIn, setSelectedPatientForCheckIn] = useState<any>(null);

  const handleDirectCheckIn = (appointmentId: string, patient: any) => {
    setSelectedAppointmentForCheckIn(appointmentId);
    setSelectedPatientForCheckIn(patient);
    setIsCheckInModalOpen(true);
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

  const activeQueue = queue.filter(q => !['COMPLETED', 'CANCELLED', 'BILLING_PENDING', 'PHARMACY_PENDING'].includes(q.status));
  const totalPages = Math.ceil(activeQueue.length / itemsPerPage);
  const paginatedQueue = activeQueue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-4 pb-10 px-4 pt-0">
        
        {/* 🔷 SECTION 1: ACTIVE / NEXT PATIENT ALERT */}
        <div className="bg-[#107ca3] rounded-2xl p-2 overflow-hidden shadow-lg flex items-center justify-between border border-[#0d6282] mt-0">
           <div className="flex items-center gap-5 px-6 py-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse border border-white/30 backdrop-blur-sm">
                 {activeSessionEntry ? <Activity className="w-5 h-5 text-white" /> : <Zap className="w-5 h-5 text-white" />}
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em]">
                       {activeSessionEntry ? 'Currently In Session' : 'Next Patient Prepared'}
                    </span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                 </div>
                 <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
                    {activeSessionEntry ? (
                      <>
                        {activeSessionEntry.patient.firstName} {activeSessionEntry.patient.lastName}
                        <span className="text-white/40">/</span>
                        <span className="text-white/90 text-[16px] uppercase tracking-widest">{activeSessionEntry.tokenDisplay}</span>
                      </>
                    ) : nextPatientEntry ? (
                      <>
                        {nextPatientEntry.patient.firstName} {nextPatientEntry.patient.lastName}
                        <span className="text-white/40">/</span>
                        <span className="text-white/90 text-[16px] uppercase tracking-widest">{nextPatientEntry.tokenDisplay}</span>
                      </>
                    ) : (
                      'NO PATIENTS WAITING'
                    )}
                 </h2>
                 <p className="text-[10px] font-semibold text-white/70 uppercase tracking-[0.1em] mt-0.5">
                    {activeSessionEntry ? `Case ID: ${activeSessionEntry.case.caseNumber}` : nextPatientEntry ? `Awaiting Room Entry | ${nextPatientEntry.case.visitType}` : 'Ready for next check-in'}
                 </p>
              </div>
           </div>

           {(activeSessionEntry || nextPatientEntry) && (
             <div className="flex items-center gap-2 px-4">
                <button 
                  onClick={() => {
                    const target = activeSessionEntry || nextPatientEntry;
                    router.push(`/doctor/patients/${target.patientId}`);
                  }}
                  className="bg-[#025674] hover:bg-[#01425a] text-white px-6 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border border-[#01425a] min-w-[120px] shadow-sm"
                >
                   <User className="w-5 h-5 text-white/80" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Profile</span>
                </button>

                {(!activeSessionEntry && nextPatientEntry?.status === 'WAITING' && !queue.some(q => q.status === 'CALLING')) ? (
                  <button 
                    onClick={() => handleCallPatient(nextPatientEntry.id)}
                    disabled={isSubmitting}
                    className="bg-white hover:bg-gray-50 text-[#107ca3] px-6 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all min-w-[140px] shadow-sm border border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Zap className="w-5 h-5 animate-bounce" />
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
                    className="bg-white hover:bg-gray-50 text-[#107ca3] px-6 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all min-w-[140px] shadow-sm border border-white/40"
                  >
                     <ClipboardList className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                        {activeSessionEntry ? 'Resume Chart' : 'Start Chart'}
                     </span>
                  </button>
                )}
             </div>
           )}
        </div>
        <div className="grid grid-cols-1 items-start">
           
           {/* LEFT COLUMN: LIVE DOCTOR QUEUE */}
           <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
                 <div className="px-4 py-3 bg-[#f0f7fa] border-b border-[#107ca3]/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#107ca3] shadow-sm border border-[#107ca3]/20">
                          <Stethoscope className="w-4 h-4" />
                       </div>
                       <div>
                          <h3 className="text-[9px] font-bold text-[#107ca3]/80 uppercase tracking-[0.2em]">Operational Flow</h3>
                          <h4 className="text-[14px] font-black text-[#0d6282] tracking-tight">Today's Active Queue</h4>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#107ca3] rounded-lg border border-[#107ca3]/30 shadow-sm">
                       <span className="text-[9px] font-black uppercase tracking-widest">Live Sync Active</span>
                       <div className="w-2 h-2 bg-[#107ca3] rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 
                  <div className="w-full">
                     <table className="w-full text-left border-collapse border border-slate-200">
                       <thead>
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
                          ) : paginatedQueue.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-20 text-center border border-slate-200">
                                 <div className="flex flex-col items-center gap-4 opacity-30">
                                    <Users className="w-12 h-12 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Queue is Empty</span>
                                 </div>
                              </td>
                            </tr>
                          ) : paginatedQueue.map((entry, index) => {
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
                                      <span 
                                        className="text-[14px] font-bold text-[#107ca3] hover:text-[#0d6282] tracking-tight uppercase cursor-pointer hover:underline transition-all"
                                        onClick={() => router.push(`/doctor/patients/${entry.patientId}`)}
                                      >
                                        {entry.patient.firstName} {entry.patient.lastName}
                                      </span>
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
                                   ) : entry.status === 'SCHEDULED_APPOINTMENT' ? (
                                     <div className="flex items-center justify-center">
                                       <button 
                                         onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleDirectCheckIn(entry.appointmentId, entry.patient);
                                         }}
                                         className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border border-indigo-200 flex items-center gap-1.5"
                                       >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          ARRIVED
                                       </button>
                                     </div>
                                   ) : (
                                     <div className="flex items-center justify-center gap-2.5">
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
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                           Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, queue.length)} of {queue.length} Entries
                         </span>
                         <div className="flex items-center gap-2">
                            <button
                               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                               disabled={currentPage === 1}
                               className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                               Prev
                            </button>
                            <span className="text-sm font-black text-[#107ca3] px-3">
                               {currentPage} / {totalPages}
                            </span>
                            <button
                               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                               disabled={currentPage === totalPages}
                               className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                               Next
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
               </div>
           </div>


        </div>
      </div>
      {isCheckInModalOpen && (
        <InitialConsultationPaymentModal
          isOpen={isCheckInModalOpen}
          onClose={() => {
            setIsCheckInModalOpen(false);
            setSelectedAppointmentForCheckIn(null);
            setSelectedPatientForCheckIn(null);
          }}
          appointmentId={selectedAppointmentForCheckIn || undefined}
          patient={selectedPatientForCheckIn}
          onSuccess={() => {
            setIsCheckInModalOpen(false);
            fetchMyQueue();
            refreshSseData();
          }}
        />
      )}
    </DoctorLayout>
  );
};

export default DoctorDashboardView;
