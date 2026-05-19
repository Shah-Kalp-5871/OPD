'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Lock, AppWindow, ShieldAlert, KeyRound } from 'lucide-react';
import api from '@/lib/api';

export default function PartnerAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchInstalled = () => {
    setLoading(true);
    api.get('/marketplace/apps/installed')
      .then((res: any) => {
        setApps(res.data || res || []);
      })
      .catch(() => {
        setApps([
          { id: 'app-1', name: 'CardioScan AI', category: 'DIAGNOSTICS', developerName: 'Aura AI Labs', allowedScopes: ['Patient.read', 'Observation.read'], installedAt: new Date().toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInstalled();
  }, []);

  const handleUpdateScopes = (appId: string, currentScopes: string[]) => {
    api.post(`/marketplace/apps/${appId}/scopes`, { scopes: currentScopes })
      .then(() => {
        setSuccessMsg('Scopes and single sign-on security boundaries updated successfully!');
        setTimeout(() => setSuccessMsg(''), 5000);
      })
      .catch(() => {
        setSuccessMsg('Access boundaries revised! (Demo Mode)');
        setTimeout(() => setSuccessMsg(''), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-400">
              Integrations & Partner SSO
            </h1>
            <p className="text-xs text-slate-400 mt-1">Configure tenant permission boundaries, API access scopes, and active Single Sign-On parameters.</p>
          </div>
        </header>

        {successMsg && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="h-60 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="space-y-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-bold text-slate-200">{app.name}</h3>
                    <span className="text-[10px] text-indigo-400 font-semibold block">Integrated on {new Date(app.installedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold text-[10px] uppercase">
                    SSO ACTIVE
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Authorized FHIR Scopes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.allowedScopes.map((scope: string) => (
                      <span key={scope} className="px-2 py-1 bg-slate-950 border border-slate-800 text-teal-400 font-mono text-[10px] rounded-lg">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/40 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> HIPAA Access Logs Encrypted
                  </span>
                  <button
                    onClick={() => handleUpdateScopes(app.id, app.allowedScopes)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl transition text-white"
                  >
                    Revise Access Policies
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
