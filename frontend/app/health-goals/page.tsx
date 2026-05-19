'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function HealthGoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = () => {
    setLoading(true);
    api.get('/wellness/goals?patientId=patient-1')
      .then((res: any) => {
        setGoals(res.data || res || []);
      })
      .catch(() => {
        setGoals([
          { id: '1', goalType: 'Daily Steps Tracker', targetValue: 10000, currentValue: 8420, unit: 'steps', status: 'IN_PROGRESS' },
          { id: '2', goalType: 'Nightly Sleep Tracker', targetValue: 8, currentValue: 7.2, unit: 'hours', status: 'IN_PROGRESS' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/wellness" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-400">
              Active Health Goals
            </h1>
            <p className="text-xs text-slate-400 mt-1">Monitor step milestones, hydration limits, and calorie balances.</p>
          </div>
          <button onClick={fetchGoals} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {loading ? (
          <div className="h-40 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const progressPct = Math.min(100, Math.floor((goal.currentValue / goal.targetValue) * 100));
              return (
                <div key={goal.id} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-200">{goal.goalType}</h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-semibold">
                      {goal.status}
                    </span>
                  </div>

                  <div className="space-y-2 pl-12">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Value: {goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      <span>{progressPct}% completed</span>
                    </div>
                    <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div style={{ width: `${progressPct}%` }} className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              Progress logs are securely updated through patient Apple HealthKit or Google Fit push integrations.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}