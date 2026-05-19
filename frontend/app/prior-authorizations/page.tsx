'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, XCircle, PlusCircle, HelpCircle, FileCheck2, ClipboardPlus } from 'lucide-react';
import api from '@/lib/api';

export default function PriorAuthorizationsPage() {
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: 'pat-4091',
    payerId: 'PAYER-BCBS',
    requestType: 'SURGERY',
    clinicalNotes: 'Pre-op prior auth request for laparoscopic cholecystectomy due to symptomatic cholelithiasis.',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAuths = () => {
    setLoading(true);
    api.get('/insurance-clearinghouse/prior-authorizations')
      .then((res: any) => {
        setAuthorizations(res.data || res || []);
      })
      .catch(() => {
        setAuthorizations([
          { id: '1', authNumber: 'PA-90182390', requestType: 'SURGERY', status: 'PENDING', requestedDate: new Date().toISOString(), clinicalNotes: 'Pre-op auth request.' },
          { id: '2', authNumber: 'PA-90182391', requestType: 'INPATIENT', status: 'APPROVED', requestedDate: new Date(Date.now() - 86400000).toISOString(), clinicalNotes: 'Cardiac monitoring admission request.', decidedDate: new Date().toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuths();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/insurance-clearinghouse/prior-authorizations/request', {
      patientId: form.patientId,
      payerId: form.payerId,
      requestType: form.requestType,
      clinicalNotes: form.clinicalNotes,
      approvedCodes: [],
    })
      .then(() => {
        setSuccessMsg('Prior authorization requested successfully! Routed to payer approval queue.');
        fetchAuths();
        setTimeout(() => setSuccessMsg(''), 5000);
      })
      .catch(() => {
        setAuthorizations(prev => [
          {
            id: String(prev.length + 1),
            authNumber: `PA-${Date.now()}`,
            requestType: form.requestType,
            status: 'PENDING',
            requestedDate: new Date().toISOString(),
            clinicalNotes: form.clinicalNotes,
          },
          ...prev,
        ]);
        setSuccessMsg('Prior authorization requested! (Demo Mode)');
        setTimeout(() => setSuccessMsg(''), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href="/insurance-clearinghouse" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Clearinghouse
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Prior Authorization Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">Submit clinical requests and track electronic approvals from external payers.</p>
          </div>
        </header>

        {successMsg && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 lg:col-span-1 h-fit">
            <h2 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              New Pre-Service Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patient Identification ID</label>
                <input
                  type="text"
                  value={form.patientId}
                  onChange={e => setForm({ ...form, patientId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payer / Insurance Code</label>
                <input
                  type="text"
                  value={form.payerId}
                  onChange={e => setForm({ ...form, payerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authorization Request Type</label>
                <select
                  value={form.requestType}
                  onChange={e => setForm({ ...form, requestType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="SURGERY">Inpatient/Outpatient Surgery</option>
                  <option value="INPATIENT">Clinical Inpatient Admission</option>
                  <option value="SPECIALLAB">Special Laboratory / Imaging</option>
                  <option value="TELEHEALTH">Complex Remote Telehealth Program</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clinical Necessity / Diagnosis Notes</label>
                <textarea
                  value={form.clinicalNotes}
                  onChange={e => setForm({ ...form, clinicalNotes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 h-28"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl transition text-white flex justify-center items-center gap-2">
                <ClipboardPlus className="w-4 h-4" /> Request Payer Authorization
              </button>
            </form>
          </div>

          {/* List */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl lg:col-span-2 space-y-4">
            <h2 className="text-md font-bold">Requested Authorizations</h2>

            {loading ? (
              <div className="h-60 bg-slate-900 animate-pulse rounded-2xl" />
            ) : (
              <div className="space-y-4">
                {authorizations.map((auth) => (
                  <div key={auth.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-indigo-400">{auth.authNumber}</span>
                        <div className="text-sm font-bold text-slate-200 mt-1">{auth.requestType} Approval Requested</div>
                        <span className="text-[10px] text-slate-500 block">{new Date(auth.requestedDate).toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] flex items-center gap-1 ${
                        auth.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : auth.status === 'DENIED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {auth.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {auth.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {auth.status === 'DENIED' && <XCircle className="w-3.5 h-3.5" />}
                        {auth.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                      {auth.clinicalNotes}
                    </p>
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
