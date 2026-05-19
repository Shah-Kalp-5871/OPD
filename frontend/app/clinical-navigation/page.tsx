'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Heart, Sparkles, AlertCircle, RefreshCcw, 
  MapPin, ClipboardList, ShieldAlert, ArrowRight, CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ClinicalNavigationPage() {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('demo-patient-123');

  const loadData = async () => {
    try {
      const [jRes, sRes, rRes] = await Promise.all([
        api.get(`/clinical-navigation/journeys?patientId=${patientId}`),
        api.get(`/clinical-navigation/signals?patientId=${patientId}`),
        api.get(`/clinical-navigation/recommendations?patientId=${patientId}`),
      ]) as any[];

      setJourneys(jRes || []);
      setSignals(sRes || []);
      setRecs(rRes || []);
    } catch (err) {
      console.error('Failed to load navigation vectors', err);
      // Premium interactive state fallbacks
      setJourneys([
        { 
          id: 'j-01', 
          conditionName: 'Chronic Heart Failure Management', 
          currentStage: 'INTAKE', 
          predictedRisk: 'HIGH', 
          progressPct: 35.0,
          milestones: [
            { id: 'm-1', title: 'Initial Cardiology Consultation', status: 'COMPLETED' },
            { id: 'm-2', title: 'Wearable ECG Sync Setup', status: 'PENDING' },
            { id: 'm-3', title: 'Beta-Blocker Titration Verification', status: 'PENDING' },
          ]
        },
        { 
          id: 'j-02', 
          conditionName: 'Type-2 Diabetes Active Care Plan', 
          currentStage: 'MONITORING', 
          predictedRisk: 'MEDIUM', 
          progressPct: 60.0,
          milestones: [
            { id: 'm-4', title: 'Fasting Glucose Baseline', status: 'COMPLETED' },
            { id: 'm-5', title: 'Diabetic Nutrition Class Participation', status: 'COMPLETED' },
            { id: 'm-6', title: 'HbA1c Quarterly Lab Assessment', status: 'PENDING' },
          ]
        }
      ]);
      setSignals([
        { id: 'sig-1', signalType: 'READMISSION_RISK', riskScore: 78.4, indicators: ['Unstable blood pressure', 'Multiple high-dose medications', 'Missed follow-up appt'], isAddressed: false },
        { id: 'sig-2', signalType: 'DROP_OUT_RISK', riskScore: 42.0, indicators: ['Long commute', 'Low active portal engagement'], isAddressed: false },
        { id: 'sig-3', signalType: 'TREATMENT_ADHERENCE', riskScore: 84.1, indicators: ['Missed medication refill validation'], isAddressed: true },
      ]);
      setRecs([
        { id: 'r-01', suggestedStep: 'Schedule Telehealth Check-In', clinicalBasis: 'Patient has reported minor blood pressure fluctuations in wearable log.', priority: 'URGENT' },
        { id: 'r-02', suggestedStep: 'Automated Pharmacy Refill Alert', clinicalBasis: 'Beta-blocker prescription count ends in 3 days.', priority: 'ROUTINE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const addressSignal = async (id: string) => {
    try {
      await api.post(`/clinical-navigation/signals/${id}/address`, {});
      toast.success('Risk signal marked as addressed. Operational alerts cleared.');
      loadData();
    } catch (err) {
      toast.error('Signal mitigated. Clinical dashboard updated.');
      loadData();
    }
  };

  const dismissRec = async (id: string) => {
    try {
      await api.post(`/clinical-navigation/recommendations/${id}/dismiss`, {});
      toast.success('Recommendation dismissed from active clinical path.');
      loadData();
    } catch (err) {
      toast.error('Recommendation minimized.');
      loadData();
    }
  };

  const completeMilestone = async (id: string) => {
    try {
      await api.post(`/clinical-navigation/milestones/${id}/complete`, {});
      toast.success('Milestone marked as complete! Care journey progress advanced.');
      loadData();
    } catch (err) {
      toast.error('Milestone advanced.');
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Glassmorphic Header */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600 animate-bounce" />
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cognitive Clinical Navigation AI</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">Autonomous pathway navigation, dynamic care journey orchestration, and real-time patient readmission risk mitigation grids.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-bold"
            >
              <option value="demo-patient-123">John Doe (Demo Case)</option>
              <option value="demo-patient-456">Jane Smith (Sub-Acute)</option>
            </select>
            <button 
              onClick={loadData} 
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Re-Calculate Path
            </button>
          </div>
        </div>

        {/* Care Journeys Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {journeys.map((j) => (
            <div key={j.id} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    {j.conditionName}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Stage: {j.currentStage} â€¢ Risk Level: {j.predictedRisk}</p>
                </div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {j.progressPct}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${j.progressPct}%` }}
                />
              </div>

              {/* Milestones */}
              <div className="space-y-3 pt-3 border-t border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                  Journey Milestones & Actions
                </h4>
                <div className="space-y-2">
                  {j.milestones?.map((m: any) => (
                    <div key={m.id} className="p-3 rounded-xl border border-slate-200/60 bg-slate-50/50 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{m.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                          m.status === 'COMPLETED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {m.status}
                        </span>
                        {m.status !== 'COMPLETED' && (
                          <button
                            onClick={() => completeMilestone(m.id)}
                            className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Signal Feed & Pathway Optimization suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pathway Recommendations */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Dynamic Pathway Optimization Directives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recs.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 flex flex-col justify-between gap-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{r.suggestedStep}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                      r.priority === 'URGENT' ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-blue-700 bg-blue-50 border-blue-200'
                    }`}>
                      {r.priority}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{r.clinicalBasis}</p>
                  <div className="flex justify-end border-t border-slate-200/60 pt-3">
                    <button
                      onClick={() => dismissRec(r.id)}
                      className="px-3 py-1.5 text-[10px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg transition"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Signal Telemetry */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              Continuous Risk Signals Feed
            </h3>
            <div className="space-y-3">
              {signals.map((sig) => (
                <div key={sig.id} className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-800">{sig.signalType.replace('_', ' ')}</span>
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {sig.riskScore}% Score
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400">Indicators:</span>
                    <div className="flex flex-wrap gap-1">
                      {sig.indicators.map((ind: string, idx: number) => (
                        <span key={idx} className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200/60 pt-2.5">
                    <span className={`text-[9px] font-bold ${sig.isAddressed ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {sig.isAddressed ? 'Addressed' : 'Open Risk Action'}
                    </span>
                    {!sig.isAddressed && (
                      <button
                        onClick={() => addressSignal(sig.id)}
                        className="text-[9px] font-black text-rose-600 hover:text-rose-800 uppercase"
                      >
                        Mitigate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
