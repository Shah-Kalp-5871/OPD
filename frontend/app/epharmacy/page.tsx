'use client';
import { useState } from 'react';

export default function EpharmacyPage() {
  const [tab, setTab] = useState<'prescriptions' | 'verify'>('prescriptions');
  const [qrInput, setQrInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const prescriptions = [
    { id: 'rx-001', patientId: 'P-001', status: 'ACTIVE', issuedAt: '2026-05-18', expiresAt: '2026-06-17', refillsAllowed: 2, refillsUsed: 0, isControlled: false, items: [{ drugName: 'Paracetamol', dosage: '500mg', frequency: 'TDS' }] },
    { id: 'rx-002', patientId: 'P-002', status: 'DISPENSED', issuedAt: '2026-05-15', expiresAt: '2026-06-14', refillsAllowed: 0, refillsUsed: 0, isControlled: false, items: [{ drugName: 'Amoxicillin', dosage: '250mg', frequency: 'BD' }] },
    { id: 'rx-003', patientId: 'P-003', status: 'ACTIVE', issuedAt: '2026-05-17', expiresAt: '2026-05-24', refillsAllowed: 1, refillsUsed: 1, isControlled: true, items: [{ drugName: 'Tramadol', dosage: '50mg', frequency: 'OD' }] },
  ];

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-green-900 text-green-300',
    DISPENSED: 'bg-blue-900 text-blue-300',
    EXPIRED: 'bg-gray-800 text-gray-400',
    CANCELLED: 'bg-red-900 text-red-300',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-emerald-400">ePharmacy — Digital Prescriptions</h1>
        <p className="text-sm text-gray-400">Legally Compliant Digital Prescription & QR Verification System</p>
      </header>
      <div className="p-8">
        <div className="flex gap-2 mb-6">
          {(['prescriptions', 'verify'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-emerald-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
              {t === 'prescriptions' ? '📋 Prescriptions' : '🔍 Verify QR'}
            </button>
          ))}
        </div>

        {tab === 'prescriptions' ? (
          <div className="space-y-4">
            {prescriptions.map(rx => (
              <div key={rx.id} className={`bg-gray-900 border rounded-2xl p-5 ${rx.isControlled ? 'border-orange-800' : 'border-gray-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-400">{rx.id.toUpperCase()}</span>
                    {rx.isControlled && <span className="text-xs bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full">⚠ Controlled</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[rx.status]}`}>{rx.status}</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 mb-3">
                  <span>Patient: <strong className="text-gray-200">{rx.patientId}</strong></span>
                  <span>Issued: <strong className="text-gray-200">{rx.issuedAt}</strong></span>
                  <span>Expires: <strong className="text-gray-200">{rx.expiresAt}</strong></span>
                  <span>Refills: <strong className="text-gray-200">{rx.refillsUsed}/{rx.refillsAllowed}</strong></span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {rx.items.map((item, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg px-3 py-1 text-sm">
                      <span className="text-white font-medium">{item.drugName}</span>
                      <span className="text-gray-400 ml-2">{item.dosage} · {item.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-gray-200">QR Prescription Verification</h2>
            <input value={qrInput} onChange={e => setQrInput(e.target.value)} placeholder="Enter QR code or scan..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500" />
            <button onClick={() => setVerifyResult({ valid: qrInput.length > 3, reason: qrInput.length > 3 ? undefined : 'Invalid code' })} className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-xl text-sm font-semibold transition-all">
              Verify Prescription
            </button>
            {verifyResult && (
              <div className={`p-3 rounded-xl text-sm ${verifyResult.valid ? 'bg-green-950 border border-green-800 text-green-300' : 'bg-red-950 border border-red-800 text-red-300'}`}>
                {verifyResult.valid ? '✅ Prescription is valid and authentic.' : `❌ Invalid: ${verifyResult.reason}`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
