'use client';
import { useState, useEffect } from 'react';

export default function PharmacyIntelligenceDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-xl">💊</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Pharmacy Intelligence</h1>
            <p className="text-slate-400 text-sm">AI-Driven Medication & Dispensing Analytics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Medications', value: '1,452', icon: '⚕️', color: 'from-blue-500 to-teal-600', trend: 'In formulary' },
          { label: 'Critical Expiry Alerts', value: '8', icon: '⏰', color: 'from-red-500 to-rose-700', trend: '< 30 days remaining' },
          { label: 'Dispensing Anomalies', value: '3', icon: '🚨', color: 'from-amber-500 to-orange-600', trend: 'AI flagged last 24h' },
          { label: 'Controlled Subs', value: '145', icon: '🔒', color: 'from-purple-500 to-indigo-600', trend: 'Strict audit active' },
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
            <span className="text-red-400">🚨</span> AI Dispensing Anomalies
          </h2>
          <div className="space-y-4">
            {[
              { med: 'Oxycodone 10mg', qty: 120, user: 'Dr. H. Smith', reason: 'Quantity exceeds standard protocol limit (30) by 400%', time: '2 hours ago' },
              { med: 'Amoxicillin 500mg', qty: 85, user: 'Nurse J. Doe', reason: 'Unusual bulk dispense for single shift', time: '5 hours ago' },
              { med: 'Fentanyl Patch 25mcg', qty: 10, user: 'Dr. M. Patel', reason: 'High-risk controlled substance flag - off hours dispense', time: 'Yesterday' },
            ].map((anomaly, i) => (
              <div key={i} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-red-400">{anomaly.med}</div>
                  <div className="text-xs text-slate-400">{anomaly.time}</div>
                </div>
                <div className="text-sm text-slate-300 mb-2">Qty: <span className="font-bold text-white">{anomaly.qty}</span> | By: <span className="text-white">{anomaly.user}</span></div>
                <div className="text-xs text-red-300/80 bg-red-500/10 p-2 rounded">
                  <span className="font-semibold">AI Flag:</span> {anomaly.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-amber-400">⏰</span> Approaching Expiry (Critical)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Medication</th>
                  <th className="px-4 py-3">Batch #</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3 rounded-r-lg">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { med: 'Epinephrine Auto-Injector', batch: 'B78921', date: '2026-06-01', days: 14 },
                  { med: 'Insulin Glargine', batch: 'IG4432', date: '2026-06-05', days: 18 },
                  { med: 'Propofol 10mg/mL', batch: 'PR0991', date: '2026-06-10', days: 23 },
                  { med: 'Ceftriaxone 1g', batch: 'CF1123', date: '2026-06-12', days: 25 },
                  { med: 'Heparin 5000 U/mL', batch: 'HP7765', date: '2026-06-15', days: 28 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-slate-200">{row.med}</td>
                    <td className="px-4 py-3 text-slate-400">{row.batch}</td>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                        {row.days} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
