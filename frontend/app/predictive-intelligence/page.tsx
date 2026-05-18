'use client';
import { useState, useEffect } from 'react';

const MOCK_PROFILE = {
  patientId: 'P-001',
  overallRiskScore: 78,
  deteriorationRisk: 82,
  sepsisRisk: 15,
  readmissionProb: 45,
  mortalityRisk: 5,
  icuEscalationProb: 20,
  noShowProb: 12,
  adherenceProb: 88,
  lastCalculatedAt: new Date().toISOString()
};

const MOCK_PREDICTIONS = [
  { id: '1', type: 'DETERIORATION', score: 82, confidence: 0.91, evidence: { metric: 'HR', value: 110, trend: 'increasing' }, factors: ['Age > 65', 'History of Hypertension'], time: '2 mins ago' },
  { id: '2', type: 'SEPSIS', score: 15, confidence: 0.85, evidence: { metric: 'TEMP', value: 37.5 }, factors: ['Normal WBC count'], time: '1 hour ago' }
];

const MOCK_ALERTS = [
  { id: 'a1', type: 'CRITICAL', message: 'Critical deterioration risk detected (78%). Immediate review recommended.', time: 'Just now' },
  { id: 'a2', type: 'HIGH', message: 'Sustained elevated HR detected in RPM stream.', time: '10 mins ago' }
];

export default function PredictiveIntelligenceDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setLoading(false);
    }, 800);
  }, []);

  if (loading || !profile) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Analyzing Risk Profiles...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500">Enterprise Predictive Risk Intelligence</h1>
          <p className="text-sm text-gray-400">AI-driven Clinical Deterioration & Operational Forecasting</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          Recalculate AI Risk
        </button>
      </header>

      <div className="grid grid-cols-4 gap-6 p-8">
        {/* Left Column: Overall Risk & Alerts */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <h2 className="text-gray-400 font-semibold mb-4">Overall Risk Score</h2>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#1f2937" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray={`${profile.overallRiskScore * 3.51} 351`} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-white">{profile.overallRiskScore}</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-red-400 font-semibold mt-4">CRITICAL RISK</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-gray-400 font-semibold mb-4">AI Escalation Center</h2>
            <div className="space-y-3">
              {MOCK_ALERTS.map(alert => (
                <div key={alert.id} className="bg-red-950/30 border border-red-900 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold bg-red-900 text-red-300 px-2 py-0.5 rounded-full">{alert.type}</span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-200">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right: Breakdown & Explainability */}
        <div className="col-span-3 space-y-6">
          {/* Sub-Risks Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Deterioration Risk', val: profile.deteriorationRisk, color: 'text-red-400' },
              { label: 'Sepsis Probability', val: profile.sepsisRisk, color: 'text-yellow-400' },
              { label: 'ICU Escalation', val: profile.icuEscalationProb, color: 'text-orange-400' },
              { label: 'Readmission Risk', val: profile.readmissionProb, color: 'text-orange-400' },
              { label: 'No-Show Probability', val: profile.noShowProb, color: 'text-green-400' },
              { label: 'Medication Adherence', val: profile.adherenceProb, color: 'text-emerald-400' },
            ].map(r => (
              <div key={r.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-2">{r.label}</p>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${r.color}`}>{r.val}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Explainability Timeline */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-gray-300 font-semibold mb-4">Explainable AI Evidence Layer</h2>
            <div className="space-y-4">
              {MOCK_PREDICTIONS.map(pred => (
                <div key={pred.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-200">{pred.type} PREDICTION</span>
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Score: {pred.score}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">AI Confidence: {(pred.confidence * 100).toFixed(0)}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-gray-700">
                        <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${pred.confidence * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Trigger Evidence (RPM/EHR)</p>
                      <div className="bg-gray-950 p-2 rounded-lg text-xs font-mono text-gray-300">
                        {JSON.stringify(pred.evidence, null, 2)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contributing Factors</p>
                      <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                        {pred.factors.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
