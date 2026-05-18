'use client';
import { useState, useEffect } from 'react';

export default function ProcurementDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center text-xl">📦</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Procurement & Supply Chain</h1>
            <p className="text-slate-400 text-sm">Enterprise Vendor & Inventory Management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Vendors', value: 42, icon: '🏢', color: 'from-blue-500 to-indigo-600', trend: '+3 this month' },
          { label: 'Open POs', value: 18, icon: '📄', color: 'from-amber-500 to-orange-600', trend: '5 pending approval' },
          { label: 'Warehouses', value: 4, icon: '🏭', color: 'from-emerald-500 to-green-600', trend: '98% capacity used' },
          { label: 'Low Stock Alerts', value: 12, icon: '⚠️', color: 'from-rose-500 to-red-600', trend: 'Requires action' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-lg mb-3`}>{kpi.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-slate-300 text-sm font-medium">{kpi.label}</div>
            <div className="text-slate-500 text-xs mt-1">{kpi.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Recent Purchase Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/5">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">PO Number</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Expected</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { po: 'PO-2026-0089', vendor: 'MedSupply Co.', amount: '$12,450', status: 'SENT', date: 'May 20' },
                  { po: 'PO-2026-0088', vendor: 'Global Pharma', amount: '$45,200', status: 'CONFIRMED', date: 'May 19' },
                  { po: 'PO-2026-0087', vendor: 'TechCare Equip', amount: '$8,900', status: 'DRAFT', date: '-' },
                  { po: 'PO-2026-0086', vendor: 'Surgical Dynamics', amount: '$21,000', status: 'RECEIVED', date: 'May 15' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-indigo-400">{row.po}</td>
                    <td className="px-4 py-3">{row.vendor}</td>
                    <td className="px-4 py-3">{row.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-400' :
                        row.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                        row.status === 'SENT' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Spend by Category
          </h2>
          <div className="space-y-4">
            {[
              { cat: 'Pharmaceuticals', pct: 45, val: '$1.2M' },
              { cat: 'Surgical Supplies', pct: 25, val: '$650K' },
              { cat: 'Biomedical Equip', pct: 15, val: '$380K' },
              { cat: 'IT Hardware', pct: 10, val: '$220K' },
              { cat: 'General Office', pct: 5, val: '$85K' },
            ].map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{item.cat}</span>
                  <span className="text-slate-400 font-medium">{item.val}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
