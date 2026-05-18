'use client';
import { useState, useEffect } from 'react';

export default function BiomedicalDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-xl">🔬</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Biomedical Asset Management</h1>
            <p className="text-slate-400 text-sm">Medical Equipment Lifecycle & Maintenance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assets', value: '342', icon: '🏥', color: 'from-blue-500 to-indigo-600', trend: 'Across 4 branches' },
          { label: 'Operational', value: '328', icon: '✅', color: 'from-emerald-500 to-green-600', trend: '95.9% Uptime' },
          { label: 'Under Maintenance', value: '11', icon: '🔧', color: 'from-amber-500 to-orange-600', trend: 'Scheduled PM' },
          { label: 'Faulty/Down', value: '3', icon: '❌', color: 'from-red-500 to-rose-700', trend: 'Requires repair' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-lg mb-3`}>{kpi.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-slate-300 text-sm font-medium">{kpi.label}</div>
            <div className="text-slate-500 text-xs mt-1">{kpi.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-amber-400">⏱️</span> Overdue Calibrations & PM
          </h2>
          <div className="space-y-3">
            {[
              { asset: 'MRI Scanner (Siemens)', tag: 'BIO-2023-045', loc: 'Radiology Dept', due: 'May 10, 2026' },
              { asset: 'Ventilator (Drager)', tag: 'BIO-2024-112', loc: 'ICU Bed 4', due: 'May 15, 2026' },
              { asset: 'Defibrillator (Philips)', tag: 'BIO-2021-088', loc: 'Emergency Room', due: 'May 16, 2026' },
              { asset: 'Infusion Pump (B.Braun)', tag: 'BIO-2025-201', loc: 'Ward C', due: 'May 17, 2026' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white mb-1">{item.asset}</div>
                  <div className="text-xs text-slate-400">{item.tag} | {item.loc}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">Due Date</div>
                  <div className="text-sm font-bold text-amber-400">{item.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-red-400">⚠️</span> Active Downtime Reports
          </h2>
          <div className="space-y-4">
            {[
              { asset: 'CT Scanner (GE)', reason: 'Cooling system failure', since: '24 hours ago', status: 'Awaiting Parts' },
              { asset: 'Anesthesia Machine', reason: 'Valve leak detected during pre-check', since: '5 hours ago', status: 'Technician Assigned' },
              { asset: 'Ultrasound (Mindray)', reason: 'Transducer cable damaged', since: '1 hour ago', status: 'Reported' },
            ].map((report, i) => (
              <div key={i} className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-white/10 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-red-500 border-4 border-[#0a0f1e]" />
                <div className="font-semibold text-white mb-1">{report.asset}</div>
                <div className="text-sm text-red-300 mb-1">{report.reason}</div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>Down since: {report.since}</span>
                  <span>•</span>
                  <span className="text-cyan-400">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
