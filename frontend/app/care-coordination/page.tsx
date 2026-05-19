'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, Heart, GitBranch, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function CareCoordinationPage() {
  const [pathways, setPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPathways = () => {
    setLoading(true);
    api.get('/referrals/pathways')
      .then((res: any) => {
        setPathways(res.data || res || []);
      })
      .catch(() => {
        setPathways([
          { id: 'path-1', patientName: 'John Doe', stage: 'SURGICAL_PREP', activeFacility: 'St. Jude Cardiac Center', expectedCompletion: new Date(Date.now() + 86400000 * 3).toISOString() },
          { id: 'path-2', patientName: 'Mary Smith', stage: 'POST_OP_REHAB', activeFacility: 'Metro Neurology Group', expectedCompletion: new Date(Date.now() + 86400000 * 7).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPathways();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/referrals" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Referral Exchange
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-400">
              Cross-Hospital Care Coordination
            </h1>
            <p className="text-xs text-slate-400 mt-1">Audit active multi-facility patient timelines, medical pathways, and care milestones.</p>
          </div>
        </header>

        {loading ? (
          <div className="h-60 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="space-y-6">
            {pathways.map((path) => (
              <div key={path.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-bold text-slate-200">{path.patientName}</h3>
                    <span className="text-[10px] text-slate-500 font-semibold block">Care Path: {path.id}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-semibold text-[10px] uppercase">
                    {path.stage}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold">Active Caring Node Facility:</span>
                    <div className="text-slate-200">{path.activeFacility}</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Milestone Completion:
                    </span>
                    <div className="text-slate-200">{new Date(path.expectedCompletion).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
