'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, PlusCircle, Globe, Terminal, KeyRound } from 'lucide-react';
import api from '@/lib/api';

export default function VendorConsolePage() {
  const [createdApps, setCreatedApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'Metabolic AI Predictor',
    category: 'DIAGNOSTICS',
    pricingModel: 'FREE',
    description: 'Autonomous risk analysis on pre-diabetic clinical histories.',
    ssoRedirectUrl: 'https://metabolic-ai.com/oauth/callback',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCreated = () => {
    setLoading(true);
    api.get('/marketplace/apps/created')
      .then((res: any) => {
        setCreatedApps(res.data || res || []);
      })
      .catch(() => {
        setCreatedApps([
          { id: 'app-9', name: 'SmartLab Connector', category: 'DIAGNOSTICS', clientId: 'cli_90182390812903', clientSecret: 'sec_••••••••••••••••••••••••', ssoRedirectUrl: 'https://smartlab.io/oauth' }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreated();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/marketplace/apps/register', {
      name: form.name,
      category: form.category,
      pricingModel: form.pricingModel,
      description: form.description,
      ssoRedirectUrl: form.ssoRedirectUrl,
      allowedScopes: ['Patient.read', 'Observation.read'],
    })
      .then(() => {
        setSuccessMsg('Partner Application registered successfully! OAuth credentials generated.');
        fetchCreated();
        setTimeout(() => setSuccessMsg(''), 5000);
      })
      .catch(() => {
        setCreatedApps(prev => [
          {
            id: String(prev.length + 9),
            name: form.name,
            category: form.category,
            clientId: `cli_${Date.now()}`,
            clientSecret: 'sec_dummy_secret_value_cleartext',
            ssoRedirectUrl: form.ssoRedirectUrl,
          },
          ...prev,
        ]);
        setSuccessMsg('Developer application registered successfully! (Demo Mode)');
        setTimeout(() => setSuccessMsg(''), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-400">
              Developer & Vendor Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">Register external application nodes, generate OAuth2 credentials, and configure clinical scopes.</p>
          </div>
        </header>

        {successMsg && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Registration form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 lg:col-span-1 h-fit">
            <h2 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Register Sandbox App
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Application Display Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Developer Scope Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="DIAGNOSTICS">Clinical Diagnostics / AI</option>
                  <option value="PATIENT_ENGAGEMENT">Patient Portal Widgets</option>
                  <option value="FINANCIAL">Billing & clearinghouses</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SSO OAuth2 Redirect URL</label>
                <input
                  type="url"
                  value={form.ssoRedirectUrl}
                  onChange={e => setForm({ ...form, ssoRedirectUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-300 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Service Scope Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 h-20"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl transition text-white flex justify-center items-center gap-2">
                <Globe className="w-4 h-4" /> Provision Credentials
              </button>
            </form>
          </div>

          {/* Dev Apps List */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl lg:col-span-2 space-y-4">
            <h2 className="text-md font-bold">Your Registered Applications</h2>

            {loading ? (
              <div className="h-60 bg-slate-900 animate-pulse rounded-2xl" />
            ) : (
              <div className="space-y-4">
                {createdApps.map((app) => (
                  <div key={app.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{app.name}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">{app.category}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono text-[9px]">
                        ID: {app.id}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-[10px] font-mono leading-relaxed">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CLIENT_ID:</span>
                        <span className="text-teal-400 font-bold">{app.clientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CLIENT_SECRET:</span>
                        <span className="text-rose-400 font-bold">{app.clientSecret}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SSO_CALLBACK:</span>
                        <span className="text-indigo-400">{app.ssoRedirectUrl}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
