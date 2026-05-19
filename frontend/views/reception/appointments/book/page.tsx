'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  CalendarCheck,
  User,
  Clock,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format } from 'date-fns';
import { PatientSelectionStep } from './components/PatientSelectionStep';
import { AppointmentBookingStep } from './components/AppointmentBookingStep';

const BookAppointmentView = () => {
  // Wizard Step State: 1 = Patient Selection, 2 = Appointment Details
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

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

  // Initial Loads
  useEffect(() => {
    fetchDoctors();
    fetchRecentPatients();
  }, []);

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

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
      if (res.data.length > 0) {
        setSelectedDoctorId(res.data[0].doctorProfile?.id || res.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

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
      await api.post('/appointments', {
        patientId: selectedPatient.id,
        doctorId: selectedDoctorId,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedSlot,
        purpose,
        remarks
      });
      toast.success('Appointment booked successfully!');
      
      // Reset flow
      setSelectedPatient(null);
      setSearchQuery('');
      setPurpose('');
      setRemarks('');
      setSelectedSlot(null);
      setCurrentStep(1); // Return back to first step
      fetchSlots();
      fetchRecentPatients();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Booking failed');
      fetchSlots();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6">
        
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Book Appointment</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-1.5">
                 <CalendarCheck className="w-3 h-3 text-teal-600" />
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
                 currentStep === 1 ? 'bg-teal-600 text-white' :
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
                 currentStep === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'
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
    </ReceptionLayout>
  );
};

export default BookAppointmentView;
