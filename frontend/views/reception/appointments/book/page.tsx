'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  UserPlus, 
  Stethoscope, 
  ClipboardList, 
  CreditCard, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarCheck,
  XCircle,
  Hash
} from 'lucide-react';

const BookAppointmentView = () => {
  const [selectedDate, setSelectedDate] = useState(13); // Default to 13th April 2026
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientCategory, setPatientCategory] = useState('Payment');
  const [caseId] = useState('C001-009-130426'); // UI Simulation

  const timeSlots = [
    { time: '09:00', status: 'Booked' },
    { time: '09:10', status: 'Booked' },
    { time: '09:20', status: 'Available' },
    { time: '09:30', status: 'Available' },
    { time: '09:40', status: 'Booked' },
    { time: '09:50', status: 'Available' },
    { time: '10:00', status: 'Available' },
  ];

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const holidays = [6, 7, 20, 27]; // Simulated Sundays/Holidays

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Book Appointment</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                 <CalendarCheck className="w-3.5 h-3.5 text-teal-500" />
                 OPD Scheduling Workflow
              </p>
           </div>
           <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 border border-slate-100">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Slots Available</span>
              </div>
           </div>
        </div>

        {/* 🔷 SECTION 1: PATIENT SELECTION */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                 <User className="w-4 h-4 text-slate-400" />
                 Patient Selection
              </h3>
           </div>
           <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 border-dashed">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-300">
                       <User className="w-8 h-8" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selected Patient</p>
                       <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">RAMESHBHAI MANUBHAI PATEL</h4>
                       <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <span>MRD: P03-260001</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>Age/Gender: 35M</span>
                       </div>
                    </div>
                 </div>
                 <button className="px-6 py-3 bg-white border border-slate-200 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-300 hover:bg-teal-50 transition-all shadow-sm">
                    Change Patient
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           <div className="space-y-10">
              {/* 🔷 SECTION 2: APPOINTMENT DETAILS FORM */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Appointment Details</h3>
                 </div>
                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Appointment Date *</label>
                          <div className="relative">
                             <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input type="text" readOnly value={`${selectedDate} April 2026`} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Appointment Time (Auto) *</label>
                          <div className="relative">
                             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input type="text" readOnly value={selectedSlot || '--:--'} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-teal-700 outline-none" />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Assign Doctor *</label>
                          <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none">
                             <option>Dr. Valaki</option>
                             <option>Dr. Sharma</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Patient Category *</label>
                          <select 
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none"
                            value={patientCategory}
                            onChange={(e) => setPatientCategory(e.target.value)}
                          >
                             <option value="Payment">Payment</option>
                             <option value="FOC">FOC (Free of Charge)</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Purpose of Visit *</label>
                       <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" placeholder="e.g. Regular Follow-up, Chest Pain, etc." />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Special Notes / Reason</label>
                       <textarea rows={2} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all resize-none" placeholder="Any specific instructions for the doctor..."></textarea>
                    </div>
                 </div>
              </div>

              {/* Case ID Read-only Section */}
              <div className="bg-slate-900 rounded-3xl p-8 flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                       <Hash className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Case ID (Auto-generated)</p>
                       <p className="text-xl font-black text-white tracking-[0.2em]">{caseId}</p>
                    </div>
                 </div>
                 <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">[ Read Only ]</span>
                 </div>
              </div>
           </div>

           <div className="space-y-10">
              {/* 🔷 SECTION 3: DATE & TIME PICKER */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Date & Time Picker — Available Slots</h3>
                 </div>
                 
                 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Calendar View */}
                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                             APRIL 2026
                          </h4>
                          <div className="flex gap-1">
                             <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                             <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-7 gap-1 text-center">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                            <div key={d} className="text-[10px] font-black text-slate-400 uppercase py-2">{d}</div>
                          ))}
                          {calendarDays.map(day => {
                            const isHoliday = holidays.includes(day);
                            const isSelected = selectedDate === day;
                            return (
                              <button 
                                key={day} 
                                disabled={isHoliday}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                  aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all border
                                  ${isHoliday ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50' : 'hover:border-teal-500 hover:text-teal-600'}
                                  ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-110 z-10' : 'bg-white text-slate-600 border-slate-100'}
                                `}
                              >
                                {day}
                              </button>
                            );
                          })}
                       </div>
                    </div>

                    {/* Time Slots Panel */}
                    <div className="space-y-6">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Available Time Slots — {selectedDate} April 2026</p>
                          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-hide">
                             {timeSlots.map((slot, i) => (
                               <button 
                                 key={i}
                                 disabled={slot.status === 'Booked'}
                                 onClick={() => setSelectedSlot(slot.time)}
                                 className={`
                                   w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                                   ${slot.status === 'Booked' 
                                      ? 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed' 
                                      : selectedSlot === slot.time
                                        ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-100 ring-offset-2'
                                        : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-teal-50/30'
                                   }
                                 `}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${slot.status === 'Booked' ? 'bg-slate-200' : 'bg-teal-100'}`}>
                                        <Clock className={`w-4 h-4 ${slot.status === 'Booked' ? 'text-slate-400' : 'text-teal-600'}`} />
                                     </div>
                                     <span className={`text-sm font-black ${slot.status === 'Booked' ? 'text-slate-400' : 'text-slate-800'}`}>{slot.time}</span>
                                  </div>
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${slot.status === 'Booked' ? 'text-slate-400' : 'text-teal-600'}`}>
                                     {slot.status}
                                  </span>
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-6">
                 <button className="flex-1 flex items-center justify-center gap-3 py-5 bg-teal-600 text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 group">
                    <CalendarCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Confirm Appointment
                 </button>
                 <button className="px-10 flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all">
                    <XCircle className="w-5 h-5" />
                    Cancel
                 </button>
              </div>
              
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                 <Info className="w-3.5 h-3.5 text-teal-500" />
                 SMS/WhatsApp confirmation will be sent automatically to patient's mobile.
              </p>
           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default BookAppointmentView;
