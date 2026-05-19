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
  Hash,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCcw,
  Sunrise,
  Sun,
  Sunset,
  Users,
  Check,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const BookAppointmentView = () => {
  // State
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

  // Initial loads
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
      // Reset or redirect
      setSelectedPatient(null);
      setSearchQuery('');
      setPurpose('');
      setRemarks('');
      setSelectedSlot(null);
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

  // Calendar Helpers
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Local filter for bottom directory
  const filteredRecentPatients = searchQuery.trim() === ''
    ? recentPatients
    : recentPatients.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mobile.includes(searchQuery)
      );

  // Group slots by Morning, Afternoon, Evening
  const morningSlots = availableSlots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });
  
  const afternoonSlots = availableSlots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 16;
  });
  
  const eveningSlots = availableSlots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 16;
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
              {selectedPatient && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                   <Check className="w-3 h-3" /> Selected
                </span>
              )}
           </div>
           <div className="p-8">
              {!selectedPatient ? (
                <div className="space-y-8">
                   <div className="flex gap-4">
                      <div className="relative flex-1 group">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                         <input 
                           type="text" 
                           className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[13px] font-black outline-none focus:border-teal-600 focus:bg-white transition-all uppercase"
                           placeholder="Type MRD, Name or Mobile to instantly filter bottom list, or press Enter to query database..."
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
                         Search Registry
                      </button>
                   </div>

                   {/* Main Patient Directory / Recent Patients */}
                   <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-teal-600" />
                            {searchResults.length > 0 ? 'Search Results' : searchQuery.trim() !== '' ? 'Matching Directory Patients' : 'Quick Access Patient Directory'}
                         </h4>
                         <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {searchResults.length > 0 ? `${searchResults.length} found` : `${filteredRecentPatients.length} active`}
                         </span>
                      </div>

                      {isRecentLoading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                               <div key={i} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 animate-pulse h-[80px]"></div>
                            ))}
                         </div>
                      ) : (searchResults.length > 0 ? searchResults : filteredRecentPatients).length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(searchResults.length > 0 ? searchResults : filteredRecentPatients).map(p => (
                              <div 
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:border-teal-500 hover:bg-white hover:shadow-md hover:shadow-slate-100 cursor-pointer transition-all duration-300 group flex items-center justify-between"
                              >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 text-slate-500 font-black text-xs uppercase flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                       {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                    </div>
                                    <div>
                                       <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-teal-700">{p.firstName} {p.lastName}</h4>
                                       <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{p.mrdNumber} | {p.mobile}</p>
                                    </div>
                                 </div>
                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-50 p-2 rounded-lg text-teal-600">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                 </div>
                              </div>
                            ))}
                         </div>
                      ) : (
                         <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching patients found</p>
                            <p className="text-[9px] font-bold text-slate-300 mt-1.5 uppercase">Try searching the database or register a new patient first.</p>
                         </div>
                      )}
                   </div>
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
                          {doctors.map(doc => {
                             const profileId = doc.doctorProfile?.id || doc.id;
                             return (
                            <button 
                            key={doc.id}
                            onClick={() => setSelectedDoctorId(profileId)}
                              disabled={isSubmitting}
                              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedDoctorId === profileId ? 'bg-teal-50 border-teal-600 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-slate-50/70'}`}
                            >
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${selectedDoctorId === profileId ? 'bg-teal-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                     {(doc.name || doc.user?.name || '').charAt(0)}
                                  </div>
                                  <div className="text-left">
                                     <p className={`text-[11px] font-black uppercase tracking-tight leading-none mb-1.5 ${selectedDoctorId === profileId ? 'text-teal-700' : 'text-slate-700'}`}>DR. {(doc.name || doc.user?.name || '').toUpperCase()}</p>
                                     <span className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                         {(doc.doctorProfile?.specialization || doc.specialization) || 'Consultant'}
                                     </span>
                                  </div>
                               </div>
                               {selectedDoctorId === profileId && <CheckCircle2 className="w-5 h-5 text-teal-600 animate-in fade-in zoom-in-50 duration-200" />}
                            </button>
                             );
                          })}
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
                         className="p-2 hover:bg-slate-200 rounded-xl transition-colors bg-white border border-slate-100 shadow-sm"
                       >
                          <ChevronLeft className="w-4 h-4 text-slate-600" />
                       </button>
                       <button 
                         onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                         className="p-2 hover:bg-slate-200 rounded-xl transition-colors bg-white border border-slate-100 shadow-sm"
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

                    {/* Grouped Time Slots Panel */}
                    <div className="pt-8 border-t border-slate-100 space-y-8">
                       <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5 text-teal-600" />
                             Time Slots — {format(selectedDate, 'do MMM')}
                          </p>
                          <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                             {availableSlots.length} Total Slots
                          </span>
                       </div>
                       
                       {isLoading ? (
                          <div className="flex items-center justify-center py-10">
                             <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                          </div>
                       ) : availableSlots.length === 0 ? (
                          <div className="py-10 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No slots defined for this day</p>
                          </div>
                       ) : (
                          <div className="space-y-6">
                             
                             {/* 🌅 MORNING SLOTS */}
                             <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-1">
                                   <Sunrise className="w-4 h-4 text-amber-500" />
                                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Morning Sessions</span>
                                   <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {morningSlots.length} available
                                   </span>
                                </div>
                                {morningSlots.length === 0 ? (
                                   <p className="text-[10px] text-slate-400 italic">No morning slots available</p>
                                ) : (
                                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                      {morningSlots.map((slot, i) => (
                                         <button 
                                           key={i}
                                           disabled={slot.status === 'booked' || isSubmitting}
                                           onClick={() => setSelectedSlot(slot.time)}
                                           className={`
                                             py-3.5 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest
                                             ${slot.status === 'booked' 
                                                ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed line-through' 
                                                : selectedSlot === slot.time
                                                  ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                                                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/20'
                                             }
                                           `}
                                         >
                                            {slot.time}
                                         </button>
                                      ))}
                                   </div>
                                )}
                             </div>

                             {/* ☀️ AFTERNOON SLOTS */}
                             <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 pb-1">
                                   <Sun className="w-4 h-4 text-orange-500" />
                                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Afternoon Sessions</span>
                                   <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {afternoonSlots.length} available
                                   </span>
                                </div>
                                {afternoonSlots.length === 0 ? (
                                   <p className="text-[10px] text-slate-400 italic">No afternoon slots available</p>
                                ) : (
                                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                      {afternoonSlots.map((slot, i) => (
                                         <button 
                                           key={i}
                                           disabled={slot.status === 'booked' || isSubmitting}
                                           onClick={() => setSelectedSlot(slot.time)}
                                           className={`
                                             py-3.5 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest
                                             ${slot.status === 'booked' 
                                                ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed line-through' 
                                                : selectedSlot === slot.time
                                                  ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                                                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/20'
                                             }
                                           `}
                                         >
                                            {slot.time}
                                         </button>
                                      ))}
                                   </div>
                                )}
                             </div>

                             {/* 🌇 EVENING SLOTS */}
                             <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 pb-1">
                                   <Sunset className="w-4 h-4 text-indigo-500" />
                                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Evening Sessions</span>
                                   <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {eveningSlots.length} available
                                   </span>
                                </div>
                                {eveningSlots.length === 0 ? (
                                   <p className="text-[10px] text-slate-400 italic">No evening slots available</p>
                                ) : (
                                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                      {eveningSlots.map((slot, i) => (
                                         <button 
                                           key={i}
                                           disabled={slot.status === 'booked' || isSubmitting}
                                           onClick={() => setSelectedSlot(slot.time)}
                                           className={`
                                             py-3.5 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest
                                             ${slot.status === 'booked' 
                                                ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed line-through' 
                                                : selectedSlot === slot.time
                                                  ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                                                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/20'
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
