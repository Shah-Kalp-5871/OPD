'use client';
import { useState } from 'react';

export default function AiScribePage() {
  const [showSoap, setShowSoap] = useState(false);
  const [approved, setApproved] = useState(false);
  const transcript = [
    { speaker: 'DOCTOR', text: 'How are you feeling today?', confidence: 0.98 },
    { speaker: 'PATIENT', text: 'Persistent headache and nausea for two days.', confidence: 0.95 },
    { speaker: 'DOCTOR', text: 'Any fever or light sensitivity?', confidence: 0.97 },
    { speaker: 'PATIENT', text: 'Yes, fever around 38°C and light bothers me.', confidence: 0.93 },
  ];
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">AI Clinical Scribe</h1>
          <p className="text-sm text-gray-400">Ambient Consultation Intelligence</p>
        </div>
        <button onClick={() => setShowSoap(true)} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl transition-all text-sm font-semibold">
          Generate SOAP Note
        </button>
      </header>
      <div className="grid grid-cols-3 gap-6 p-8">
        <div className="col-span-2 space-y-3">
          {transcript.map((seg, i) => (
            <div key={i} className={`flex gap-3 ${seg.speaker === 'PATIENT' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${seg.speaker === 'DOCTOR' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                {seg.speaker[0]}
              </div>
              <div className={`max-w-lg rounded-2xl px-4 py-3 ${seg.speaker === 'DOCTOR' ? 'bg-blue-950/40 border border-blue-900' : 'bg-green-950/40 border border-green-900'}`}>
                <p className="text-xs text-gray-500 mb-1">{seg.speaker}</p>
                <p className="text-sm text-gray-200">{seg.text}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-1 rounded-full bg-gray-700 flex-1">
                    <div className="h-1 rounded-full bg-green-500" style={{ width: `${seg.confidence * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(seg.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {showSoap ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-purple-400">SOAP Note</h3>
                <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full">Needs Review</span>
              </div>
              {[
                { label: 'S — Subjective', text: 'Headache and nausea for 2 days. Fever ~38°C, photophobia.' },
                { label: 'O — Objective', text: 'Temp 38°C. Photophobia present. No neck stiffness.' },
                { label: 'A — Assessment', text: 'Tension headache with photophobia.' },
                { label: 'P — Plan', text: 'Paracetamol 500mg TDS. Rest. Follow-up in 48h.' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-400 mb-1">{s.label}</p>
                  <p className="text-sm text-gray-300 bg-gray-800 rounded-xl px-3 py-2">{s.text}</p>
                </div>
              ))}
              {!approved
                ? <button onClick={() => setApproved(true)} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-xl text-sm font-semibold">✓ Approve</button>
                : <div className="text-center text-green-400 text-sm font-semibold py-2">✅ Approved</div>}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-center h-48 text-center">
              <p className="text-gray-400 text-sm">SOAP note appears here after generation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
