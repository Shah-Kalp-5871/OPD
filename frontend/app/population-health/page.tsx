'use client';
import { useState, useEffect } from 'react';

const MOCK_POP_HEALTH = {
  hotspots: [
    { id: '1', disease: 'INFLUENZA_A', region: 'NYC-10001', caseCount: 45, severity: 'HIGH', trend: 'INCREASING', identifiedAt: '2026-05-18T10:00:00Z' },
    { id: '2', disease: 'DENGUE', region: 'MIA-33101', caseCount: 12, severity: 'MODERATE', trend: 'STABLE', identifiedAt: '2026-05-18T09:00:00Z' }
  ],
  cohorts: [
    { id: '1', cohort: 'DIABETIC_OVER_65', averageRiskScore: 78.5, totalPatients: 450, careGaps: ['Missed HbA1c', 'No Retinal Exam'] },
    { id: '2', cohort: 'PEDIATRIC_ASTHMA', averageRiskScore: 62.1, totalPatients: 120, careGaps: ['No Inhaler Refill', 'Missed Follow-up'] }
  ]
};

export default function PopulationHealthDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_POP_HEALTH);
      setLoading(false);
    }, 800);
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Synthesizing Population Health Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">Population Health & Epidemiology</h1>
          <p className="text-sm text-gray-400">Geo-spatial Hotspots & AI Cohort Risk Stratification</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all text-white">
          Run Global Epi-Scan
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Geo-Spatial Hotspots Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200 flex items-center justify-between">
            <span>Epidemiological Hotspots</span>
            <span className="bg-red-900/50 text-red-400 text-xs px-3 py-1 rounded-full animate-pulse border border-red-800">Live AI Surveillance</span>
          </h2>
          
          <div className="space-y-4">
            {data.hotspots.map((hotspot: any) => (
              <div key={hotspot.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl relative overflow-hidden flex justify-between items-center">
                <div className={`absolute top-0 left-0 w-1 h-full ${hotspot.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <div className="pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-200">{hotspot.disease}</span>
                    <span className="text-xs text-gray-500 bg-gray-900 px-2 rounded">{hotspot.region}</span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono text-gray-400">
                    <span>Cases: <span className="text-white">{hotspot.caseCount}</span></span>
                    <span>Trend: <span className={hotspot.trend === 'INCREASING' ? 'text-red-400' : 'text-amber-400'}>{hotspot.trend}</span></span>
                  </div>
                </div>
                <button className="bg-gray-800 hover:bg-gray-700 text-xs px-4 py-2 rounded-lg text-gray-300 transition-colors">
                  Deploy Protocol
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Risk Stratification Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">AI Cohort Risk Stratification</h2>
          
          <div className="space-y-4">
            {data.cohorts.map((cohort: any) => (
              <div key={cohort.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-teal-400">{cohort.cohort.replace(/_/g, ' ')}</span>
                    <p className="text-xs text-gray-500 mt-1">Population Size: {cohort.totalPatients} Patients</p>
                  </div>
                  <div className="bg-teal-900/30 text-teal-400 font-mono text-xs px-2 py-1 rounded border border-teal-800/50">
                    Risk: {cohort.averageRiskScore}/100
                  </div>
                </div>
                
                <div className="mt-2 border-t border-gray-900 pt-3">
                  <span className="text-xs text-gray-500 mb-2 block">Identified Care Gaps:</span>
                  <div className="flex gap-2 flex-wrap">
                    {cohort.careGaps.map((gap: string, i: number) => (
                      <span key={i} className="text-[10px] bg-red-950 text-red-300 px-2 py-1 rounded-full border border-red-900/50">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
