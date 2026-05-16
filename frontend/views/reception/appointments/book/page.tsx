'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Search,
  Stethoscope, 
  CalendarCheck,
  XCircle,
  Hash,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const BookAppointmentView = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial loads
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
      if (res.data.length > 0) {
        setSelectedDoctorId(res.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load doctors');
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
      setSearchResults(res.data.data || []);
      if (res.data.data?.length === 0) {
        toast.error('No patient found');
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
      // Reset or redirect
      setSelectedPatient(null);
      setSearchQuery('');
      setPurpose('');
      setRemarks('');
      setSelectedSlot(null);
      fetchSlots();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Booking failed');
      fetchSlots();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Helpers
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Book Appointment</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                 <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
                 OPD Scheduling Workflow
              </p>
           </div>
           <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 border border-slate-100">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Slots Available</span>
              </div>
           </div>
        </div>

        {/* 🔷 SECTION 1: PATIENT SELECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                 <User className="w-4 h-4 text-slate-400" />
                 Patient Selection
              </h3>
           </div>
           <div className="p-8">
              {!selectedPatient ? (
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="relative flex-1 group">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                         <input 
                           type="text" 
                           className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[13px] font-black outline-none focus:border-teal-600 focus:bg-white transition-all uppercase"
                           placeholder="SEARCH PATIENT BY MRD, NAME OR MOBILE..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                         />
                      </div>
                      <button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-10 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                         {isSearching ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
                         Search
                      </button>
                   </div>

                   {searchResults.length > 0 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {searchResults.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:border-teal-600 hover:bg-white cursor-pointer transition-all group"
                          >
                             <h4 className="text-sm font-black text-slate-800 uppercase group-hover:text-teal-700">{p.firstName} {p.lastName}</h4>
                             <p className="text-[10px] font-bold text-slate-500 mt-1">{p.mrdNumber} | {p.mobile}</p>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-teal-50/50 p-8 rounded-3xl border border-teal-100 border-dashed">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                         <User className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-teal-600/60 uppercase tracking-widest mb-1.5">Active Subject</p>
                         <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedPatient.firstName} {selectedPatient.lastName}</h4>
                         <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-100">{selectedPatient.mrdNumber}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{selectedPatient.gender} | {selectedPatient.mobile}</span>
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedPatient(null)}
                     className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm flex items-center gap-2"
                   >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Change Patient
                   </button>
                </div>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           <div className="space-y-10">
              {/* 🔷 SECTION 2: APPOINTMENT DETAILS FORM */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Clinical Context</h3>
                 </div>
                 <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Date</label>
                          <div className="relative">
                             <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input type="text" readOnly value={format(selectedDate, 'dd MMMM yyyy')} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black outline-none" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Slot</label>
                          <div className="relative">
                             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input type="text" readOnly value={selectedSlot || '--:--'} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black text-teal-700 outline-none placeholder:text-slate-300" placeholder="PICK FROM RIGHT" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Consultant *</label>
                       <div className="grid grid-cols-1 gap-3">
                          {doctors.map(doc => (
                            <button 
                            key={doc.id}
                            onClick={() => setSelectedDoctorId(doc.id)}
                              disabled={isSubmitting}
                              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedDoctorId === doc.id ? 'bg-teal-50 border-teal-600' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                            >
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${selectedDoctorId === doc.id ? 'bg-teal-600 text-white' : 'bg-white text-slate-400'}`}>
                                     {doc.user.name.charAt(0)}
                                  </div>
                                  <div className="text-left">
                                     <p className={`text-[11px] font-black uppercase tracking-tight leading-none mb-1 ${selectedDoctorId === doc.id ? 'text-teal-700' : 'text-slate-700'}`}>DR. {doc.user.name.toUpperCase()}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.specialization || 'Consultant'}</p>
                                  </div>
                               </div>
                               {selectedDoctorId === doc.id && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose of Visit *</label>
                       <input 
                         type="text" 
                         value={purpose}
                         onChange={(e) => setPurpose(e.target.value)}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" 
                         placeholder="e.g. Regular Follow-up, Chest Pain, etc." 
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Remarks</label>
                       <textarea 
                         rows={2} 
                         value={remarks}
                         onChange={(e) => setRemarks(e.target.value)}
                         className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-[13px] font-bold outline-none focus:border-teal-600 focus:bg-white transition-all resize-none" 
                         placeholder="Any specific instructions..."
                       ></textarea>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-10">
              {/* 🔷 SECTION 3: DATE & TIME PICKER */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <CalendarIcon className="w-4 h-4 text-slate-400" />
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Availability Matrix</h3>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                         className="p-2 hover:bg-slate-200 rounded-xl transition-colors bg-white border border-slate-100"
                       >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                       </button>
                       <button 
                         onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                         className="p-2 hover:bg-slate-200 rounded-xl transition-colors bg-white border border-slate-100"
                       >
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                       </button>
                    </div>
                 </div>
                 
                 <div className="p-8 space-y-10">
                    {/* Calendar View */}
                    <div className="space-y-6">
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] text-center mb-8">
                          {format(currentMonth, 'MMMM yyyy')}
                       </h4>
                       
                       <div className="grid grid-cols-7 gap-2 text-center">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                            <div key={d} className="text-[10px] font-black text-slate-400 uppercase py-2 tracking-widest">{d}</div>
                          ))}
                          {daysInMonth.map((day, idx) => {
                            const isPast = isBefore(day, startOfDay(new Date()));
                            const isSelected = isSameDay(selectedDate, day);
                            return (
                              <button 
                                key={idx} 
                                disabled={isPast}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                  aspect-square flex items-center justify-center rounded-2xl text-[11px] font-black transition-all border-2
                                  ${isPast ? 'bg-slate-50 text-slate-200 border-transparent cursor-not-allowed' : 'hover:border-teal-500 hover:text-teal-600'}
                                  ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-110 z-10' : 'bg-white text-slate-600 border-slate-50'}
                                  ${isToday(day) && !isSelected ? 'text-teal-600 border-teal-100 bg-teal-50/30' : ''}
                                `}
                              >
                                {format(day, 'd')}
                              </button>
                            );
                          })}
                       </div>
                    </div>

                    {/* Time Slots Panel */}
                    <div className="pt-8 border-t border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          Time Allocation — {format(selectedDate, 'do MMM')}
                       </p>
                       
                       {isLoading ? (
                         <div className="flex items-center justify-center py-10">
                            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                         </div>
                       ) : availableSlots.length === 0 ? (
                         <div className="py-10 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No slots defined for this day</p>
                         </div>
                       ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 custom-scrollbar">
                            {availableSlots.map((slot, i) => (
                              <button 
                                key={i}
                                disabled={slot.status === 'booked' || isSubmitting}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`
                                  py-4 rounded-2xl border-2 text-[11px] font-black transition-all uppercase tracking-widest
                                  ${slot.status === 'booked' 
                                     ? 'bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed line-through' 
                                     : selectedSlot === slot.time
                                       ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100'
                                       : 'bg-white border-slate-50 text-slate-600 hover:border-teal-200 hover:bg-teal-50/50'
                                  }
                                `}
                              >
                                 {slot.time}
                              </button>
                            ))}
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-6">
                 <button 
                   onClick={handleBook}
                   disabled={isSubmitting || !selectedSlot || !selectedPatient}
                   className="w-full flex items-center justify-center gap-4 py-6 bg-teal-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-2xl shadow-teal-100 group disabled:opacity-50 disabled:shadow-none"
                 >
                   {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CalendarCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Confirm Booking
                      </>
                    )}
                 </button>
                 <button 
                   onClick={() => setSelectedPatient(null)}
                   className="w-full py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all"
                 >
                    Discard Changes
                 </button>
              </div>
              
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                 <Info className="w-3.5 h-3.5 text-teal-500" />
                 Patient will receive booking confirmation via SMS instantly.
              </p>
           </div>
        </div>
      </div>

    </ReceptionLayout>
  );
};

export default BookAppointmentView;
