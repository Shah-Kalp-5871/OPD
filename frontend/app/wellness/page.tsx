'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Flame, Heart, Sparkles, Activity, Check, Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function WellnessPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMetric, setNewMetric] = useState('');
  const [metricVal, setMetricVal] = useState('');
  const [unit, setUnit] = useState('mmHg');
  const [success, setSuccess] = useState('');

  const fetchWellnessData = () => {
    setLoading(true);
    Promise.all([
      api.get('/wellness/metrics?patientId=patient-1'),
      api.get('/wellness/goals?patientId=patient-1')
    ]).then(([resMetrics, resGoals]: any) => {
      setMetrics(resMetrics.data || resMetrics || []);
      setGoals(resGoals.data || resGoals || []);
    }).catch(() => {
      setMetrics([
        { id: '1', metricType: 'Blood Pressure', value: 120.0, unit: 'mmHg', loggedAt: new Date().toISOString() },
        { id: '2', metricType: 'Blood Glucose', value: 95.0, unit: 'mg/dL', loggedAt: new Date(Date.now() - 3600000).toISOString() },
      ]);
      setGoals([
        { id: '1', goalType: 'Daily Steps Tracker', targetValue: 10000, currentValue: 8420, unit: 'steps', status: 'IN_PROGRESS' },
      ]);
    }).finally(() => setLoading(false));
  };

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetric || !metricVal) return;
    setSuccess('');
    try {
      await api.post('/wellness/metrics', {
        patientId: 'patient-1',
        metricType: newMetric,
        value: Number(metricVal),
        unit,
      });
      setSuccess('Biometric logged successfully! Synchronized to Clinical EMR.');
      setNewMetric('');
      setMetricVal('');
      fetchWellnessData();
    } catch {
      setSuccess('Biometric logging simulated successfully.');
      setNewMetric('');
      setMetricVal('');
    }
  };

  useEffect(() => {
    fetchWellnessData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header Block */}
        <header className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-950/30 to-slate-900 border border-emerald-500/20 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 uppercase">
                Wellness & Remote Care
              </span>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400 mt-3">
                Gamified Care Hub
              </h1>
              <p className="text-slate-400 mt-2 text-sm max-w-xl">
                Log daily biomarkers, track diabetic care plans, complete goals, and earn active reward points.
              </p>
            </div>
            
            {/* Gamified Rings Progress Mock */}
            <div className="relative w-28 h-28 flex items-center justify-center bg-slate-900 rounded-full border-4 border-emerald-500/30">
              <div className="absolute w-24 h-24 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin-slow" />
              <div className="text-center">
                <span className="text-xl font-black text-emerald-400">84%</span>
                <span className="block text-[8px] uppercase tracking-widest text-slate-500 mt-0.5">Steps Done</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/care-plans" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Heart className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Diabetic Care Plans</h3>
                  <p className="text-xs text-slate-400 mt-1">Check medication instructions, diet logs</p>
                </div>
              </Link>

              <Link href="/health-goals" className="p-6 bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 rounded-2xl transition flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Active Health Goals</h3>
                  <p className="text-xs text-slate-400 mt-1">Progress indicators, sleep & step goals</p>
                </div>
              </Link>
            </div>

            {/* Daily Biomarkers Form */}
            <form onSubmit={handleAddMetric} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Log Daily Biometric Value
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Biometric Type</label>
                  <select value={newMetric} onChange={e => {
                    setNewMetric(e.target.value);
                    if (e.target.value === 'Blood Pressure') setUnit('mmHg');
                    else if (e.target.value === 'Blood Glucose') setUnit('mg/dL');
                    else setUnit('lbs');
                  }} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-emerald-500 text-slate-200 outline-none transition">
                    <option value="">Select Biomarkers</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="Blood Glucose">Blood Glucose</option>
                    <option value="Body Weight">Body Weight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Recorded Value</label>
                  <input type="number" step="0.01" value={metricVal} onChange={e => setMetricVal(e.target.value)} placeholder="e.g. 120.00" className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-emerald-500 text-slate-200 outline-none transition" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Unit</label>
                  <input type="text" disabled value={unit} className="w-full mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 outline-none" />
                </div>
              </div>

              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40">
                <Plus className="w-4 h-4" />
                Log Biometric
              </button>
            </form>

          </div>

          <div className="space-y-6">
            
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Active Challenges
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200">10k Steps Streak</span>
                  <p className="text-slate-400 mt-1">Walk 10,000 steps daily for 7 days. Progress: 6/7 days completed.</p>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200">Diabetic Meal Adherence</span>
                  <p className="text-slate-400 mt-1">Log glucose readings within 2 hours of breakfast logs.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}