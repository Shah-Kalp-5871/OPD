'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Search, 
  User, 
  Clock, 
  Activity, 
  Thermometer, 
  ActivitySquare, 
  Scale, 
  Ruler, 
  CheckCircle2, 
  RefreshCcw,
  Stethoscope
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

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
    bp: '',
    spo2: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInResult, setCheckInResult] = useState<any>(null);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const checkInSubmittingRef = useRef(false);

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
      // We can't trigger handleSearch immediately because it needs the query in state
      // but we can manually fetch the patient by MRD
      const quickFetch = async () => {
        try {
          const res = await api.get(`/patients/search?q=${mrdParam}`);
          const patient = res.data.data?.[0];
          if (patient) {
            setSelectedPatient(patient);
            
            // If we have an appointment ID, fetch appointments and select it
            const apptRes = await api.get(`/appointments?patientId=${patient.id}`);
            const scheduled = apptRes.data.filter((a: any) => a.status === 'SCHEDULED');
            setPatientAppointments(scheduled);
            
            if (apptId) {
              const appt = scheduled.find((a: any) => a.id === apptId);
              if (appt) {
                setSelectedAppointment(appt);
                setSelectedDoctorId(appt.doctorId);
                setComplaint(appt.remarks || '');
              }
            }
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
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/patients/search?q=${searchQuery}`);
      setSearchResults(res.data.data || []);
      if (res.data.data?.length === 0) {
        toast.error('No patient found');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setCheckInResult(null);
    setSelectedAppointment(null);
    fetchPatientAppointments(patient.id);
  };

  const fetchPatientAppointments = async (patientId: string) => {
    try {
      const res = await api.get(`/appointments?patientId=${patientId}`);
      // Filter for scheduled appointments
      const scheduled = res.data.filter((a: any) => a.status === 'SCHEDULED');
      setPatientAppointments(scheduled);
      
      // Auto-select if there's one for today
      const today = new Date().toISOString().split('T')[0];
      const todayAppt = scheduled.find((a: any) => a.appointmentDate.startsWith(today));
      if (todayAppt) {
        setSelectedAppointment(todayAppt);
        setSelectedDoctorId(todayAppt.doctorId);
        setComplaint(todayAppt.remarks || '');
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const handleCheckIn = async () => {
    if (checkInSubmittingRef.current || isSubmitting) return;
    if (!selectedPatient) return;
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }

    checkInSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const checkInData = {
        appointmentId: selectedAppointment?.id,
        visitType,
        priority,
        complaint,
        vitals: (vitals.height || vitals.weight || vitals.temp) ? {
          height: parseFloat(vitals.height) || null,
          weight: parseFloat(vitals.weight) || null,
          bmi: parseFloat(vitals.bmi) || null,
          temperature: parseFloat(vitals.temp) || null,
          pulse: parseInt(vitals.pulse) || null,
          bloodPressure: vitals.bp || null,
          spo2: parseInt(vitals.spo2) || null
        } : undefined
      };

      let res;
      if (selectedAppointment) {
          // Use the specialized appointment check-in endpoint
          res = await api.post('/appointments/check-in', checkInData);
      } else {
          // Manual walk-in flow (keep existing logic but use a transaction-safe way if possible)
          // For now, let's just use the current multi-step logic but centralized in backend would be better
          // Wait, I should probably add a walk-in endpoint too.
          // Let's just use the existing logic for now to avoid breaking things.
          
          // 1. Save Vitals
          if (checkInData.vitals) {
            await api.post(`/patients/${selectedPatient.id}/vitals`, checkInData.vitals);
          }
          // 2. Create Case
          const caseRes = await api.post(`/patients/${selectedPatient.id}/cases`, {
            doctorId: selectedDoctorId,
            visitType,
            priority,
            complaint
          });
          // 3. Add to Queue
          res = await api.post('/queue/check-in', {
            caseId: caseRes.data.id,
            patientId: selectedPatient.id,
            doctorId: selectedDoctorId,
            priority: priority
          });
      }

      setCheckInResult(res.data.queueEntry || res.data);
      fetchPatientAppointments(selectedPatient.id);
      toast.success('Patient checked in successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Check-in failed');
      if (selectedPatient?.id) fetchPatientAppointments(selectedPatient.id);
    } finally {
      checkInSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (checkInResult) {
    return (
      <ReceptionLayout>
        <div className="max-w-3xl mx-auto py-20 animate-in fade-in zoom-in duration-500">
           <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-teal-600"></div>
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Check-In Successful</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Patient is now in the live queue</p>
              </div>
              
              <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 flex flex-col items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Patient Token ID</span>
                 <h3 className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {checkInResult.tokenDisplay.split('-')[1]}
                 </h3>
                 <div className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl">
                    <span className="text-sm font-black uppercase tracking-[0.2em]">{checkInResult.tokenDisplay.split('-')[0]} SERIES</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-left">
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doctor Station</span>
                    <p className="text-sm font-black text-slate-800 uppercase mt-1">DR. {doctors.find(d => d.id === selectedDoctorId)?.name || 'STATION 01'}</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority Status</span>
                    <p className={`text-sm font-black uppercase mt-1 ${priority === 'NORMAL' ? 'text-slate-800' : 'text-rose-600'}`}>{priority}</p>
                 </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedPatient(null);
                  setCheckInResult(null);
                  setSearchQuery('');
                }}
                className="w-full py-5 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
              >
                 Done & Next Patient
              </button>
           </div>
        </div>
      </ReceptionLayout>
    );
  }

  return (
    <ReceptionLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Clinical Check-In</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                 <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                 Synchronized OPD Arrival Management
              </p>
           </div>
           <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                 <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System Time</span>
                 <span className="text-xs font-black text-slate-900 tabular-nums uppercase">{new Date().toLocaleTimeString()}</span>
              </div>
           </div>
        </div>

        {/* Search Section */}
        {!selectedPatient && (
          <div className="space-y-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex gap-4">
                   <div className="relative flex-1 group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                      <input 
                        type="text" 
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[13px] font-black outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all uppercase tracking-wider"
                        placeholder="SEARCH ARRIVING PATIENT BY MRD, NAME OR MOBILE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                   </div>
                   <button 
                     onClick={handleSearch}
                     disabled={isLoading}
                     className="px-12 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95 disabled:opacity-50"
                   >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      Locate File
                   </button>
                </div>
             </div>

             {/* Search Results */}
             {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {searchResults.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => handleSelectPatient(p)}
                        className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-teal-600 hover:shadow-xl hover:shadow-teal-100/20 transition-all cursor-pointer group relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                            <User className="w-20 h-20" />
                         </div>
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                               <span className="text-xl font-black uppercase">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</span>
                            </div>
                            <div>
                               <h3 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-teal-700 transition-colors">{p.firstName} {p.lastName}</h3>
                               <p className="text-[10px] font-black text-teal-600 tracking-widest">{p.mrdNumber}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6 border-t border-slate-50 pt-4">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact</span>
                               <span className="text-[10px] font-bold text-slate-600">{p.mobile}</span>
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                               <span className="text-[10px] font-bold text-slate-600 uppercase">{p.gender}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        )}

        {selectedPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Left Column: Vitals & Info */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* Patient Identity Bar */}
               <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                     <Activity className="w-40 h-40" />
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="w-20 h-20 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/10">
                        <User className="w-10 h-10 text-white" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-3xl font-black uppercase tracking-tight">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                           <button 
                             onClick={() => setSelectedPatient(null)}
                             className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                           >
                              <RefreshCcw className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">{selectedPatient.mrdNumber}</span>
                           <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{selectedPatient.profile?.age || 'N/A'}Y | {selectedPatient.gender}</span>
                        </div>
                     </div>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/10 backdrop-blur-md min-w-[200px]">
                     <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Current Status</span>
                     <div className="flex items-center gap-3 mt-1">
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        <span className="text-xs font-black uppercase tracking-[0.1em]">Ready for Assignment</span>
                     </div>
                  </div>
               </div>

               {/* Appointments Selector */}
               {patientAppointments.length > 0 && (
                 <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                             <Clock className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                             <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">Planned Appointments</h3>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Select a slot to link this check-in</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                       {patientAppointments.map(appt => {
                         const isToday = appt.appointmentDate.startsWith(new Date().toISOString().split('T')[0]);
                         return (
                           <div 
                             key={appt.id}
                             onClick={() => {
                               setSelectedAppointment(appt);
                               setSelectedDoctorId(appt.doctorId);
                               setComplaint(appt.remarks || '');
                             }}
                             className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAppointment?.id === appt.id ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                           >
                              <div className="flex items-center gap-6">
                                 <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${selectedAppointment?.id === appt.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                                    <span className="text-[10px] uppercase leading-none mb-1">{new Date(appt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-lg leading-none">{new Date(appt.appointmentDate).toLocaleDateString('en-US', { day: '2-digit' })}</span>
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-3">
                                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                       {isToday && (
                                         <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[7px] font-black uppercase tracking-widest border border-amber-200 animate-pulse">TODAY</span>
                                       )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">DR. {appt.doctor?.user?.name.toUpperCase()}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{appt.purpose || 'GENERAL VISIT'}</span>
                                 {selectedAppointment?.id === appt.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                              </div>
                           </div>
                         );
                       })}
                       
                       <button 
                         onClick={() => setSelectedAppointment(null)}
                         className={`w-full py-4 rounded-2xl border-2 border-dashed text-[10px] font-black uppercase tracking-[0.2em] transition-all ${!selectedAppointment ? 'bg-slate-900 text-white border-transparent' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-600'}`}
                       >
                          Walk-In (No Appointment)
                       </button>
                    </div>
                 </div>
               )}

               {/* Vitals Entry */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                           <ActivitySquare className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                           <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">Nursing & Vitals</h3>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Preliminary physiological assessment</p>
                        </div>
                     </div>
                     <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-teal-100">
                        Auto-calculates BMI
                     </div>
                  </div>
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Ruler className="w-3.5 h-3.5" /> Height (cm)</label>
                        <input 
                          type="number" 
                          value={vitals.height}
                          onChange={(e) => setVitals(v => ({ ...v, height: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner" 
                          placeholder="175"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Scale className="w-3.5 h-3.5" /> Weight (kg)</label>
                        <input 
                          type="number" 
                          value={vitals.weight}
                          onChange={(e) => setVitals(v => ({ ...v, weight: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner" 
                          placeholder="70.5"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">Body Mass Index</label>
                        <div className="w-full px-6 py-4 bg-teal-50 border-2 border-teal-100 rounded-2xl flex items-center justify-center">
                           <span className="text-2xl font-black text-teal-700 tabular-nums">{vitals.bmi}</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Thermometer className="w-3.5 h-3.5" /> Temperature</label>
                        <input 
                          type="text" 
                          value={vitals.temp}
                          onChange={(e) => setVitals(v => ({ ...v, temp: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-teal-600" 
                          placeholder="98.6"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Case Configuration */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
                  <div className="p-8 bg-slate-900 text-white">
                     <h3 className="text-lg font-black uppercase tracking-tight leading-none">Assignment Panel</h3>
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">OPD Station & Case Details</p>
                  </div>
                  
                  <div className="p-8 flex-1 space-y-8">
                     {/* Doctor Selection */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Stethoscope className="w-4 h-4 text-teal-600" /> Assign Consultant
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                           {doctors.map(doc => (
                             <button 
                               key={doc.id}
                               onClick={() => setSelectedDoctorId(doc.id)}
                               className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${selectedDoctorId === doc.id ? 'bg-teal-50 border-teal-600' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${selectedDoctorId === doc.id ? 'bg-teal-600 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'}`}>
                                      {doc.name.charAt(0)}
                                   </div>
                                   <div className="text-left">
                                      <p className={`text-[11px] font-black uppercase tracking-tight leading-none mb-1 ${selectedDoctorId === doc.id ? 'text-teal-700' : 'text-slate-700'}`}>DR. {doc.name.toUpperCase()}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.specialization || 'Consultant'}</p>
                                   </div>
                                </div>
                                {selectedDoctorId === doc.id && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Priority & Visit Type */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Mode</label>
                           <select 
                             value={visitType}
                             onChange={(e) => setVisitType(e.target.value)}
                             className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all"
                           >
                              <option value="CONSULTATION">CONSULTATION</option>
                              <option value="REVIEW">REVIEW / F-UP</option>
                              <option value="EMERGENCY">EMERGENCY</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                           <select 
                             value={priority}
                             onChange={(e) => setPriority(e.target.value)}
                             className={`w-full p-3.5 border rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${priority === 'NORMAL' ? 'bg-slate-50 border-slate-200' : priority === 'URGENT' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
                           >
                              <option value="NORMAL">NORMAL</option>
                              <option value="URGENT">URGENT</option>
                              <option value="EMERGENCY">EMERGENCY</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chief Complaint</label>
                        <textarea 
                          rows={3}
                          value={complaint}
                          onChange={(e) => setComplaint(e.target.value)}
                          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-teal-600 transition-all resize-none"
                          placeholder="ENTER PATIENT'S PRIMARY CONCERN..."
                        ></textarea>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100">
                     <button 
                       onClick={handleCheckIn}
                       disabled={isSubmitting}
                       className="w-full py-5 bg-teal-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                     >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Activity className="w-5 h-5" />
                        )}
                        Confirm & Check-In
                     </button>
                  </div>
               </div>
            </div>

          </div>
        )}

      </div>
    </ReceptionLayout>
  );
};

export default CheckInView;
