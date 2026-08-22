import React, { useState, useEffect } from 'react';
import { Activity, Plus, Loader2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ProcedureTabProps {
  patient: any;
  selectedCaseId: string;
  onRefresh: () => void;
}

const ProcedureTab: React.FC<ProcedureTabProps> = ({ patient, selectedCaseId, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [masterProcedures, setMasterProcedures] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);

  const [formData, setFormData] = useState({
    procedureId: '',
    notes: '',
    sessions: 1,
    bodyPart: '',
    scheduledDate: '',
    scheduledTime: '',
    isCompletedByDoctor: false
  });

  const selectedCase = patient?.cases?.find((c: any) => c.id === selectedCaseId);
  const patientProcedures = selectedCase?.patientProcedures || [];

  useEffect(() => {
    fetchMasterProcedures();
  }, []);

  const fetchMasterProcedures = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/procedures');
      const data = Array.isArray(res) ? res : (res as any).data || [];
      setMasterProcedures(data);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast.error('Failed to load procedure master list');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.procedureId) {
      toast.error('Please select a procedure');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/consultation/${selectedCaseId}/procedures`, formData);
      toast.success('Procedure scheduled successfully');
      setShowNewForm(false);
      setFormData({
        procedureId: '',
        notes: '',
        sessions: 1,
        bodyPart: '',
        scheduledDate: '',
        scheduledTime: '',
        isCompletedByDoctor: false
      });
      onRefresh();
    } catch (error: any) {
      console.error('Error scheduling procedure:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule procedure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed">
          Manage and track patient procedures for this case. You can schedule new procedures or view historical records.
        </p>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d6282] hover:bg-[#0a4d66] text-white rounded-xl font-bold transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          {showNewForm ? 'Cancel' : 'Prescribe Procedure'}
        </button>
      </div>

      {/* New Procedure Form */}
      {showNewForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Schedule New Procedure</h4>
          <form onSubmit={handleCreateProcedure} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Procedure</label>
                <select
                  value={formData.procedureId}
                  onChange={(e) => setFormData({ ...formData, procedureId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 font-medium text-slate-700"
                  required
                >
                  <option value="">Select a procedure...</option>
                  {masterProcedures.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Body Part</label>
                <input
                  type="text"
                  value={formData.bodyPart}
                  onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 font-medium text-slate-700"
                  placeholder="e.g., Lower Back, Left Knee"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sessions</label>
                <input
                  type="number"
                  min="1"
                  value={formData.sessions}
                  onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 font-medium text-slate-700"
                  placeholder="Clinical notes..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Date (Optional)</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 font-medium text-slate-700"
                />
              </div>

              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.isCompletedByDoctor}
                    onChange={(e) => setFormData({ ...formData, isCompletedByDoctor: e.target.checked })}
                    className="w-5 h-5 rounded text-[#0d6282] focus:ring-[#0d6282] border-slate-300"
                  />
                  <span className="text-sm font-bold text-slate-700">Mark first session as completed immediately</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#0d6282] hover:bg-[#0a4d66] text-white rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Schedule Procedure
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Procedures List */}
      <div className="space-y-4">
        {patientProcedures.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl border-dashed">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No procedures recorded for this case.</p>
          </div>
        ) : (
          patientProcedures.map((pp: any) => (
            <div key={pp.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h4 className="font-black text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0d6282]" />
                    {pp.procedure?.name}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(pp.createdAt).toLocaleDateString()}</span>
                    {pp.bodyPart && <span>• {pp.bodyPart}</span>}
                    <span>• {pp.completedSessions} / {pp.totalSessions} Sessions</span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase ${
                    pp.overallStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                    pp.overallStatus === 'APPROVAL_PENDING' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {pp.overallStatus.replace('_', ' ')}
                  </span>
                  {pp.overallStatus === 'APPROVAL_PENDING' && (
                    <button 
                      onClick={() => {
                        const el = document.getElementById('consent');
                        if (el) {
                          const yOffset = -140;
                          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className="ml-3 text-[10px] uppercase font-bold text-[#0d6282] hover:underline"
                    >
                      Fill Consent
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sessions</h5>
                  {pp.sessions?.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          session.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          #{session.sessionNumber}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm">
                            {session.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}
                          </p>
                          {session.notes && (
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3" /> {session.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {session.status === 'COMPLETED' ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-bold">Done</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-amber-600">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProcedureTab;
