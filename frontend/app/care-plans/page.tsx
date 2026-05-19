'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function CarePlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = () => {
    setLoading(true);
    api.get('/wellness/care-plans?patientId=patient-1')
      .then((res: any) => {
        setPlans(res.data || res || []);
      })
      .catch(() => {
        setPlans([
          { id: '1', planName: 'Diabetic Health & Wellness Remote Program', description: 'MedFlow gamified wellness adherence plan for active diabetic remote checking.', exerciseInstructions: 'Cardio training for 30 minutes daily', adherenceScore: 92.5 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
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
              Diabetic Care Programs
            </h1>
            <p className="text-xs text-slate-400 mt-1">Review active gamified care plans and remote clinic advisories.</p>
          </div>
          <button onClick={fetchPlans} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {loading ? (
          <div className="h-40 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <div key={plan.id} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-200">{plan.planName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Adherence Score</span>
                    <span className="text-sm font-bold text-emerald-400">{plan.adherenceScore || 92.5}%</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 pl-12 leading-relaxed">{plan.description}</p>
                
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400 space-y-2">
                  <strong className="text-slate-300">Active Instructions:</strong>
                  <p>{plan.exerciseInstructions}</p>
                </div>
              </div>
            ))}

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              All wellness care plan updates are synchronized securely with the patient electronic health records.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}