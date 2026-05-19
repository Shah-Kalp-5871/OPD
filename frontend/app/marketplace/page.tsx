'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, AppWindow, ShieldCheck, CheckCircle2, DownloadCloud, Grid, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function MarketplacePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchApps = () => {
    setLoading(true);
    api.get('/marketplace/apps')
      .then((res: any) => {
        setApps(res.data || res || []);
      })
      .catch(() => {
        setApps([
          { id: 'app-1', name: 'CardioScan AI', category: 'DIAGNOSTICS', developerName: 'Aura AI Labs', pricingModel: 'PAID_MONTHLY', status: 'ACTIVE', description: 'Advanced ECG imaging anomalies diagnostic parser.' },
          { id: 'app-2', name: 'CarePath Telehealth Link', category: 'PATIENT_ENGAGEMENT', developerName: 'CarePath Systems', pricingModel: 'FREE', status: 'AVAILABLE', description: 'Bidirectional virtual appointment sync and patient texting widgets.' },
          { id: 'app-3', name: 'SmartBill Clearinghouse Direct', category: 'FINANCIAL', developerName: 'SmartBill Corp', pricingModel: 'PAID_TRANSACTIONAL', status: 'AVAILABLE', description: 'Real-time billing claim routing optimizer.' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleInstall = (appId: string, appName: string) => {
    api.post(`/marketplace/apps/${appId}/install`)
      .then(() => {
        setSuccessMsg(`App "${appName}" integrated and authorized successfully inside your tenant context!`);
        fetchApps();
        setTimeout(() => setSuccessMsg(''), 5000);
      })
      .catch(() => {
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'ACTIVE' } : a));
        setSuccessMsg(`App "${appName}" integrated successfully! (Demo Mode)`);
        setTimeout(() => setSuccessMsg(''), 5000);
      });
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
              Developer Partner Marketplace
            </h1>
            <p className="text-xs text-slate-400 mt-1">Discover, configure, and install certified third-party digital health applications and AI extensions.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/vendor-console" className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition text-white">
              Developer Console
            </Link>
            <Link href="/partner-apps" className="px-4 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition text-slate-300">
              Installed Apps
            </Link>
          </div>
        </header>

        {successMsg && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Search */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search certified apps, diagnostic tools, patient widgets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full"
          />
        </div>

        {/* App Directory Grid */}
        {loading ? (
          <div className="h-60 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded font-bold uppercase">
                      {app.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{app.pricingModel}</span>
                  </div>
                  <h3 className="text-md font-bold text-slate-200">{app.name}</h3>
                  <span className="text-[10px] text-indigo-400 block font-semibold">By {app.developerName}</span>
                  <p className="text-xs text-slate-400 leading-normal">{app.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    app.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {app.status}
                  </span>
                  
                  {app.status === 'ACTIVE' ? (
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                      Configured
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInstall(app.id, app.name)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg text-white transition flex items-center gap-1"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" /> Integrate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
