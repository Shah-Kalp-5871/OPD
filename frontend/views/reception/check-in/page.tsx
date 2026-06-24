'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Clock, Sunrise, Sun, Sunset, Stethoscope, Briefcase, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import InitialConsultationPaymentModal from '../components/InitialConsultationPaymentModal';

const CheckInView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore(state => state.user);
  const isDoctor = user?.role?.toUpperCase() === 'DOCTOR';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [visitType, setVisitType] = useState('CONSULTATION');
  const [priority, setPriority] = useState('NORMAL');
  const [complaint, setComplaint] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInResult, setCheckInResult] = useState<any>(null);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const checkInSubmittingRef = useRef(false);
  useEffect(() => {
    fetchDoctors();
    // Auto-load if coming from schedule
    const mrdParam = searchParams?.get('mrd');
    const apptId = searchParams?.get('appt');
    
    if (mrdParam) {
      setSearchQuery(mrdParam);
      const quickFetch = async () => {
        try {
          const res = await api.get(`/patients/search?q=${mrdParam}`);
          const results = res.data?.items || res.data?.data?.items || res.data?.data || (Array.isArray(res.data) ? res.data : []);
          const patient = results?.[0];
          if (patient) {
            handleSelectPatient(patient, apptId);
          }
        } catch (e) {
          console.error('Quick fetch failed', e);
        }
      };
      quickFetch();
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      let availableDocs = res.data;
      if (isDoctor && user) {
        availableDocs = availableDocs.filter((d: any) => d.id === user.id);
      }
      setDoctors(availableDocs);
      if (availableDocs.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(availableDocs[0].doctorProfile?.id || availableDocs[0].id);
      }
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  useEffect(() => {
    if (selectedDoctorId && !selectedAppointment) {
      fetchSlots();
    }
  }, [selectedDoctorId, selectedAppointment]);

  const fetchSlots = async () => {
    setIsSlotsLoading(true);
    try {
      const today = new Date();
      // Ensure local timezone formatting for YYYY-MM-DD
      const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const res = await api.get(`/appointments/slots`, {
        params: {
          doctorId: selectedDoctorId,
          date: dateString
        }
      });

      // Filter out slots that have already passed today
      const currentHours = today.getHours();
      const currentMinutes = today.getMinutes();
      const formattedCurrentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
      const filteredSlots = res.data.filter((slot: any) => slot.time > formattedCurrentTime);

      setAvailableSlots(filteredSlots);
      setSelectedSlot(null);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setIsSlotsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/patients/search?q=${searchQuery}`);
      const results = res.data?.items || res.data?.data?.items || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setSearchResults(results || []);
      if (results?.length === 0) {
        toast.error('No patient found');
      } else if (results?.length === 1) {
          handleSelectPatient(results[0]);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const handleSelectPatient = (patient: any, apptId?: string | null) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setCheckInResult(null);
    setSelectedAppointment(apptId ? { id: apptId } : null);
  };

  const fetchPatientAppointments = async (patientId: string, apptId?: string | null) => {
    try {
      const res = await api.get(`/patients/${patientId}/appointments`);
      const results = res.data?.items || res.data?.data?.items || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      const scheduled = results.filter((a: any) => a.status === 'SCHEDULED');
      setPatientAppointments(scheduled);
      
      let targetAppt = null;
      if (apptId) {
        targetAppt = scheduled.find((a: any) => a.id === apptId);
      } else {
        const today = new Date().toISOString().split('T')[0];
        targetAppt = scheduled.find((a: any) => a.appointmentDate.startsWith(today));
      }

      if (targetAppt) {
        setSelectedAppointment(targetAppt);
        setSelectedDoctorId(targetAppt.doctorId);
        setComplaint(targetAppt.remarks || '');
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const handleCheckIn = async () => {
    if (checkInSubmittingRef.current || isSubmitting) return;
    if (!selectedPatient) return;
    
    // In this wireframe layout, if they are checking in, they must have a doctor
    if (!selectedDoctorId && doctors.length > 0) {
      // Fallback
      toast.error('Please ensure an appointment or doctor is associated.');
      return;
    }

    checkInSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const checkInData = {
        appointmentId: selectedAppointment?.id,
        visitType: selectedAppointment?.purpose || visitType,
        priority,
        complaint
      };

      let res;
      if (selectedAppointment) {
          res = await api.post('/appointments/check-in', checkInData);
      } else {
          // Manual walk-in flow now books a slot first
          if (!selectedSlot) {
            toast.error('Please select an available time slot');
            setIsSubmitting(false);
            checkInSubmittingRef.current = false;
            return;
          }

          const today = new Date();
          const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

          const apptRes = await api.post('/appointments', {
            patientId: selectedPatient.id,
            doctorId: selectedDoctorId,
            appointmentDate: dateString,
            appointmentTime: selectedSlot,
            purpose: checkInData.visitType,
            remarks: complaint
          });

          res = await api.post('/appointments/check-in', {
            ...checkInData,
            appointmentId: apptRes.data.id
          });
      }


      setCheckInResult(res.data?.queueEntry || res.data);
      toast.success('Patient checked in successfully!');
      
      // Redirect to patient hub
      setTimeout(() => {
        router.push(`/reception/patients/${selectedPatient.id}`);
      }, 1500);
      
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Check-in failed');
    } finally {
      checkInSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <ReceptionLayout>
      <div className="w-full px-4 md:px-6 py-4 font-sans">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Walk-In Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage arriving patients</p>
          </div>
        </div>


        <div className="flex gap-3 mb-5">
           <input 
             type="text" 
             className="flex-1 p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
             placeholder="Search arriving patient by Name or Mobile Number..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
           />
           <button 
             onClick={handleSearch}
             disabled={isLoading}
             className="px-8 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-sm disabled:opacity-70"
           >
              {isLoading ? 'Searching...' : 'Search'}
           </button>
        </div>

        {/* Search Results Dropdown (if multiple found) */}
        {searchResults.length > 1 && !selectedPatient && (
            <div className="mb-5 border border-slate-200 p-5 bg-white rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">Multiple Patients Found. Select one:</h3>
                <div className="grid gap-2">
                    {searchResults.map(p => (
                        <div key={p.id} onClick={() => handleSelectPatient(p)} className="p-3 border border-slate-100 rounded-lg hover:border-orange-500 hover:bg-orange-50/30 cursor-pointer transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 text-sm group-hover:text-orange-700">{p.firstName} {p.lastName}</div>
                                <div className="text-xs text-slate-500">MRD: {p.mrdNumber} • Mob: {p.mobile}</div>
                              </div>
                            </div>
                            <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Select &rarr;</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* If CheckIn Successful */}
        {checkInResult && (
            <div className="mb-5 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm">✓</div>
                  <div>
                    <div className="text-orange-900 font-semibold text-sm">Check-In Successful!</div>
                    <div className="text-orange-700 text-xs">Token: <span className="font-bold">{checkInResult?.tokenDisplay || checkInResult?.tokenNumber || 'N/A'}</span>. Preparing for next patient...</div>
                  </div>
                </div>
            </div>
        )}

        {/* Main Content (When Patient Selected) */}
        {selectedPatient && (
          <div className="space-y-4">
            
            {/* TOP ROW: Patient Info Card + Walk-In Clinical Details side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              
              {/* LEFT: Compact Appointment Details */}
              <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                   <h2 className="font-semibold text-slate-700 text-sm">Appointment Details</h2>
                   <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">Patient Found</span>
                </div>
                
                <div className="p-4">
                  {/* Patient Identity - compact row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
                      {selectedPatient.firstName?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-base text-slate-800 flex items-center gap-2 flex-wrap">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {selectedPatient.profile?.age || 'N/A'}{selectedPatient.gender?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">MRD: {selectedPatient.mrdNumber}</div>
                    </div>
                  </div>

                  {/* Meta info grid - compact */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Case ID</div>
                      <div className="text-xs font-semibold text-slate-700">{checkInResult?.caseId || 'Pending'}</div>
                    </div>
                    {selectedAppointment ? (
                      <>
                        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Appt. Time</div>
                          <div className="text-xs font-semibold text-slate-700">{new Date(selectedAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Purpose</div>
                          <div className="text-xs font-semibold text-slate-700">{selectedAppointment.purpose || 'Consultation'}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Doctor</div>
                          <div className="text-xs font-semibold text-slate-700">{selectedAppointment.doctor?.user?.name || 'Not Assigned'}</div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                        <div className="text-[10px] text-amber-500 font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1"><Stethoscope className="w-3 h-3" />Walk-in</div>
                        <div className="text-xs font-semibold text-amber-700">Select Doctor & Slot →</div>
                      </div>
                    )}
                  </div>

                  {/* Category & Billing - inline compact */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Category:</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{selectedPatient?.patientCategory || 'N/A'}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Billing:</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${selectedAppointment?.billingStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{selectedAppointment?.billingStatus || 'N/A'}</span>
                    </div>
                  </div>

                  {!selectedAppointment && (
                    <div className="grid grid-cols-2 gap-3 mb-3 border-t border-slate-100 pt-3 mt-1">
                      <div className="space-y-1">
                         <label className="text-[10px] font-medium text-slate-500">Purpose of Visit *</label>
                         <input 
                           type="text" 
                           value={visitType} 
                           onChange={e => setVisitType(e.target.value)} 
                           placeholder="e.g. Follow-up, Fever..."
                           className="w-full border border-slate-200 bg-white rounded-lg p-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs transition-all" 
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-medium text-slate-500">Complaint / Remarks</label>
                         <input 
                           type="text" 
                           value={complaint} 
                           onChange={e => setComplaint(e.target.value)} 
                           placeholder="Brief details..."
                           className="w-full border border-slate-200 bg-white rounded-lg p-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs transition-all" 
                         />
                      </div>
                    </div>
                  )}

                  {selectedPatient.specialNotes && (
                    <div className="mt-3 text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                       <span className="font-semibold text-amber-800">⚠ Note:</span> {selectedPatient.specialNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Walk-In Clinical Details (only if no scheduled appointment) */}
              {!selectedAppointment && (
                <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-700 text-sm">Walk-In Clinical Details</h2>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Doctor selection */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Select Doctor *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {doctors.map(doc => {
                          const profileId = doc.doctorProfile?.id || doc.id;
                          const name = doc.name || doc.user?.name || '';
                          const spec = doc.doctorProfile?.specialization || doc.specialization || 'General';
                          const isActive = selectedDoctorId === profileId;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDoctorId(profileId)}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                                isActive ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-xs font-bold truncate ${isActive ? 'text-orange-700' : 'text-slate-700'}`}>Dr. {name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{spec}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Slot Selection */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Available Time Slots *</span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{availableSlots.length} slots</span>
                      </label>
                      
                      {isSlotsLoading ? (
                        <div className="text-xs text-slate-400 py-3 flex items-center gap-2">
                           <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                           Loading slots...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-xs text-slate-400 py-3 italic border border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
                          No slots available for this doctor today.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {availableSlots.map((slot, i) => {
                            const isBooked = slot.status === 'booked';
                            const isSel = selectedSlot === slot.time;
                            return (
                              <button
                                key={i}
                                disabled={isBooked}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                                  isBooked ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed line-through' :
                                  isSel ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-105' :
                                  'bg-white text-slate-600 border border-slate-200 hover:border-orange-400 hover:text-orange-600'
                                }`}
                              >
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Slots rendering above this ... */}

                  </div>
                </div>
              )}
            </div>

            {/* Check-In Action */}
            <div className="flex items-center gap-4 py-1">
               <button 
                 onClick={() => {
                   if (!selectedAppointment && (!selectedDoctorId || !selectedSlot)) {
                     toast.error('Please select a doctor and a time slot first.');
                     return;
                   }
                   setIsCheckInModalOpen(true);
                 }}
                 className="bg-orange-600 text-white font-bold py-3 px-10 text-sm rounded-xl hover:bg-orange-700 transition-all shadow-sm shadow-orange-600/20 flex items-center gap-2"
               >
                 Proceed to Payment & Check-In
                 <span>&rarr;</span>
               </button>
            </div>


        </div>
      )}
    </div>
    <InitialConsultationPaymentModal 
       isOpen={isCheckInModalOpen}
       onClose={() => setIsCheckInModalOpen(false)}
       patient={selectedPatient}
       appointmentId={selectedAppointment?.id}
       walkInDoctorId={selectedDoctorId}
       walkInSlot={selectedSlot}
       walkInVisitType={visitType}
       walkInComplaint={complaint}
       onSuccess={() => {
         setIsCheckInModalOpen(false);
         // Router push is handled inside handleCheckIn success on the parent or we just reload
         setTimeout(() => {
           router.push(`/reception/patients/${selectedPatient?.id}`);
         }, 1500);
       }}
    />
  </ReceptionLayout>
  );
};

export default CheckInView;
