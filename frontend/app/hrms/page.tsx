'use client';
import { useState, useEffect } from 'react';

interface HrmsDashboard {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  expiringSoon: number;
  departments: Array<{ id: string; name: string; _count: { employees: number } }>;
}

export default function HrmsPage() {
  const [data, setData] = useState<HrmsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setData({
      totalEmployees: 284,
      activeEmployees: 261,
      onLeave: 14,
      expiringSoon: 7,
      departments: [
        { id: '1', name: 'Emergency', _count: { employees: 42 } },
        { id: '2', name: 'Cardiology', _count: { employees: 28 } },
        { id: '3', name: 'Radiology', _count: { employees: 19 } },
        { id: '4', name: 'Pharmacy', _count: { employees: 22 } },
        { id: '5', name: 'Nursing', _count: { employees: 81 } },
        { id: '6', name: 'Administration', _count: { employees: 33 } },
      ],
    });
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xl">👥</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Enterprise HRMS</h1>
            <p className="text-slate-400 text-sm">Hospital Human Resource Management System</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', value: data?.totalEmployees, icon: '👤', color: 'from-blue-500 to-blue-700', change: '+12 this month' },
          { label: 'Active Staff', value: data?.activeEmployees, icon: '✅', color: 'from-emerald-500 to-green-700', change: `${Math.round((data?.activeEmployees ?? 0) / (data?.totalEmployees ?? 1) * 100)}% of total` },
          { label: 'On Leave', value: data?.onLeave, icon: '🏖️', color: 'from-amber-500 to-orange-600', change: '5 approved today' },
          { label: 'Certs Expiring', value: data?.expiringSoon, icon: '⚠️', color: 'from-red-500 to-rose-700', change: 'Requires renewal' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-lg mb-3`}>{kpi.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value?.toLocaleString()}</div>
            <div className="text-slate-300 text-sm font-medium">{kpi.label}</div>
            <div className="text-slate-500 text-xs mt-1">{kpi.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Distribution */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏢</span> Department Distribution
          </h2>
          <div className="space-y-3">
            {data?.departments.map((dept) => {
              const pct = Math.round((dept._count.employees / (data.totalEmployees)) * 100);
              return (
                <div key={dept.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{dept.name}</span>
                    <span className="text-slate-400">{dept._count.employees} staff</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📅</span> Today's Attendance Snapshot
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Present', value: 243, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Absent', value: 18, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Half Day', value: 8, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'WFH', value: 15, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 flex flex-col items-center`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-300 text-sm font-medium">⚠️ {data?.expiringSoon} certifications expire within 30 days</p>
            <p className="text-amber-400/70 text-xs mt-1">Review and schedule renewals immediately</p>
          </div>
        </div>
      </div>

      {/* Onboarding Metrics */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🚀</span> Onboarding Pipeline — Last 6 Months
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m, i) => {
            const vals = [4, 7, 3, 9, 5, 12];
            const max = Math.max(...vals);
            return (
              <div key={m} className="flex flex-col items-center gap-2">
                <div className="text-emerald-400 text-sm font-bold">{vals[i]}</div>
                <div className="w-full bg-white/10 rounded-full" style={{ height: 80 }}>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full"
                    style={{ height: `${(vals[i] / max) * 80}px`, marginTop: `${80 - (vals[i] / max) * 80}px` }}
                  />
                </div>
                <div className="text-slate-500 text-xs">{m}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
