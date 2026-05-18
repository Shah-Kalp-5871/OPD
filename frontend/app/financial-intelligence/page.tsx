'use client';
import { useState, useEffect } from 'react';

const MOCK_FINANCE = {
  forecast: {
    predictedRevenue: 642500,
    confidenceBoundLower: 578250,
    confidenceBoundUpper: 706750,
    keyDrivers: {
      "telemedicine_volume": "+12%",
      "chronic_care_billing": "+8%",
      "seasonality": "-3%"
    },
    month: '2026-05'
  },
  activeAlerts: [
    { id: '1', type: 'UPCODING', score: 85, evidence: { cptCode: "99215", avgTime: "8m", flag: "Level 5 visit mapped to 8m encounter" }, status: 'INVESTIGATING' },
    { id: '2', type: 'DUPLICATE_CLAIM', score: 92, evidence: { patient: "P-101", service: "X-Ray", flag: "Billed twice in 48h without justification" }, status: 'INVESTIGATING' }
  ]
};

export default function FinancialIntelligenceDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_FINANCE);
      setLoading(false);
    }, 700);
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Aggregating Financial Intelligence...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">AI Financial & Revenue Intelligence</h1>
          <p className="text-sm text-gray-400">Predictive Revenue Forecasting & Autonomous Fraud Detection</p>
        </div>
        <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all text-white">
          Run Financial Sweep
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Forecasting Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">Revenue Forecast: {data.forecast.month}</h2>
          
          <div className="flex flex-col items-center justify-center mb-8 bg-gray-950 rounded-2xl py-8 border border-gray-800 shadow-inner">
            <span className="text-sm text-gray-500 mb-2">Predicted Target</span>
            <span className="text-5xl font-bold text-green-400">${data.forecast.predictedRevenue.toLocaleString()}</span>
            <div className="flex gap-4 mt-4 text-xs font-mono text-gray-500">
              <span>Lower Bound: ${data.forecast.confidenceBoundLower.toLocaleString()}</span>
              <span>Upper Bound: ${data.forecast.confidenceBoundUpper.toLocaleString()}</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-400 mb-3">Key Drivers (AI Identified)</h3>
          <div className="space-y-3">
            {Object.entries(data.forecast.keyDrivers).map(([key, val]: any) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300 font-mono text-sm">{key}</span>
                <span className={`font-bold ${val.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly & Fraud Detection Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-gray-200">Autonomous Fraud & Anomaly Detection</h2>
          
          <div className="space-y-4">
            {data.activeAlerts.map((alert: any) => (
              <div key={alert.id} className="bg-gray-950 border border-red-900/50 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-400">{alert.type}</span>
                    <span className="bg-amber-900/50 text-amber-500 text-xs px-2 py-0.5 rounded-full font-bold">
                      Risk: {alert.score}/100
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.status}</span>
                </div>
                
                <div className="pl-2 mt-3">
                  <p className="text-xs text-gray-500 mb-1">AI Evidence Log:</p>
                  <pre className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-400 whitespace-pre-wrap border border-gray-800">
                    {JSON.stringify(alert.evidence, null, 2)}
                  </pre>
                </div>
                
                <div className="flex gap-2 mt-4 pl-2">
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-4 py-2 rounded-lg text-gray-300 transition-colors">
                    Investigate
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-xs px-4 py-2 rounded-lg text-gray-300 transition-colors">
                    Flag for Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {data.activeAlerts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No financial anomalies detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
