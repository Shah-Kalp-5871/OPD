'use client';
import { useState } from 'react';

const admissions = [
  { id: 'va-001', patientId: 'P-001', assignedTo: 'Dr. Shah', careLevel: 'HOME_MONITORING', status: 'ACTIVE', riskScore: 25, admittedAt: '2026-05-17T10:00:00Z', tasks: [{ title: 'BP Check', status: 'PENDING', type: 'MONITORING' }, { title: 'Medication Reminder', status: 'DONE', type: 'MEDICATION' }] },
  { id: 'va-002', patientId: 'P-002', assignedTo: 'Dr. Mehta', careLevel: 'VIRTUAL_WARD', status: 'ACTIVE', riskScore: 68, admittedAt: '2026-05-18T08:30:00Z', tasks: [{ title: 'ECG Upload', status: 'PENDING', type: 'MONITORING' }] },
  { id: 'va-003', patientId: 'P-003', assignedTo: 'Dr. Patel', careLevel: 'EMERGENCY', status: 'ESCALATED', riskScore: 92, admittedAt: '2026-05-18T12:00:00Z', tasks: [{ title: 'Ambulance Dispatch', status: 'PENDING', type: 'ESCALATION' }] },
];

const careLevelColor: Record<string, string> = {
  HOME_MONITORING: 'text-blue-400 bg-blue-900/30',
  VIRTUAL_WARD: 'text-yellow-400 bg-yellow-900/30',
  EMERGENCY: 'text-red-400 bg-red-900/30',
};

export default function VirtualHospitalPage() {
  const [selected, setSelected] = useState(admissions[0]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-amber-400">Virtual Hospital</h1>
        <p className="text-sm text-gray-400">Virtual Ward Management & Care Coordination Platform</p>
      </header>
      <div className="grid grid-cols-3 gap-6 p-8">
        <div className="space-y-3">
          {admissions.map(adm => (
            <button key={adm.id} onClick={() => setSelected(adm)} className={`w-full text-left bg-gray-900 border rounded-2xl p-4 transition-all ${selected.id === adm.id ? 'border-amber-600' : 'border-gray-800 hover:border-gray-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-400">{adm.id.toUpperCase()}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${adm.status === 'ESCALATED' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>{adm.status}</span>
              </div>
              <p className="text-sm font-semibold text-gray-200">Patient: {adm.patientId}</p>
              <p className="text-xs text-gray-400 mb-2">{adm.assignedTo}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${careLevelColor[adm.careLevel]}`}>{adm.careLevel.replace('_', ' ')}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Risk</span>
                  <div className="w-16 h-1.5 rounded-full bg-gray-700">
                    <div className={`h-1.5 rounded-full ${adm.riskScore > 70 ? 'bg-red-500' : adm.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${adm.riskScore}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{adm.riskScore}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-200">Patient {selected.patientId} — Virtual Admission</h2>
              <div className="flex gap-2">
                <button className="bg-yellow-700 hover:bg-yellow-600 px-4 py-1.5 rounded-lg text-sm transition-all">Escalate</button>
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-lg text-sm transition-all">Discharge</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-3"><p className="text-xs text-gray-500 mb-1">Assigned To</p><p className="text-sm text-gray-200 font-medium">{selected.assignedTo}</p></div>
              <div className="bg-gray-800 rounded-xl p-3"><p className="text-xs text-gray-500 mb-1">Care Level</p><span className={`text-xs px-2 py-0.5 rounded-full ${careLevelColor[selected.careLevel]}`}>{selected.careLevel.replace('_', ' ')}</span></div>
              <div className="bg-gray-800 rounded-xl p-3"><p className="text-xs text-gray-500 mb-1">Risk Score</p><p className={`text-xl font-bold ${selected.riskScore > 70 ? 'text-red-400' : selected.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{selected.riskScore}%</p></div>
            </div>
            <h3 className="font-semibold text-gray-300 mb-3">Care Tasks</h3>
            <div className="space-y-2">
              {selected.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
                  <span className={`w-2 h-2 rounded-full ${task.status === 'DONE' ? 'bg-green-400' : task.type === 'ESCALATION' ? 'bg-red-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <span className="text-sm text-gray-200 flex-1">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'DONE' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
