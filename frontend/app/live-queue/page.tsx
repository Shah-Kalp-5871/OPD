'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, AlertTriangle, RefreshCw, Smartphone, Award, Star } from 'lucide-react';
import axios from 'axios';
import { APP_CONFIG } from '@/lib/config';

export default function LiveQueuePage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = () => {
    setLoading(true);
    axios.get(`${APP_CONFIG.API_BASE_URL}/api/self-service/queue/status?patientId=patient-1`)
      .then((res: any) => {
        setTokens(res.data || res || []);
      })
      .catch(() => {
        setTokens([
          { id: '1', tokenNumber: 'TKT-1002', status: 'SERVING', doctorId: 'doc-1', estimatedWaitMinutes: 0 },
          { id: '2', tokenNumber: 'TKT-1003', status: 'WAITING', doctorId: 'doc-1', estimatedWaitMinutes: 20 },
          { id: '3', tokenNumber: 'TKT-1004', status: 'WAITING', doctorId: 'doc-2', estimatedWaitMinutes: 45 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/self-service" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Self-Service
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
              Live Clinical OPD Waiting Board
            </h1>
            <p className="text-xs text-slate-400 mt-1">Airport-style real-time wait times ticker and doctor schedules.</p>
          </div>
          <button onClick={fetchQueue} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </button>
        </header>

        {/* Airport Style Waiting Ticker */}
        <div className="border border-slate-800 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900 border-b border-slate-800 text-xs font-bold text-teal-400 uppercase tracking-widest">
            <div>Ticket ID</div>
            <div>Doctor ID</div>
            <div>Estimated Wait</div>
            <div className="text-right">Live Status</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Retrieving airport wait timers...</div>
          ) : (
            <div className="divide-y divide-slate-900">
              {tokens.map(token => (
                <div key={token.id} className="grid grid-cols-4 gap-4 p-5 hover:bg-slate-900/30 transition text-sm font-mono items-center">
                  <div className="font-bold text-slate-200">{token.tokenNumber}</div>
                  <div className="text-slate-400">{token.doctorId || 'doc-1'}</div>
                  <div className="text-amber-400 font-semibold">
                    {token.estimatedWaitMinutes === 0 ? 'Now Serving' : `${token.estimatedWaitMinutes} mins`}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs rounded border font-semibold ${token.status === 'SERVING' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-850'}`}>
                      {token.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Real-Time Routing Alerts</h4>
              <p className="text-xs text-slate-400 mt-1">If delays occur, MedFlow redirects emergency tokens directly into neighboring triage pods.</p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-start gap-4">
            <Smartphone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">WhatsApp Push Tickets</h4>
              <p className="text-xs text-slate-400 mt-1">Enable preferences triggers to receive direct queuing counters live via WhatsApp messages.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}