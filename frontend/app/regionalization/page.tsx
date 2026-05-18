'use client';
import { useState } from 'react';

const policies = [
  { id: '1', countryCode: 'IN', region: 'Maharashtra', policyType: 'PRESCRIPTION_RULES', isActive: true, rules: { requireDoctorSignature: true, maxRefills: 3 } },
  { id: '2', countryCode: 'US', region: 'California', policyType: 'DATA_RESIDENCY', isActive: true, rules: { dataRegion: 'us-west-2', hipaaRequired: true } },
  { id: '3', countryCode: 'DE', region: null, policyType: 'CONSENT', isActive: true, rules: { gdprConsent: true, recordingConsent: true } },
];

const consents = [
  { type: 'RECORDING', granted: true, patientId: 'P-001' },
  { type: 'RPM', granted: true, patientId: 'P-001' },
  { type: 'PHARMACY_SHARING', granted: false, patientId: 'P-001' },
  { type: 'EMERGENCY_ESCALATION', granted: true, patientId: 'P-001' },
];

export default function RegionalizationPage() {
  const [activeTab, setActiveTab] = useState<'policies' | 'consent'>('policies');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-rose-400">Regionalization & Compliance</h1>
        <p className="text-sm text-gray-400">Global Telehealth Regulations, Data Residency & Consent Intelligence</p>
      </header>
      <div className="p-8 space-y-6">
        <div className="flex gap-2">
          {(['policies', 'consent'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${activeTab === t ? 'bg-rose-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
              {t === 'policies' ? '🌍 Regional Policies' : '📜 Patient Consent'}
            </button>
          ))}
        </div>

        {activeTab === 'policies' ? (
          <div className="space-y-4">
            {policies.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.countryCode === 'IN' ? '🇮🇳' : p.countryCode === 'US' ? '🇺🇸' : '🇩🇪'}</span>
                    <div>
                      <p className="font-semibold text-gray-200">{p.countryCode}{p.region ? ` — ${p.region}` : ''}</p>
                      <p className="text-xs text-gray-400">{p.policyType.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-500'}`}>
                    {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <pre className="text-xs text-gray-300 overflow-x-auto">{JSON.stringify(p.rules, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-lg space-y-3">
            <p className="text-sm text-gray-400 mb-4">Patient P-001 — Consent Records</p>
            {consents.map((c, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">{c.type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">Patient {c.patientId}</p>
                </div>
                <span className={`text-sm font-bold ${c.granted ? 'text-green-400' : 'text-red-400'}`}>
                  {c.granted ? '✅ Granted' : '❌ Revoked'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
