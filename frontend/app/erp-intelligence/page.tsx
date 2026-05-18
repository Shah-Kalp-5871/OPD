'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ErpIntelligenceDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-violet-400 font-mono text-sm animate-pulse">Compiling Enterprise Operations Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-700 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">🧠</div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">ERP Operations Intelligence</h1>
            <p className="text-violet-300/80 text-sm mt-1">Cross-Module Enterprise Executive Summary</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 flex items-center gap-4">
          <div className="text-slate-400 text-sm">Operational Health Score</div>
          <div className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">86/100</div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-violet-900/40 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
        <h2 className="text-lg font-bold text-violet-300 mb-3 flex items-center gap-2">
          <span>✨</span> MedFlow Copilot Insights
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-slate-200">
            <span className="text-amber-400 mt-0.5">⚠️</span> 
            <span><strong>Pharmacy & Supply:</strong> 8 critical expiry alerts detected. Immediate disposal required. Low stock on 12 essential items.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-200">
            <span className="text-red-400 mt-0.5">🚨</span> 
            <span><strong>Facility & Assets:</strong> 3 critical maintenance tickets open. 11 biomedical assets currently under maintenance.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-200">
            <span className="text-emerald-400 mt-0.5">✅</span> 
            <span><strong>Workforce:</strong> Staffing levels are optimal for the next 24 hours. Payroll processing for April completed successfully.</span>
          </li>
        </ul>
      </div>

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'HRMS', desc: 'Employee Records & Departments', icon: '👥', link: '/hrms', color: 'group-hover:text-blue-400', metrics: ['284 Total Staff', '261 Active'] },
          { title: 'Workforce', desc: 'Rostering & AI Forecasting', icon: '🕒', link: '/workforce', color: 'group-hover:text-pink-400', metrics: ['18 Active Shifts', '24 Pending Leaves'] },
          { title: 'Payroll', desc: 'Compensation & Reimbursements', icon: '💰', link: '/payroll', color: 'group-hover:text-emerald-400', metrics: ['$845.2K Net (Apr)', '24 Pending Claims'] },
          { title: 'Procurement', desc: 'Vendors, POs & Inventory', icon: '📦', link: '/procurement', color: 'group-hover:text-indigo-400', metrics: ['18 Open POs', '42 Active Vendors'] },
          { title: 'Pharmacy AI', desc: 'Expiry & Anomaly Detection', icon: '💊', link: '/pharmacy-intelligence', color: 'group-hover:text-teal-400', metrics: ['8 Critical Expiries', '3 Dispensing Anomalies'] },
          { title: 'Biomedical', desc: 'Asset Lifecycle & Maintenance', icon: '🔬', link: '/biomedical', color: 'group-hover:text-cyan-400', metrics: ['342 Total Assets', '11 Under Maint.'] },
          { title: 'Facility Ops', desc: 'Infrastructure & Incidents', icon: '🏢', link: '/facility-ops', color: 'group-hover:text-orange-400', metrics: ['3 Critical Tickets', '5 Open Incidents'] },
        ].map((mod) => (
          <Link href={mod.link} key={mod.title}>
            <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{mod.icon}</div>
                <div>
                  <h3 className={`text-xl font-bold text-white transition-colors ${mod.color}`}>{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between text-sm">
                <span className="text-slate-300 font-medium">{mod.metrics[0]}</span>
                <span className="text-slate-400">{mod.metrics[1]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
