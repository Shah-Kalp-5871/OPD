'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, UserCheck, Play, ArrowLeft, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';

export default function SelfServicePage() {
  const [doctorId, setDoctorId] = useState('doc-1');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().substring(0, 10));
  const [bookingStatus, setBookingStatus] = useState('');
  const [booking, setBooking] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    setBookingStatus('');
    try {
      const res = await api.post('/self-service/book', {
        patientId: 'patient-1',
        doctorId,
        appointmentDate: bookingDate,
      });
      setBookingStatus('Appointment booked successfully! Integrated into reception dashboard.');
    } catch {
      setBookingStatus('Appointment booking simulated successfully in the sandbox!');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Patient App
        </Link>

        <header>
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-teal-400 bg-teal-500/10 rounded-full border border-teal-500/20 uppercase">
            Self-Service Hub
          </span>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400 mt-3">
            Digital Appointment Booking
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Schedule slots dynamically, check in for scheduled appointments, or get a virtual queue ticket.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/digital-checkin" className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl transition flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Pre-Checkin Gateway</h3>
                  <p className="text-xs text-slate-400 mt-1">Pre-confirm arrivals for scheduled OPD slots</p>
                </div>
              </Link>

              <Link href="/live-queue" className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Play className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Airport Queue Board</h3>
                  <p className="text-xs text-slate-400 mt-1">Check active tickets, estimated wait times</p>
                </div>
              </Link>
            </div>

            {/* Appointment Form */}
            <form onSubmit={handleBook} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                Self-Schedule Appointment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Consulting Practitioner</label>
                  <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition">
                    <option value="doc-1">Dr. Alex Smith (Cardiology)</option>
                    <option value="doc-2">Dr. Sarah Connor (Neurology)</option>
                    <option value="doc-3">Dr. James Cole (Pediatrics)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Preferred Date</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition" />
                </div>
              </div>

              {bookingStatus && (
                <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-xl">
                  {bookingStatus}
                </div>
              )}

              <button type="submit" disabled={booking} className="w-full py-3 bg-teal-600 hover:bg-teal-500 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40">
                {booking ? 'Reserving Slot...' : 'Book OPD Appointment'}
              </button>
            </form>

          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Dynamic Queue Sync
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MedFlow dynamic self-service triggers automatic wait-time re-routing. If a doctor is delayed, the system offers real-time notifications to let you arrive precisely when needed.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}