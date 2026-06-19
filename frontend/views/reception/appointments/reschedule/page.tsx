'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  CalendarClock, 
  ArrowLeft, 
  User, 
  CalendarDays, 
  Clock, 
  Stethoscope, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RescheduleAppointmentView({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [appointmentId]);

  const fetchInitialData = async () => {
    try {
      const [apptRes, docsRes] = await Promise.all([
        api.get(`/appointments/${appointmentId}`),
        api.get('/doctors')
      ]);
      
      const appt = apptRes.data;
      if (!appt) {
        throw new Error('Appointment not found');
      }
      setAppointment(appt);
      setDoctors(docsRes.data);
      
      setSelectedDoctorId(appt.doctorId);
      setSelectedDate(new Date(appt.appointmentDate).toISOString().split('T')[0]);
      setRemarks(appt.remarks || '');
    } catch (error) {
      toast.error('Failed to load appointment details');
      router.push('/reception/queue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchSlots(selectedDoctorId, selectedDate);
    }
  }, [selectedDoctorId, selectedDate]);

  const fetchSlots = async (docId: string, dateStr: string) => {
    setIsSlotsLoading(true);
    try {
      const res = await api.get(`/appointments/slots`, {
        params: { doctorId: docId, date: dateStr }
      });
      
      let slots = res.data;
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Filter out past slots if today
      if (dateStr === todayStr) {
        const today = new Date();
        const currentHours = today.getHours();
        const currentMinutes = today.getMinutes();
        const formattedCurrentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        slots = slots.filter((slot: any) => slot.time > formattedCurrentTime);
      }
      
      setAvailableSlots(slots);
      setSelectedTime(''); // Reset time when date/doc changes
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setIsSlotsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedTime) {
      toast.error('Please select a new time slot');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.patch(`/appointments/${appointmentId}/reschedule`, {
        newDate: selectedDate,
        newTime: selectedTime,
        newDoctorId: selectedDoctorId,
        remarks: remarks || 'Rescheduled'
      });
      toast.success('Appointment rescheduled successfully');
      router.push('/reception/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ReceptionLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Details...</p>
          </div>
        </div>
      </ReceptionLayout>
    );
  }

  if (!appointment) return null;

  return (
    <ReceptionLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <CalendarClock className="w-6 h-6 text-indigo-600" /> Reschedule Appointment
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Update Date, Time or Doctor for existing appointment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Details Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Current Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Patient</p>
                    <p className="text-sm font-black text-slate-700">{appointment.patient?.firstName} {appointment.patient?.lastName}</p>
                    <p className="text-xs font-semibold text-slate-500">{appointment.patient?.mobile}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Doctor</p>
                    <p className="text-sm font-black text-slate-700">Dr. {appointment.doctor?.user?.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{appointment.doctor?.specialization}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm font-black text-slate-700">
                      {new Date(appointment.appointmentDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
              
              {/* Doctor Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5" /> Select New Doctor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {doctors.map(doc => {
                    const profileId = doc.doctorProfile?.id || doc.id;
                    const name = doc.name || doc.user?.name || '';
                    const spec = doc.doctorProfile?.specialization || doc.specialization || 'General';
                    const isActive = selectedDoctorId === profileId;
                    return (
                      <button
                        key={profileId}
                        onClick={() => setSelectedDoctorId(profileId)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isActive ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-500/20 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-bold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>Dr. {name}</div>
                          <div className="text-[10px] font-semibold text-slate-500 truncate uppercase tracking-wider">{spec}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5" /> Select New Date
                </label>
                <input 
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-1/2 bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Select New Time
                  </div>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">
                    {availableSlots.length} slots
                  </span>
                </label>
                
                {isSlotsLoading ? (
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checking slots...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">No slots available on this date</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                    {availableSlots.map((slot, i) => {
                      const isBooked = slot.status === 'booked' || slot.status === 'blocked';
                      const isSel = selectedTime === slot.time;
                      return (
                        <button
                          key={i}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                            isBooked ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through' :
                            isSel ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105' :
                            'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  Remarks / Reason
                </label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Reason for reschedule..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
                />
              </div>

            </div>

            {/* Action */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={isSubmitting || !selectedTime || !selectedDate || !selectedDoctorId}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <CheckCircle2 className="w-4 h-4" />}
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReceptionLayout>
  );
}
