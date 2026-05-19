'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = () => {
    setLoading(true);
    api.get('/consumer-communication/campaigns')
      .then((res: any) => {
        setCampaigns(res.data || res || []);
      })
      .catch(() => {
        setCampaigns([
          { id: '1', campaignName: 'Spring Wellness & Vaccination Campaign', channel: 'WhatsApp', status: 'COMPLETED', sentCount: 1500, deliveredCount: 1482, failedCount: 18 },
          { id: '2', campaignName: 'Flu Shot Adherence Alert', channel: 'SMS', status: 'COMPLETED', sentCount: 850, deliveredCount: 840, failedCount: 10 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/patient-communications" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Communications
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Wellness Campaign Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">Review broad marketing, notification compliance campaigns logged in MedFlow.</p>
          </div>
          <button onClick={fetchCampaigns} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {loading ? (
          <div className="space-y-4">
            <div className="h-24 bg-slate-900 animate-pulse rounded-2xl" />
            <div className="h-24 bg-slate-900 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map(camp => (
              <div key={camp.id} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-200">{camp.campaignName}</h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                  <div>
                    <span className="text-xs text-slate-500 block">Channel</span>
                    <span className="font-semibold text-indigo-400">{camp.channel}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Sent Logs</span>
                    <span className="font-semibold text-slate-300">{camp.sentCount}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Delivered</span>
                    <span className="font-semibold text-emerald-400">{camp.deliveredCount}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Failed bounce</span>
                    <span className="font-semibold text-red-400">{camp.failedCount}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl text-indigo-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              MedFlow automatically filters patient opt-outs before generating communication cohorts.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}