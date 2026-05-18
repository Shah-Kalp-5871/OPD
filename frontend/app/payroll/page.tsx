'use client';
import { useState, useEffect } from 'react';

export default function PayrollDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-xl">💰</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Payroll & Reimbursements</h1>
            <p className="text-slate-400 text-sm">Enterprise Compensation Management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Last Cycle Total Net', value: '$845,200', icon: '💸', color: 'from-emerald-500 to-teal-600', sub: 'April 2026' },
          { label: 'Pending Reimbursements', value: '24', icon: '🧾', color: 'from-amber-500 to-orange-600', sub: 'Total $12,450' },
          { label: 'Processed Employees', value: '281', icon: '👥', color: 'from-blue-500 to-indigo-600', sub: '100% completion' },
          { label: 'Tax Deductions', value: '$112,400', icon: '🏛️', color: 'from-purple-500 to-pink-600', sub: 'April 2026 TDS' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-lg mb-3`}>{kpi.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-slate-300 text-sm font-medium">{kpi.label}</div>
            <div className="text-slate-500 text-xs mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🔄</span> Payroll Cycles
          </h2>
          <div className="space-y-4">
            {[
              { month: 'April 2026', status: 'APPROVED', gross: '$957,600', net: '$845,200', date: 'May 1, 2026' },
              { month: 'March 2026', status: 'APPROVED', gross: '$942,100', net: '$831,500', date: 'Apr 1, 2026' },
              { month: 'February 2026', status: 'APPROVED', gross: '$938,000', net: '$828,900', date: 'Mar 1, 2026' },
            ].map((cycle, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white mb-1">{cycle.month}</div>
                  <div className="text-xs text-slate-400">Processed: {cycle.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold mb-1">{cycle.net} <span className="text-slate-500 text-xs font-normal">NET</span></div>
                  <div className="text-xs text-slate-400">Gross: {cycle.gross}</div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-500 hover:to-teal-500 transition-colors">
              Initiate May 2026 Cycle
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧾</span> Pending Reimbursements
          </h2>
          <div className="space-y-3">
            {[
              { emp: 'Dr. Sarah Jenkins', desc: 'Conference Travel - Flight', amount: '$850.00', date: 'May 12' },
              { emp: 'Mark Rutherford', desc: 'Client Meeting Dinner', amount: '$124.50', date: 'May 14' },
              { emp: 'Dr. Alan Smith', desc: 'Medical Certification Renewal', amount: '$450.00', date: 'May 15' },
              { emp: 'Jessica Wong', desc: 'Office Supplies - Urgent', amount: '$65.00', date: 'May 16' },
            ].map((claim, i) => (
              <div key={i} className="p-3 rounded-lg hover:bg-white/5 transition-colors flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                    {claim.emp.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{claim.emp}</div>
                    <div className="text-xs text-slate-400">{claim.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{claim.amount}</div>
                  <div className="text-xs text-slate-500">{claim.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
