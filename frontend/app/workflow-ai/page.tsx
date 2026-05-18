'use client';
import { useState, useEffect } from 'react';

const MOCK_TASKS = [
  { id: 't1', type: 'DOCTOR_ASSIGNMENT', status: 'PENDING', payload: { patientId: 'P-001', alertId: 'a1' }, created: '5 mins ago' },
  { id: 't2', type: 'REFERRAL_ROUTING', status: 'COMPLETED', payload: { patientId: 'P-042', dept: 'Cardiology' }, created: '1 hour ago' },
  { id: 't3', type: 'ICU_ESCALATION', status: 'PROCESSING', payload: { patientId: 'P-088' }, created: '12 mins ago' },
];

const MOCK_RULES = [
  { id: 'r1', name: 'Critical Deterioration Auto-Assignment', trigger: 'HIGH_RISK_ALERT', active: true },
  { id: 'r2', name: 'Abnormal Lab Triage', trigger: 'LAB_RESULT_ABNORMAL', active: true },
  { id: 'r3', name: 'Sepsis Protocol Activation', trigger: 'SEPSIS_ALERT', active: false },
];

export default function WorkflowAiDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTasks(MOCK_TASKS);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Autonomous Workflow Orchestration</h1>
          <p className="text-sm text-gray-400">AI-driven task assignment and clinical routing</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all">
          Create New Rule
        </button>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Active AI Tasks</h2>
            {loading ? (
              <p className="text-gray-500">Loading tasks...</p>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <div>
                      <h3 className="font-semibold text-gray-200">{task.type}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">Payload: {JSON.stringify(task.payload)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        task.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                        task.status === 'PROCESSING' ? 'bg-blue-900 text-blue-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-gray-600">{task.created}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">Workflow Rules Engine</h2>
            <div className="space-y-3">
              {MOCK_RULES.map(rule => (
                <div key={rule.id} className={`p-3 rounded-xl border ${rule.active ? 'bg-blue-950/20 border-blue-900' : 'bg-gray-950 border-gray-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold text-sm ${rule.active ? 'text-blue-300' : 'text-gray-500'}`}>{rule.name}</h3>
                    <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${rule.active ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Trigger: <span className="font-mono text-gray-400">{rule.trigger}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
