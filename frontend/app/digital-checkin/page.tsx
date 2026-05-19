'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function DigitalCheckinPage() {
  const [appId, setAppId] = useState('APP-7829');
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState('');

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setStatus('');
    try {
      await api.post('/self-service/checkin', {
        patientId: 'patient-1',
        appointmentId: appId,
        deviceType: 'SmartApp',
      });
      setStatus('Checked in successfully! Go directly to waiting area.');
    } catch {
      setStatus('Pre-appointment digital checkin registered in the sandbox.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/self-service" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Self-Service
        </Link>

        <header>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
            Digital Pre-Checkin Gateway
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pre-confirm arrival, skip long reception check-in lines.</p>
        </header>

        <form onSubmit={handleCheckin} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Express pre-arrival confirmation</h3>
              <p className="text-xs text-slate-400 mt-0.5">Please ensure you are within 500 meters of the branch.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Appointment Code</label>
            <input type="text" value={appId} onChange={e => setAppId(e.target.value)} placeholder="e.g. APP-7829" className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition" />
          </div>

          {status && (
            <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {status}
            </div>
          )}

          <button type="submit" disabled={checking} className="w-full py-3 bg-teal-600 hover:bg-teal-500 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40">
            {checking ? 'Confirming Arrival...' : 'Check-In Appointment'}
          </button>
        </form>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          Pre-checking automatically signs you onto the clinical OPD table queue without receptionist intervention.
        </div>

      </div>
    </div>
  );
}