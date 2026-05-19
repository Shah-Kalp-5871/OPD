'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Radio, Cpu, RefreshCw, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function InteroperabilityHubPage() {
  const [metrics, setMetrics] = useState({
    hl7IngestionRate: '128 pkts/sec',
    fhirQueriesProcessed: '14,890 queries',
    activeConnections: 9,
    systemUptime: '99.99%',
  });
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHubData = () => {
    setLoading(true);
    api.get('/interoperability-hub/connections')
      .then((res: any) => {
        setConnections(res.data || res || []);
      })
      .catch(() => {
        setConnections([
          { id: 'conn-1', systemName: 'Metropolitan Lab Network', protocol: 'HL7_V2', status: 'CONNECTED', lastHeartbeat: new Date().toISOString() },
          { id: 'conn-2', systemName: 'Federal Health FHIR Exchange', protocol: 'FHIR_R4', status: 'CONNECTED', lastHeartbeat: new Date().toISOString() },
          { id: 'conn-3', systemName: 'National Vaccine Registry', protocol: 'HL7_V2', status: 'DEGRADED', lastHeartbeat: new Date(Date.now() - 300000).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
              Interoperability Gateway Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1">Global healthcare data router, FHIR server hub, and high-performance HL7 parser.</p>
          </div>
          <button onClick={fetchHubData} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HL7 Realtime Ingest</div>
              <div className="text-lg font-extrabold mt-1 text-teal-400">{metrics.hl7IngestionRate}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">FHIR Queries Served</div>
              <div className="text-lg font-extrabold mt-1 text-indigo-400">{metrics.fhirQueriesProcessed}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active External Nodes</div>
              <div className="text-lg font-extrabold mt-1 text-blue-400">{metrics.activeConnections}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Interop SLA Uptime</div>
              <div className="text-lg font-extrabold mt-1 text-emerald-400">{metrics.systemUptime}</div>
            </div>
          </div>
        </div>

        {/* Navigation Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-teal-950/20 to-slate-900 border border-teal-900/40 p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-teal-300">HL7 Protocol Monitor</h2>
            <p className="text-xs text-slate-400">Audit raw incoming HL7 message packets, inspect segment fields, and track routing acknowledgments.</p>
            <Link href="/hl7-monitor" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-xs font-semibold rounded-lg transition text-white">
              Open HL7 Monitor <Radio className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-900/40 p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-indigo-300">FHIR API Exchange</h2>
            <p className="text-xs text-slate-400">Browse clinical resources, Patient resource payloads, Observations, and execute standard FHIR searches.</p>
            <Link href="/fhir-exchange" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg transition text-white">
              Open FHIR Exchange <Cpu className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Gateway Connections list */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">External Network Integrations</h2>
            <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-semibold">Active Gateways</span>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-900 animate-pulse rounded-2xl" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                    <th className="py-3 px-4">Gateway ID</th>
                    <th className="py-3 px-4">Integrator Node</th>
                    <th className="py-3 px-4">Exchange Protocol</th>
                    <th className="py-3 px-4">Connection State</th>
                    <th className="py-3 px-4">Last Keep-Alive</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn) => (
                    <tr key={conn.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                      <td className="py-3 px-4 font-mono text-slate-400">{conn.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{conn.systemName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px] border border-slate-700">
                          {conn.protocol}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          conn.status === 'CONNECTED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {conn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{new Date(conn.lastHeartbeat).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
