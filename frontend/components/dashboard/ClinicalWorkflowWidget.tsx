'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square, Pill, ExternalLink, AlertOctagon, Clock, UserCheck, ShieldAlert, Award, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PrescriptionShortcut {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const POPULAR_MEDICATIONS: PrescriptionShortcut[] = [
  { id: '1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily (TID)', duration: '7 Days' },
  { id: '2', name: 'Paracetamol', dosage: '650mg', frequency: 'As needed (PRN) for pain/fever', duration: '5 Days' },
  { id: '3', name: 'Metformin', dosage: '850mg', frequency: 'Twice daily with meals (BID)', duration: '30 Days' },
  { id: '4', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime (QD)', duration: '90 Days' },
  { id: '5', name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily after meals', duration: '5 Days' },
];

export default function ClinicalWorkflowWidget({
  activePatientId,
  activePatientName = 'Select a patient from the queue',
  onPrescribe,
  onRefer,
}: {
  activePatientId?: string;
  activePatientName?: string;
  onPrescribe?: (medication: PrescriptionShortcut) => void;
  onRefer?: (specialty: string) => void;
}) {
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiology');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  useEffect(() => {
    // Reset timer when active patient changes
    setSeconds(0);
    setTimerActive(!!activePatientId);
  }, [activePatientId]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrescriptionClick = (med: PrescriptionShortcut) => {
    if (!activePatientId) return;
    if (onPrescribe) onPrescribe(med);
  };

  const handleReferral = () => {
    if (!activePatientId) return;
    if (onRefer) onRefer(selectedSpecialty);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Timer and active patient indicator */}
      <Card className="lg:col-span-1 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-theme" />
            Consultation Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-slate-900 dark:bg-black text-white p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-800/80 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-theme/10 rounded-full blur-2xl" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
              Active Session Duration
            </span>
            <span className="text-4xl font-mono font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
              {formatTime(seconds)}
            </span>
            <div className="flex gap-3 mt-4">
              <Button
                size="sm"
                onClick={() => setTimerActive(!timerActive)}
                className={`text-xs px-4 py-1.5 h-8 font-bold rounded-xl transition-all shadow-md ${
                  timerActive 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {timerActive ? <Square className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {timerActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSeconds(0); setTimerActive(false); }}
                className="text-xs text-slate-400 hover:text-slate-200 border-slate-700 bg-slate-800/50 hover:bg-slate-800 h-8 font-bold rounded-xl"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="p-4 bg-primary-theme/5 dark:bg-primary-theme/10 rounded-xl border border-primary-theme/10 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-primary-theme mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-primary-theme uppercase tracking-wider">
                Current Case
              </span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {activePatientName}
              </p>
              {activePatientId && (
                <span className="inline-block mt-1 text-[9px] bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400">
                  ID: {activePatientId}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Shortcuts */}
      <Card className="lg:col-span-1 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-500" />
            Rapid RX Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
          {POPULAR_MEDICATIONS.map((med) => (
            <button
              key={med.id}
              disabled={!activePatientId}
              onClick={() => handlePrescriptionClick(med)}
              className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/35 hover:bg-emerald-500/5 transition-all flex items-center justify-between group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {med.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {med.dosage} • {med.frequency}
                </p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/80 group-hover:text-emerald-600 transition-all">
                {med.duration}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Critical actions: referral & emergency alerts */}
      <Card className="lg:col-span-1 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Emergency & Referrals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* One-click referral */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              External Medical Referral
            </span>
            <div className="flex gap-2">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                disabled={!activePatientId}
                className="flex-1 text-xs h-9 rounded-xl border border-slate-200 dark:border-slate-800 px-3 bg-white dark:bg-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-theme"
              >
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Oncology</option>
                <option>Pediatrics</option>
                <option>Pulmonology</option>
              </select>
              <Button
                size="sm"
                onClick={handleReferral}
                disabled={!activePatientId}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 text-xs px-3.5 rounded-xl shadow-md disabled:opacity-50"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Refer
              </Button>
            </div>
          </div>

          {/* Emergency trigger */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/40 rounded-xl relative overflow-hidden flex flex-col gap-2">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertOctagon className="w-4.5 h-4.5 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-wider">Emergency Highlight</span>
            </div>
            <p className="text-[10px] text-rose-600 dark:text-rose-500 font-medium">
              Flag this clinical consultation session as a critical priority. This action instantly escalates patient priority in all active waiting rooms.
            </p>
            <Button
              size="sm"
              disabled={!activePatientId}
              className="w-full bg-rose-600 hover:bg-rose-500 hover:scale-[1.01] transition-transform text-white font-bold text-[10px] tracking-wider uppercase h-8 rounded-xl shadow-md shadow-rose-600/10"
            >
              Trigger Code Red Alert
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
