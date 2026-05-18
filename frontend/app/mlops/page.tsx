'use client';
import { useState, useEffect } from 'react';

const MOCK_MLOPS = {
  models: [
    { id: '1', modelName: 'SepsisPredictor', version: 'v1.4.0', status: 'ACTIVE', accuracyScore: 94.2, deployedAt: '2026-05-15T08:00:00Z' },
    { id: '2', modelName: 'NoShowPredictor', version: 'v2.1.0', status: 'ACTIVE', accuracyScore: 88.5, deployedAt: '2026-05-10T09:30:00Z' },
    { id: '3', modelName: 'ReadmissionRisk', version: 'v1.1.2', status: 'SHADOW', accuracyScore: 91.1, deployedAt: '2026-05-18T10:00:00Z' }
  ],
  metrics: [
    { id: '1', modelId: '1', model: { modelName: 'SepsisPredictor', version: 'v1.4.0' }, driftScore: 0.04, featureDrifts: { 'vital_variance': 0.02 }, evaluatedAt: '2026-05-18T10:30:00Z' },
    { id: '2', modelId: '2', model: { modelName: 'NoShowPredictor', version: 'v2.1.0' }, driftScore: 0.18, featureDrifts: { 'weather_pattern': 0.12, 'age_dist': 0.06 }, evaluatedAt: '2026-05-18T09:30:00Z' }
  ]
};

export default function MlopsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_MLOPS);
      setLoading(false);
    }, 700);
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Aggregating AI Governance Metrics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-violet-400">MLOps & AI Governance</h1>
          <p className="text-sm text-gray-400">Model Registry, Shadow Deployments, and Data Drift Monitoring</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all text-white">
          Run Global Drift Scan
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Model Registry Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">Enterprise Model Registry</h2>
          
          <div className="space-y-4">
            {data.models.map((model: any) => (
              <div key={model.id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-violet-400">{model.modelName}</span>
                    <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{model.version}</span>
                    {model.status === 'ACTIVE' && <span className="bg-green-900/50 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Live</span>}
                    {model.status === 'SHADOW' && <span className="bg-blue-900/50 text-blue-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Shadow</span>}
                  </div>
                  <p className="text-xs text-gray-500">Deployed: {new Date(model.deployedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-gray-400 mb-1">Accuracy</span>
                  <span className="text-xl font-bold text-gray-200">{model.accuracyScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Drift & Monitoring Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">Continuous Drift Monitoring</h2>
          
          <div className="space-y-4">
            {data.metrics.map((metric: any) => (
              <div key={metric.id} className={`bg-gray-950 border p-4 rounded-xl relative overflow-hidden ${metric.driftScore > 0.15 ? 'border-amber-900/50' : 'border-gray-800'}`}>
                {metric.driftScore > 0.15 && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                
                <div className="flex justify-between items-start mb-3">
                  <div className="pl-2">
                    <span className="font-bold text-gray-200 block">{metric.model.modelName}</span>
                    <span className="text-xs text-gray-500 font-mono">{metric.model.version}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold border ${metric.driftScore > 0.15 ? 'bg-amber-900/30 text-amber-500 border-amber-800/50' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                    Drift: {metric.driftScore}
                  </div>
                </div>
                
                <div className="pl-2 border-t border-gray-900 pt-3">
                  <span className="text-xs text-gray-500 block mb-2">Feature Shift Analysis:</span>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(metric.featureDrifts).map(([feat, val]: any) => (
                      <span key={feat} className="text-[10px] bg-gray-900 text-gray-400 px-2 py-1 rounded-full border border-gray-800 flex gap-2">
                        <span>{feat}</span>
                        <span className="text-violet-400">{val}</span>
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
