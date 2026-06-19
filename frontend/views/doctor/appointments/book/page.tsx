'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import { 
  CalendarCheck,
  User,
  Clock,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { PatientSelectionStep } from './components/PatientSelectionStep';
import { useAuthStore } from '@/store/authStore';

const MySwal = withReactContent(Swal);
import { AppointmentBookingStep } from './components/AppointmentBookingStep';

const BookAppointmentView = () => {
  // Wizard Step State: 1 = Patient Selection, 2 = Appointment Details
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryPatientId = searchParams.get('patientId');

  // Shared Form & Query States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore(state => state.user);
  const isDoctor = user?.role?.toUpperCase() === 'DOCTOR';

  // Initial Loads
  useEffect(() => {
    if (user?.id) {
      setSelectedDoctorId(user.id);
    }
    fetchRecentPatients();
  }, [user]);

  // Auto-select patient from query param
  useEffect(() => {
    if (queryPatientId) {
      const fetchPatientFromQuery = async () => {
        try {
          const res = await api.get(`/patients/${queryPatientId}`);
          setSelectedPatient(res.data);
          setCurrentStep(2);
        } catch (error) {
          console.error('Failed to load patient from query:', error);
        }
      };
      fetchPatientFromQuery();
    }
  }, [queryPatientId]);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  // Reset search results when query is cleared
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);




  const fetchRecentPatients = async () => {
    setIsRecentLoading(true);
    try {
      const res = await api.get('/patients/search?limit=12');
      const data = res.data || res;
      setRecentPatients(data.items || []);
    } catch (error) {
      console.error('Failed to load recent patients', error);
    } finally {
      setIsRecentLoading(false);
    }
  };

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/appointments/slots`, {
        params: {
          doctorId: selectedDoctorId,
          date: format(selectedDate, 'yyyy-MM-dd')
        }
      });
      setAvailableSlots(res.data);
      setSelectedSlot(null);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.get(`/patients/search?q=${searchQuery}`);
      const data = res.data || res;
      const items = data.items || [];
      setSearchResults(items);
      if (items.length === 0) {
        toast.error('No patient found in database');
      } else {
        toast.success(`Found ${items.length} matching patients`);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBook = async () => {
    if (isSubmitting) return;

    if (!selectedPatient || !selectedDoctorId || !selectedSlot) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        patientId: selectedPatient.id,
        doctorId: selectedDoctorId,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedSlot,
        purpose,
        remarks
      });
      
      const createdData = res.data;
      const caseNumber = createdData.patientCase?.caseNumber || 'Pending';
      const patientName = `${createdData.patient.firstName} ${createdData.patient.lastName}`;
      const docName = createdData.doctor.user.name ? `Dr. ${createdData.doctor.user.name}` : `Dr. ${[createdData.doctor.user.firstName, createdData.doctor.user.lastName].filter(Boolean).join(' ') || 'Unknown'}`;
      
      MySwal.fire({
        html: `
          <div class="flex flex-col items-center pt-2">
            <div class="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-5 ring-8 ring-sky-50">
              <svg class="w-8 h-8 text-[#0d6282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-800 mb-6 tracking-tight">Booking Confirmed!</h2>
            
            <div class="w-full bg-slate-50/80 rounded-2xl p-5 space-y-4 text-left border border-slate-100">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-400 border border-slate-100">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Patient</p>
                  <p class="text-sm font-bold text-slate-700">${patientName}</p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-sky-400 border border-slate-100">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Doctor</p>
                  <p class="text-sm font-bold text-slate-700">${docName}</p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-400 border border-slate-100">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-black text-slate-400 tracking-wider">Date & Time</p>
                  <p class="text-sm font-bold text-slate-700">${format(new Date(createdData.appointmentDate), 'PP')} at ${format(new Date(createdData.appointmentTime), 'p')}</p>
                </div>
              </div>
            </div>

            <div class="w-full bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-200 p-5 rounded-2xl mt-5 text-center shadow-[inset_0_2px_10px_rgba(20,184,166,0.05)]">
              <p class="text-[10px] uppercase font-black tracking-widest text-[#0d6282]/80 mb-2 flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Generated Case ID
              </p>
              <p class="text-3xl font-black text-orange-900 tracking-wider drop-shadow-sm">${caseNumber}</p>
            </div>
            
            <div class="mt-5 flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200">
              <svg class="w-4 h-4 text-[#107ca3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Confirmation SMS has been sent
            </div>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Done',
        customClass: {
          container: 'font-sans',
          popup: 'rounded-[2rem] p-4 md:p-6 shadow-2xl border border-slate-100',
          confirmButton: 'bg-[#0d6282] text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-2xl w-full mt-4 hover:bg-[#0a4b63] transition-all shadow-lg shadow-[#107ca3]/20 active:scale-[0.98]',
        },
        buttonsStyling: false,
        width: '420px',
        showCloseButton: true,
        closeButtonHtml: '<span class="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</span>'
      }).then(() => {
        if (selectedPatient) {
          router.push(`/doctor/patients/${selectedPatient.id}`);
        } else {
          // Reset flow
          setSelectedPatient(null);
          setSearchQuery('');
          setPurpose('');
          setRemarks('');
          setSelectedSlot(null);
          setCurrentStep(1); // Return back to first step
          fetchSlots();
          fetchRecentPatients();
        }
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Booking failed');
      fetchSlots();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 pb-20 px-6">
        
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Book Appointment</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-1.5">
                 <CalendarCheck className="w-3 h-3 text-[#0d6282]" />
                 OPD Scheduling Workflow
              </p>
           </div>
           
           {/* Step Wizard Indicator */}
           <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
             {/* Step 1 */}
             <button
               onClick={() => setCurrentStep(1)}
               className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                 currentStep === 1
                   ? 'bg-white text-slate-900 shadow-sm'
                   : selectedPatient
                     ? 'text-emerald-600 hover:bg-white/60'
                     : 'text-slate-400 hover:bg-white/60'
               }`}
             >
               <div className={`w-5 h-5 rounded-lg text-[9px] font-black flex items-center justify-center shrink-0 ${
                 currentStep === 1 ? 'bg-[#0d6282] text-white' :
                 selectedPatient ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
               }`}>
                 {selectedPatient ? <Check className="w-3 h-3" /> : '1'}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Select Patient</span>
             </button>

             {/* Connector */}
             <div className="w-4 h-px bg-slate-200 mx-0.5 shrink-0" />

             {/* Step 2 */}
             <button
               onClick={() => selectedPatient && setCurrentStep(2)}
               disabled={!selectedPatient}
               className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                 currentStep === 2
                   ? 'bg-white text-slate-900 shadow-sm'
                   : 'text-slate-400 hover:bg-white/60'
               }`}
             >
               <div className={`w-5 h-5 rounded-lg text-[9px] font-black flex items-center justify-center shrink-0 ${
                 currentStep === 2 ? 'bg-[#0d6282] text-white' : 'bg-slate-200 text-slate-400'
               }`}>
                 2
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Booking</span>
             </button>
           </div>
        </div>

        {/* 🔷 Wizard Step Switcher */}
        {currentStep === 1 ? (
          <PatientSelectionStep 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            recentPatients={recentPatients}
            isRecentLoading={isRecentLoading}
            isSearching={isSearching}
            handleSearch={handleSearch}
            setSelectedPatient={(p) => {
              setSelectedPatient(p);
              toast.success(`Selected: ${p.firstName} ${p.lastName}`);
            }}
            onNextStep={() => setCurrentStep(2)}
          />
        ) : (
          <AppointmentBookingStep 
            selectedPatient={selectedPatient}
            doctors={doctors}
            selectedDoctorId={selectedDoctorId}
            setSelectedDoctorId={setSelectedDoctorId}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            purpose={purpose}
            setPurpose={setPurpose}
            remarks={remarks}
            setRemarks={setRemarks}
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            handleBook={handleBook}
            onPrevStep={() => setCurrentStep(1)}
          />
        )}

      </div>
    </DoctorLayout>
  );
};

export default BookAppointmentView;
