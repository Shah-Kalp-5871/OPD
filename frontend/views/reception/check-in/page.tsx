'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Clock, Sunrise, Sun, Sunset, Stethoscope } from 'lucide-react';
import ComplaintsForm, { VisitComplaintData } from './components/ComplaintsForm';

const CheckInView = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [visitType, setVisitType] = useState('CONSULTATION');
  const [priority, setPriority] = useState('NORMAL');
  const [complaint, setComplaint] = useState('');
  
  const [vitals, setVitals] = useState({
    height: '',
    weight: '',
    bmi: '0.0',
    temp: '',
    pulse: '',
    bpSys: '',
    bpDia: '',
    spo2: ''
  });

  const [visitComplaint, setVisitComplaint] = useState<VisitComplaintData>({
    presentComplaint: '',
    durationDays: '',
    durationMonths: '',
    durationYears: '',
    severity: 'MODERATE',
    onset: '',
    aggravatingFactors: '',
    relievingFactors: '',
    pastMedical: '',
    personalHistory: '',
    pastSurgical: '',
    currentMedications: '',
    obstetricHistory: '',
    allergies: '',
    nursingNotes: '',
    patientFeedback: ''
  });
  
  // New State for Missed/No-Show Management
  const [missedAction, setMissedAction] = useState<string>(''); // 'reschedule', 'no-answer', 'not-called'
  const [newFuDate, setNewFuDate] = useState<string>('');
  const [missedNote, setMissedNote] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingMissed, setIsSubmittingMissed] = useState(false);
  const [checkInResult, setCheckInResult] = useState<any>(null);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const checkInSubmittingRef = useRef(false);

  const handleMissedActionSubmit = async () => {
    if (!selectedPatient) {
      toast.error('No patient selected.');
      return;
    }
    if (missedAction === 'reschedule' && !newFuDate) {
      toast.error('Please select a new follow-up date for rescheduling.');
      return;
    }
    
    setIsSubmittingMissed(true);
    try {
      await api.post('/appointments/missed-action', {
        patientId: selectedPatient.id,
        appointmentId: selectedAppointment?.id,
        action: missedAction,
        newFuDate: newFuDate || undefined,
        note: missedNote || undefined
      });

      toast.success('Patient status updated successfully');
      setMissedAction('');
      setNewFuDate('');
      setMissedNote('');
      
      // Auto clear to check in the next patient
      setTimeout(() => {
        setSelectedPatient(null);
        setSearchQuery('');
        setSearchResults([]);
      }, 2000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update appointment status';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSubmittingMissed(false);
    }
  };

  // Auto-calculate BMI
  useEffect(() => {
    if (vitals.height && vitals.weight) {
      const h = parseFloat(vitals.height) / 100;
      const w = parseFloat(vitals.weight);
      if (h > 0) {
        setVitals(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [vitals.height, vitals.weight]);

  useEffect(() => {
    fetchDoctors();
    // Auto-load if coming from schedule
    const mrdParam = searchParams.get('mrd');
    const apptId = searchParams.get('appt');
    
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
      setDoctors(res.data);
      if (res.data.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(res.data[0].doctorProfile?.id || res.data[0].id);
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
      setAvailableSlots(res.data);
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

  const handleSelectPatient = (patient: any, apptId?: string | null) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setCheckInResult(null);
    setSelectedAppointment(null);
    fetchPatientAppointments(patient.id, apptId);
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
      const bpString = vitals.bpSys && vitals.bpDia
        ? `${vitals.bpSys}/${vitals.bpDia}`
        : vitals.bpSys
          ? vitals.bpSys
          : null;

      const checkInData = {
        appointmentId: selectedAppointment?.id,
        visitType: selectedAppointment?.purpose || visitType,
        priority,
        complaint,
        vitals: (vitals.height || vitals.weight || vitals.temp || vitals.pulse || vitals.bpSys || vitals.spo2) ? {
          height: parseFloat(vitals.height) || null,
          weight: parseFloat(vitals.weight) || null,
          bmi: parseFloat(vitals.bmi) || null,
          temperature: parseFloat(vitals.temp) || null,
          pulse: parseInt(vitals.pulse) || null,
          bloodPressure: bpString,
          spo2: parseInt(vitals.spo2) || null
        } : undefined,
        visitComplaint: visitComplaint.presentComplaint || visitComplaint.pastMedical || visitComplaint.allergies ? {
          ...visitComplaint,
          durationDays: parseInt(visitComplaint.durationDays) || null,
          durationMonths: parseInt(visitComplaint.durationMonths) || null,
          durationYears: parseInt(visitComplaint.durationYears) || null,
        } : undefined
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

          if (checkInData.vitals) {
             await api.post(`/patients/${selectedPatient.id}/vitals`, checkInData.vitals);
          }

          res = await api.post('/appointments/check-in', {
            ...checkInData,
            appointmentId: apptRes.data.id
          });
      }


      setCheckInResult(res.data?.queueEntry || res.data);
      toast.success('Patient checked in successfully!');
      
      // Reset form state to check-in the next patient
      setTimeout(() => {
        setSelectedPatient(null);
        setCheckInResult(null);
        setSearchQuery('');
        setVitals({ height: '', weight: '', bmi: '0.0', temp: '', pulse: '', bpSys: '', bpDia: '', spo2: '' });
        setVisitComplaint({
          presentComplaint: '', durationDays: '', durationMonths: '', durationYears: '',
          severity: 'MODERATE', onset: '', aggravatingFactors: '', relievingFactors: '',
          pastMedical: '', personalHistory: '', pastSurgical: '', currentMedications: '',
          obstetricHistory: '', allergies: '', nursingNotes: '', patientFeedback: ''
        });
      }, 3000);
      
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
      <div className="max-w-5xl mx-auto p-6 md:p-8 font-sans">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Patient Check-In</h1>
            <p className="text-sm text-slate-500 mt-1">Search and check-in arriving patients</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
           <input 
             type="text" 
             className="flex-1 p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
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
            <div className="mb-8 border border-slate-200 p-6 bg-white rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Multiple Patients Found. Select one:</h3>
                <div className="grid gap-2">
                    {searchResults.map(p => (
                        <div key={p.id} onClick={() => handleSelectPatient(p)} className="p-4 border border-slate-100 rounded-lg hover:border-orange-500 hover:bg-orange-50/30 cursor-pointer transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-orange-700">{p.firstName} {p.lastName}</div>
                                <div className="text-xs text-slate-500">MRD: {p.mrdNumber} • Mob: {p.mobile}</div>
                              </div>
                            </div>
                            <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* If CheckIn Successful */}
        {checkInResult && (
            <div className="mb-8 p-5 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    ✓
                  </div>
                  <div>
                    <div className="text-orange-900 font-semibold">Check-In Successful!</div>
                    <div className="text-orange-700 text-sm">Token: <span className="font-bold">{checkInResult?.tokenDisplay || checkInResult?.tokenNumber || 'N/A'}</span>. Preparing for next patient...</div>
                  </div>
                </div>
            </div>
        )}

        {/* Main Content (When Patient Selected) */}
        {selectedPatient && (
          <div className="space-y-6">
            
            {/* Patient Details Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="font-semibold text-slate-700 text-sm">Appointment Details</h2>
                 <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">Patient Found</span>
              </div>
              
              <div className="p-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl">
                      {selectedPatient.firstName?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-800 flex items-center gap-3">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {selectedPatient.profile?.age || 'N/A'}{selectedPatient.gender?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">MRD: {selectedPatient.mrdNumber}</div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">Case ID</div>
                      <div className="text-sm font-semibold text-slate-800">{checkInResult?.caseId || 'Pending'}</div>
                    </div>
                    {selectedAppointment ? (
                      <>
                        <div>
                          <div className="text-xs text-slate-500 font-medium mb-1">Appointment Time</div>
                          <div className="text-sm font-semibold text-slate-800">{new Date(selectedAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 font-medium mb-1">Purpose</div>
                          <div className="text-sm font-semibold text-slate-800">{selectedAppointment.purpose || 'Consultation'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 font-medium mb-1">Doctor</div>
                          <div className="text-sm font-semibold text-slate-800">{selectedAppointment.doctor?.user?.name || 'Not Assigned'}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-3">
                          <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Walk-in Details</div>
                          <div className="text-sm font-semibold text-slate-800">Please select Doctor and Time Slot below</div>
                        </div>
                      </>
                    )}
                 </div>

                 <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Patient Category:</span>
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">{selectedPatient?.patientCategory || 'N/A'}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Billing Status:</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${selectedAppointment?.billingStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{selectedAppointment?.billingStatus || 'N/A'}</span>
                    </div>
                 </div>

                 {selectedPatient.specialNotes && (
                   <div className="text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                      <span className="font-semibold text-amber-800">Special Note:</span> {selectedPatient.specialNotes}
                   </div>
                 )}
              </div>
            </div>

             {/* Walk-In Clinical Details */}
            {!selectedAppointment && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-700 text-sm">Walk-In Clinical Details</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Doctor selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Select Doctor *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {doctors.map(doc => {
                        const profileId = doc.doctorProfile?.id || doc.id;
                        const name = doc.name || doc.user?.name || '';
                        const spec = doc.doctorProfile?.specialization || doc.specialization || 'General';
                        const isActive = selectedDoctorId === profileId;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDoctorId(profileId)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              isActive ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className={`text-sm font-bold ${isActive ? 'text-orange-700' : 'text-slate-700'}`}>Dr. {name}</div>
                              <div className="text-xs text-slate-500">{spec}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Available Time Slots *</span>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{availableSlots.length} slots</span>
                    </label>
                    
                    {isSlotsLoading ? (
                      <div className="text-xs text-slate-400 py-4 flex items-center gap-2">
                         <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                         Loading slots...
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-xs text-slate-400 py-4 italic border border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
                        No slots available for this doctor today.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.map((slot, i) => {
                          const isBooked = slot.status === 'booked';
                          const isSel = selectedSlot === slot.time;
                          return (
                            <button
                              key={i}
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

                  {/* Purpose & Complaint */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Purpose of Visit *</label>
                       <input 
                         type="text" 
                         value={visitType} 
                         onChange={e => setVisitType(e.target.value)} 
                         placeholder="e.g. Follow-up, Fever..."
                         className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" 
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Complaint / Remarks</label>
                       <input 
                         type="text" 
                         value={complaint} 
                         onChange={e => setComplaint(e.target.value)} 
                         placeholder="Brief details..."
                         className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" 
                       />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vitals Entry Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="font-semibold text-slate-700 text-sm">Vitals Entry</h2>
                 <span className="text-xs text-slate-500">Optional</span>
              </div>
              
              <div className="p-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Height (cm)</label>
                       <input type="number" value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Weight (kg)</label>
                       <input type="number" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">BMI</label>
                       <input type="text" readOnly value={vitals.bmi} className="w-full border border-slate-200 bg-slate-100/70 text-slate-500 rounded-lg p-2.5 outline-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Temp (°F)</label>
                       <input type="number" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">Pulse (bpm)</label>
                       <input type="number" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2 lg:col-span-1 col-span-2">
                       <label className="text-xs font-medium text-slate-600">BP (mmHg)</label>
                       <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                          <input type="number" placeholder="Sys" value={vitals.bpSys} onChange={e => setVitals({...vitals, bpSys: e.target.value})} className="w-1/2 bg-slate-50 p-2.5 outline-none text-sm text-center border-r border-slate-200" />
                          <input type="number" placeholder="Dia" value={vitals.bpDia} onChange={e => setVitals({...vitals, bpDia: e.target.value})} className="w-1/2 bg-slate-50 p-2.5 outline-none text-sm text-center" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">SpO2 (%)</label>
                       <input type="number" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Complaints Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="font-semibold text-slate-700 text-sm">Complaints & History</h2>
              </div>
              <div className="p-6">
                <ComplaintsForm data={visitComplaint} onChange={setVisitComplaint} />
              </div>
            </div>

            {/* Check-In Action */}
            <div className="flex items-center gap-4 py-2">
               <button 
                 onClick={handleCheckIn}
                 disabled={isSubmitting}
                 className="bg-orange-600 text-white font-bold py-3.5 px-10 text-sm rounded-xl hover:bg-orange-700 transition-all shadow-sm shadow-orange-600/20 disabled:opacity-70 flex items-center gap-2"
               >
                 {isSubmitting ? 'Processing...' : 'Confirm Check-In'}
                 {!isSubmitting && <span>&rarr;</span>}
               </button>
            </div>

            {/* Missed / No-Show Management Section */}
            {selectedAppointment && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                <div className="bg-slate-50/80 p-4 border-b border-slate-100">
                 <h2 className="font-semibold text-slate-700 text-sm">Missed / No-Show Management</h2>
                 <p className="text-xs text-slate-500 mt-1">Update status if patient did not arrive on scheduled follow-up date</p>
              </div>
              
              <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    <button 
                      onClick={() => setMissedAction('reschedule')}
                      className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'reschedule' ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold ring-4 ring-blue-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                       <div className="mb-1">Called - Rescheduled</div>
                       <div className="text-[10px] font-normal opacity-70">Requires new date</div>
                    </button>
                    <button 
                      onClick={() => setMissedAction('no-answer')}
                      className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'no-answer' ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold ring-4 ring-amber-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                       <div className="mb-1">Called - No Answer</div>
                       <div className="text-[10px] font-normal opacity-70">Auto-notes failure</div>
                    </button>
                    <button 
                      onClick={() => setMissedAction('not-called')}
                      className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'not-called' ? 'bg-slate-100 border-slate-300 text-slate-800 font-semibold ring-4 ring-slate-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                       <div className="mb-1">Not Called</div>
                       <div className="text-[10px] font-normal opacity-70">No action taken</div>
                    </button>
                 </div>
                 
                 {(missedAction === 'reschedule' || missedAction === 'no-answer' || missedAction === 'not-called') && (
                     <div className="mt-5 space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                          {missedAction === 'reschedule' && (
                            <div className="space-y-1.5">
                               <label className="text-xs font-medium text-slate-600">New F/U Date</label>
                               <input type="date" value={newFuDate} onChange={(e) => setNewFuDate(e.target.value)} className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all" />
                            </div>
                          )}
                          <div className={`space-y-1.5 ${missedAction !== 'reschedule' ? 'md:col-span-2' : ''}`}>
                             <label className="text-xs font-medium text-slate-600">Internal Note</label>
                             <input type="text" placeholder="Add optional details..." value={missedNote} onChange={(e) => setMissedNote(e.target.value)} className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all" />
                          </div>
                       </div>
                       
                       <div className="flex justify-end pt-2">
                         <button 
                           onClick={handleMissedActionSubmit}
                           disabled={isSubmittingMissed}
                           className="bg-slate-900 text-white font-bold py-3 px-8 text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                         >
                           {isSubmittingMissed ? (
                             <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
                           ) : 'Save Update'}
                         </button>
                       </div>
                     </div>
                 )}
              </div>
            </div>
            )}

          </div>
        )}

      </div>
    </ReceptionLayout>
  );
};

export default CheckInView;
