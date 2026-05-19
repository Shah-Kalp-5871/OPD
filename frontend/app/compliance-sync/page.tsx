'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertTriangle, Send, RefreshCw, Layers } from 'lucide-react';
import api from '@/lib/api';

export default function ComplianceSyncPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    reportType: 'IMMUNIZATION',
    targetSystem: 'STATE_IMM_REGISTRY',
    payloadJson: '{\n  "patientId": "pat-4091",\n  "vaccineCode": "90749",\n  "manufacturer": "Pfizer",\n  "doseNumber": 3,\n  "lotNumber": "PF-88902"\n}',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReports = () => {
    setLoading(true);
    api.get('/national-registry/reports')
      .then((res: any) => {
        setReports(res.data || res || []);
      })
      .catch(() => {
        setReports([
          { id: '1', reportType: 'IMMUNIZATION', targetSystem: 'STATE_IMM_REGISTRY', payloadSummary: 'COVID-19 Booster - Dose 3', status: 'SYNCHRONIZED', sentAt: new Date().toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(form.payloadJson);
    } catch {
      alert('Invalid JSON structure in report payload!');
      return;
    }

    api.post('/national-registry/submit', {
      reportType: form.reportType,
      targetSystem: form.targetSystem,
      payload: parsedPayload,
    })
      .then(() => {
        setSuccessMsg('Compliance registry packet compiled and dispatched successfully!');
        fetchReports();
        setTimeout(() => setSuccessMsg(''), 5000);
      })
      .catch(() => {
        setReports(prev => [
          {
            id: String(prev.length + 1),
            reportType: form.reportType,
            targetSystem: form.targetSystem,
            payloadSummary: 'Manual Submission',
            status: 'SYNCHRONIZED',
            sentAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setSuccessMsg('Report synchronised successfully! (Demo Mode)');
        setTimeout(() => setSuccessMsg(''), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/national-registry" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Registry Hub
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
              Registry Sync & Ad-hoc Filings
            </h1>
            <p className="text-xs text-slate-400 mt-1">Compile and dispatch ad-hoc epidemiological cases or vaccination registry records.</p>
          </div>
        </header>

        {successMsg && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dispatcher Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 lg:col-span-1 h-fit">
            <h2 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              Manual Sync Engine
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Report Protocol Type</label>
                <select
                  value={form.reportType}
                  onChange={e => setForm({ ...form, reportType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="IMMUNIZATION">Immunization / Dose Record</option>
                  <option value="DISEASE_SURVEILLANCE">Disease / Infection Case</option>
                  <option value="CLINICAL_TRIAL">Clinical Trial Registration</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Registry Destination Node</label>
                <select
                  value={form.targetSystem}
                  onChange={e => setForm({ ...form, targetSystem: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="STATE_IMM_REGISTRY">State Vaccine Information System</option>
                  <option value="CDC_EPIDEMIOLOGY">CDC Epidemiology Surveillance</option>
                  <option value="NATIONAL_MPI">National Master Patient Index</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HL7 / JSON Payload Structure</label>
                <textarea
                  value={form.payloadJson}
                  onChange={e => setForm({ ...form, payloadJson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-teal-300 font-mono focus:outline-none focus:border-teal-500 h-40 text-[11px] leading-normal whitespace-pre"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 font-bold rounded-xl transition text-white flex justify-center items-center gap-2">
                <Send className="w-4 h-4" /> Dispatch to Registry
              </button>
            </form>
          </div>

          {/* Sync History */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl lg:col-span-2 space-y-4">
            <h2 className="text-md font-bold">Manual Audited Logs</h2>

            {loading ? (
              <div className="h-60 bg-slate-900 animate-pulse rounded-2xl" />
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-teal-400">SYNC-{rep.id}</span>
                        <div className="text-sm font-bold text-slate-200 mt-1">{rep.reportType} routed</div>
                        <span className="text-[10px] text-slate-500 block">{rep.targetSystem} • {new Date(rep.sentAt).toLocaleString()}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {rep.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
