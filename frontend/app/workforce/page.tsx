'use client';
import { useState, useEffect } from 'react';

export default function WorkforceDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center text-xl">🕒</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Workforce & Rostering</h1>
            <p className="text-slate-400 text-sm">Shift Management & AI Staffing Forecasts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Shifts', value: '18', icon: '⏱️', color: 'from-blue-500 to-indigo-600', trend: 'Currently running' },
          { label: 'Staff on Duty', value: '142', icon: '🧑‍⚕️', color: 'from-emerald-500 to-green-600', trend: 'Across all depts' },
          { label: 'Pending Leaves', value: '24', icon: '🏖️', color: 'from-amber-500 to-orange-600', trend: 'Requires approval' },
          { label: 'Shift Swap Requests', value: '7', icon: '🔄', color: 'from-purple-500 to-pink-600', trend: 'Action needed' },
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
            <span className="text-indigo-400">🤖</span> AI Staffing Forecast (Next 7 Days)
          </h2>
          <div className="space-y-4">
            {[
              { dept: 'Emergency', date: 'May 19 (Tomorrow)', risk: 'HIGH', staffNeeded: 24, reason: 'Expected surge based on historical weekend data + local events' },
              { dept: 'Cardiology', date: 'May 20', risk: 'MEDIUM', staffNeeded: 12, reason: 'High number of scheduled procedures' },
              { dept: 'Nursing (ICU)', date: 'May 19', risk: 'HIGH', staffNeeded: 30, reason: 'Current high occupancy + staff leave overlap' },
            ].map((forecast, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-white">{forecast.dept}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    forecast.risk === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {forecast.risk} RISK
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Forecast Date: <span className="text-white">{forecast.date}</span></span>
                  <span>Required Staff: <span className="font-bold text-white">{forecast.staffNeeded}</span></span>
                </div>
                <div className="text-xs text-indigo-300/80 bg-indigo-500/10 p-2 rounded">
                  <span className="font-semibold">AI Insight:</span> {forecast.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-amber-400">🏖️</span> Leave Approval Queue
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Dr. Emily Chen', type: 'Annual Leave', dates: 'May 25 - May 30', dept: 'Pediatrics' },
              { name: 'Marcus Johnson', type: 'Sick Leave', dates: 'May 18 - May 20', dept: 'IT Support' },
              { name: 'Nurse Sarah Jenkins', type: 'Maternity', dates: 'Starts Jun 1', dept: 'NICU' },
              { name: 'Dr. Alan Smith', type: 'Conference', dates: 'May 22 - May 24', dept: 'Neurology' },
            ].map((leave, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors">
                <div>
                  <div className="font-semibold text-white mb-1">{leave.name}</div>
                  <div className="text-xs text-slate-400">{leave.dept} | {leave.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-300 mb-2">{leave.dates}</div>
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-colors">Reject</button>
                    <button className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-medium transition-colors">Approve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
