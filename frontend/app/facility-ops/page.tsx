'use client';
import { useState, useEffect } from 'react';

export default function FacilityOpsDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-xl">🏢</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Facility Operations</h1>
            <p className="text-slate-400 text-sm">Infrastructure, Maintenance & Incident Reporting</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Open Tickets', value: '42', icon: '🎫', color: 'from-blue-500 to-indigo-600', trend: '12 resolved today' },
          { label: 'Critical Tickets', value: '3', icon: '🚨', color: 'from-red-500 to-rose-700', trend: 'SLA breach risk' },
          { label: 'Energy Anomalies', value: '2', icon: '⚡', color: 'from-amber-500 to-orange-600', trend: 'HVAC power spike' },
          { label: 'Open Incidents', value: '5', icon: '🔥', color: 'from-purple-500 to-pink-600', trend: 'Safety/Compliance' },
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-blue-400">🎫</span> Maintenance Tickets
            </h2>
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'TKT-1042', title: 'HVAC Leak in Ward B', priority: 'CRITICAL', status: 'IN_PROGRESS', time: '2 hours ago' },
              { id: 'TKT-1041', title: 'Elevator 3 Malfunction', priority: 'HIGH', status: 'OPEN', time: '4 hours ago' },
              { id: 'TKT-1040', title: 'Plumbing issue in Staff Restroom', priority: 'MEDIUM', status: 'RESOLVED', time: 'Yesterday' },
              { id: 'TKT-1039', title: 'Flickering lights in Corridor A', priority: 'LOW', status: 'OPEN', time: 'Yesterday' },
            ].map((ticket, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-mono">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      ticket.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      ticket.priority === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-white">{ticket.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">{ticket.time}</div>
                  <div className={`text-xs font-medium ${ticket.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {ticket.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-rose-400">🔥</span> Active Incident Reports
          </h2>
          <div className="space-y-4">
            {[
              { type: 'Safety Hazard', desc: 'Biohazard spill in Lab 2', severity: 'HIGH', reporter: 'Dr. Evans', time: '1 hour ago' },
              { type: 'Security', desc: 'Unauthorized access attempt at Pharmacy', severity: 'CRITICAL', reporter: 'Security System', time: '3 hours ago' },
              { type: 'Compliance', desc: 'Missed fire drill schedule for North Wing', severity: 'MEDIUM', reporter: 'Admin Ops', time: 'Yesterday' },
            ].map((incident, i) => (
              <div key={i} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-rose-400">{incident.type}</div>
                  <div className="text-xs text-slate-400">{incident.time}</div>
                </div>
                <div className="text-sm text-slate-200 mb-3">{incident.desc}</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Reported by: <span className="text-white">{incident.reporter}</span></span>
                  <span className={`px-2 py-1 rounded font-bold ${
                    incident.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                    incident.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
