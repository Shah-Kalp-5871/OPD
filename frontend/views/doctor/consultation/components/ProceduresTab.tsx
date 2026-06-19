import React, { useState, useEffect } from 'react';
import {
  Scissors, Search, X, Clock, Calendar, Loader2, CheckCircle2,
  Info, Layers, Activity, AlertTriangle, Package,
} from 'lucide-react';
import api from '@/lib/api';
import { procedureApi, Procedure } from '@/lib/api/procedures';
import { useProcedureSearch } from '@/hooks/useProcedureSearch';
import { toast } from 'sonner';
import { Card, Button, Badge, TextArea, SectionHeader } from './ClinicalDesignSystem';

interface ProceduresTabProps {
  caseId: string;
  data: any;
  onProcedureAdded?: (procedure: any) => void;
}

const ProceduresTab: React.FC<ProceduresTabProps> = ({ caseId, data, onProcedureAdded }) => {
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const { query, setQuery, category, setCategory, results, isLoading } = useProcedureSearch();
  const [submitting, setSubmitting] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [notes, setNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  useEffect(() => {
    procedureApi.getCategories()
      .then(res => setDbCategories(res))
      .catch(() => console.error('Failed to load procedure categories'));
  }, []);

  const handleScheduleProcedure = async () => {
    if (!selectedProcedure) return;
    try {
      setSubmitting(true);
      await api.post(`/consultation/${caseId}/procedures`, {
        procedureId: selectedProcedure.id,
        notes,
        scheduledDate,
        scheduledTime
      });
      toast.success(`Procedure "${selectedProcedure.name}" scheduled successfully`);
      setSelectedProcedure(null);
      setNotes('');
      setScheduledDate('');
      setScheduledTime('');
      if (onProcedureAdded) onProcedureAdded(true);
    } catch (error) {
      console.error('Failed to schedule procedure', error);
      toast.error('Failed to schedule procedure');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 pb-12 overflow-hidden">
      {/* Left Column: Search & Catalog */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <Card className="p-0 border-none shadow-none bg-transparent">
          <div className="flex flex-col gap-6">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </div>
              <input
                type="text"
                placeholder="Search procedures (e.g. Dressing, ECG, Suturing)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-3xl text-lg font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all shadow-xl shadow-slate-100 placeholder:text-slate-300"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setCategory(undefined)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                  !category
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                ALL
              </button>
              {dbCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 pr-1 min-h-[200px]">
          {isLoading && results.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Searching Catalog...</p>
            </div>
          ) : results.length > 0 ? (
            results.map(item => {
              const isSelected = selectedProcedure?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedProcedure(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group relative flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/10'
                      : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                      <Scissors className="w-7 h-7" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className={`text-sm font-black uppercase tracking-tight leading-none ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {item.name}
                        </h3>
                        {item.code && (
                          <Badge variant="slate" className="bg-slate-100 text-[9px] tracking-widest">
                            {item.code}
                          </Badge>
                        )}
                        {item.requiresConsent && (
                          <Badge variant="amber" className="text-[9px]">Consent</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">{item.estimatedDuration} mins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold lowercase italic">{item.category ?? 'general'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-blue-600 italic tracking-tighter">₹{item.basePrice}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Base Rate</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Scissors className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">Type to search or select a category</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Session Config */}
      <div className="col-span-12 lg:col-span-5">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[650px] sticky top-6">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-black text-base leading-none mb-1">Session Config</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setup Clinical Procedure</p>
              </div>
            </div>
            {selectedProcedure && (
              <button
                onClick={() => setSelectedProcedure(null)}
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin bg-slate-50/30">
            {selectedProcedure ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{selectedProcedure.name}</h4>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">
                        {selectedProcedure.category ?? 'General'} Dept
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Duration</div>
                      <div className="text-xs font-black text-slate-700 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {selectedProcedure.estimatedDuration} Minutes
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Billing Rate</div>
                      <div className="text-xs font-black text-emerald-600 italic tracking-tight flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        ₹{selectedProcedure.basePrice}
                      </div>
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {selectedProcedure.requiresConsent && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Consent Required
                      </span>
                    )}
                    {selectedProcedure.requiresNursing && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        Nursing Req.
                      </span>
                    )}
                    {selectedProcedure.requiresRoom && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        Room Req.
                      </span>
                    )}
                  </div>

                  {/* Consumables */}
                  {selectedProcedure.consumableTemplates && selectedProcedure.consumableTemplates.length > 0 && (
                    <div className="mb-5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Package className="w-3 h-3" /> Consumables
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProcedure.consumableTemplates.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[9px] font-black">
                            {c.itemName} ×{c.defaultQuantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pre-instructions */}
                  {selectedProcedure.preInstructions && (
                    <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pre-Procedure</p>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{selectedProcedure.preInstructions}</p>
                    </div>
                  )}

                  <TextArea
                    label="Clinical Instruction / Notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add specific instructions for nursing staff or complications to watch for..."
                    className="min-h-[100px] text-[11px]"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Date</label>
                      <input 
                        type="date" 
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Time</label>
                      <input 
                        type="time" 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                  <Info className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">Billing Notice</h5>
                    <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium italic">
                      Scheduling adds ₹{selectedProcedure.basePrice} to the patient's bill immediately and notifies the nursing station.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                  <Scissors className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Select Procedure</h3>
                <p className="text-slate-300 text-[11px] font-medium mt-2 max-w-[200px]">
                  Pick a procedure from the catalog to configure and schedule
                </p>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-slate-100 space-y-4 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.02)]">
            <Button
              disabled={!selectedProcedure || submitting}
              onClick={handleScheduleProcedure}
              loading={submitting}
              className="w-full h-16 rounded-2xl text-xs tracking-[0.25em] shadow-2xl shadow-blue-200"
              icon={<Calendar className="w-5 h-5" />}
            >
              SCHEDULE &amp; PUSH TO BILL
            </Button>
            <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 italic">
              <Activity className="w-3 h-3" /> Real-time synchronization enabled
            </p>
          </div>
        </div>
      </div>
      {/* Ordered Procedures Section */}
      <div className="col-span-12 space-y-6 mt-8">
        <SectionHeader 
          title="Scheduled Procedures" 
          subtitle="Procedures requested for this case"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.procedureOrders?.length > 0 ? (
            data.procedureOrders.map((order: any) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.procedure?.name || 'Procedure'}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Scheduled: {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : 'Pending'} {order.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="blue" className="text-[8px] uppercase tracking-[0.15em] px-3">{order.status || 'SCHEDULED'}</Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {order.procedure?.requiresConsent ? 'CONSENT REQUIRED' : 'NO CONSENT'}
                    </span>
                  </div>
                  {order.procedure?.requiresConsent && (
                    <button 
                      onClick={() => window.open(`/print/consent/${order.id}`, '_blank')}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                    >
                      Generate Consent
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <Calendar className="w-10 h-10 text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Scheduled Procedures</p>
              <p className="text-xs text-slate-300 mt-2">Pick a procedure and schedule to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProceduresTab;
