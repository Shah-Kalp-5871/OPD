import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Search, Trash2, Edit2, Save, X, Loader2, CheckCircle2,
  Calendar, Scissors, AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';
import { useProcedureSearch } from '@/hooks/useProcedureSearch';
import { toast } from 'sonner';
import { Button } from './ClinicalDesignSystem';

interface ProceduresTabProps {
  caseId: string;
  data: any;
  onProcedureAdded?: (procedure?: any) => void;
  onSaveAndNext?: () => void;
}

export interface ProcedureBuilderRow {
  id: string;
  procedureId?: string;
  procedureName: string;
  bodyPart: string;
  totalSessions: number | string;
  followUpDays: number | string;
  rate: number | string;
}

const ProceduresTab: React.FC<ProceduresTabProps> = ({ caseId, data, onProcedureAdded, onSaveAndNext }) => {
  const doctorName = data?.doctor?.name || 'Doctor';
  const doctorId = data?.doctor?.id || '';

  // Builder Row State
  const [builderRows, setBuilderRows] = useState<ProcedureBuilderRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Search Autocomplete state
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = searchQuery.length >= 2 ? searchQuery : '';
  const { results: filteredProcedures, isLoading: searchLoading } = useProcedureSearch(20); // ignoring limits for now, just hook
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (builderRows.length === 0) {
      addEmptyRow();
    }
  }, []);

  const updateDropdownPos = useCallback(() => {
    if (activeInputRef.current) {
      const rect = activeInputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 300),
      });
    }
  }, []);

  useEffect(() => {
    if (focusedRowId) {
      updateDropdownPos();
      window.addEventListener('scroll', updateDropdownPos, true);
      window.addEventListener('resize', updateDropdownPos);
    } else {
      setDropdownPos(null);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPos, true);
      window.removeEventListener('resize', updateDropdownPos);
    };
  }, [focusedRowId, updateDropdownPos]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedDropdown = dropdownRef.current?.contains(target);
      const clickedInput = activeInputRef.current?.contains(target);
      if (!clickedDropdown && !clickedInput) {
        setFocusedRowId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addEmptyRow = () => {
    setBuilderRows(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2),
        procedureName: '',
        bodyPart: '',
        totalSessions: 1,
        followUpDays: 20,
        rate: 0
      }
    ]);
  };

  const updateBuilderRow = (id: string, field: keyof ProcedureBuilderRow, value: any) => {
    setBuilderRows(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const selectProcedure = (rowId: string, proc: any) => {
    setBuilderRows(prev => {
      const newRows = prev.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            procedureId: proc.id,
            procedureName: proc.name,
            rate: proc.basePrice || 0
          };
        }
        return row;
      });

      const isLastRow = prev[prev.length - 1].id === rowId;
      if (isLastRow) {
        return [
          ...newRows,
          { id: Math.random().toString(36).substring(2), procedureName: '', bodyPart: '', totalSessions: 1, followUpDays: 20, rate: 0 }
        ];
      }
      return newRows;
    });

    setFocusedRowId(null);
    setSearchQuery('');
  };

  const removeBuilderRow = (id: string) => {
    if (builderRows.length === 1) {
      setBuilderRows([{ id: Math.random().toString(36).substring(2), procedureName: '', bodyPart: '', totalSessions: 1, followUpDays: 20, rate: 0 }]);
    } else {
      setBuilderRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleScheduleProcedures = async () => {
    const validItems = builderRows.filter(r => r.procedureId);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid procedure');
      return;
    }

    try {
      setSubmitting(true);
      for (const item of validItems) {
        await api.post(`/consultation/${caseId}/procedures`, {
          procedureId: item.procedureId,
          sessions: Number(item.totalSessions) || 1,
          bodyPart: item.bodyPart,
          followUpDays: Number(item.followUpDays) || 0,
          isCompletedByDoctor: false
        });
      }
      toast.success('Procedures scheduled successfully');
      setBuilderRows([{ id: Math.random().toString(36).substring(2), procedureName: '', bodyPart: '', totalSessions: 1, followUpDays: 20, rate: 0 }]);
      if (onProcedureAdded) onProcedureAdded();
    } catch (error) {
      console.error('Failed to schedule procedures', error);
      toast.error('Failed to schedule procedures');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400";
  const tblInputClass = "border border-slate-200 rounded bg-slate-50 px-2 py-1.5 w-full text-xs focus:bg-white focus:border-blue-500 outline-none placeholder-slate-300";

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 font-black text-lg tracking-tight">Procedure Entry</h2>
            <p className="text-xs text-slate-500 font-medium">Search and select procedures to schedule.</p>
          </div>
          <Button 
            onClick={handleScheduleProcedures}
            loading={submitting}
            className="h-10 px-6 rounded-xl text-xs tracking-wider shadow-md"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            SCHEDULE SELECTED
          </Button>
        </div>

        {/* Builder Table */}
        <div className="overflow-x-auto border-b border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[20%]">Therapist</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[30%]">Procedure</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[15%]">Body Part</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[10%] text-center">Total Sessions</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[10%] text-center">F/U Days</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[10%] text-center">Rate</th>
                <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 w-[5%] text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {builderRows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <input type="text" readOnly value={`Dr. ${doctorName}`} className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`} />
                  </td>
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <div className="relative">
                      {row.procedureId ? (
                        <div className="flex items-center justify-between py-1.5 px-2">
                          <span className="font-bold text-slate-900 text-sm">{row.procedureName}</span>
                          <button 
                            onClick={() => updateBuilderRow(row.id, 'procedureId', undefined)}
                            className="text-[10px] text-blue-600 hover:underline font-bold"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                          <input 
                            type="text"
                            placeholder="Search procedure..."
                            className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 focus:border-blue-500 rounded-lg text-sm font-semibold text-slate-900 outline-none shadow-sm transition-all placeholder:text-slate-400"
                            value={focusedRowId === row.id ? searchQuery : row.procedureName}
                            ref={focusedRowId === row.id ? (el) => { activeInputRef.current = el; } : undefined}
                            onFocus={(e) => {
                              activeInputRef.current = e.currentTarget;
                              setFocusedRowId(row.id);
                              setSearchQuery(row.procedureName);
                              updateDropdownPos();
                            }}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              updateBuilderRow(row.id, 'procedureName', e.target.value);
                              updateDropdownPos();
                            }}
                          />
                          {searchLoading && focusedRowId === row.id && (
                            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-2.5" />
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <input 
                      type="text"
                      list="body-parts"
                      value={row.bodyPart}
                      onChange={(e) => updateBuilderRow(row.id, 'bodyPart', e.target.value)}
                      placeholder="e.g. Face"
                      className={inputClass}
                    />
                    <datalist id="body-parts">
                      <option value="Face" />
                      <option value="Arms" />
                      <option value="Legs" />
                      <option value="Full Body" />
                      <option value="Underarms" />
                    </datalist>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <input 
                      type="number"
                      min="1"
                      value={row.totalSessions}
                      onChange={(e) => updateBuilderRow(row.id, 'totalSessions', e.target.value)}
                      className={`${inputClass} text-center`}
                    />
                  </td>
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <input 
                      type="number"
                      min="0"
                      value={row.followUpDays}
                      onChange={(e) => updateBuilderRow(row.id, 'followUpDays', e.target.value)}
                      className={`${inputClass} text-center`}
                    />
                  </td>
                  <td className="px-3 py-2 border-r border-slate-200 align-top">
                    <div className="px-2 py-1.5 mt-0.5 text-sm font-black text-slate-700 text-center">
                      ₹{row.rate}
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top text-center">
                    <button 
                      onClick={() => removeBuilderRow(row.id)}
                      className="p-1.5 mt-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mx-auto block"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generated Sessions Grid (Wide Table) */}
        {data?.procedureOrders?.length > 0 && (
          <div className="flex-1 overflow-auto bg-slate-50/50">
            <table className="w-max text-left border-collapse border-t border-slate-200">
              <thead className="bg-slate-800 text-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[120px] sticky left-0 bg-slate-800 z-20">Date</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[120px]">Therapist</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[150px]">Procedure</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[120px]">Body Part</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[80px] text-center">Session</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[80px] text-center">F/U Days</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[130px]">Performed Date</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Skin Type</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[80px]">Unit</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[80px]">Power</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Wave Length</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Pulse Duration</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Spot Size</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Pulse Impuls</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Thickness</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Density</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Dot Density</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Short Fire</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[130px]">Status</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[150px]">Remark / Reason</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Rate</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-r border-slate-700 min-w-[100px]">Payment</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider border-slate-700 min-w-[90px] sticky right-0 bg-slate-800 z-20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.procedureOrders.flatMap((order: any) => {
                  if (!order.sessions || order.sessions.length === 0) return [];
                  return order.sessions.map((session: any) => (
                    <SessionRow key={session.id} caseId={caseId} procedure={order} session={session} doctorName={doctorName} />
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {focusedRowId && dropdownPos && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
        >
          {searchQuery.length < 2 && (
            <div className="px-4 py-3 text-xs text-slate-400 font-medium border-b border-slate-100 flex items-center gap-2">
              <Search className="w-3 h-3" />
              Type 2+ chars to search procedures...
            </div>
          )}

          {searchQuery.length >= 2 && (
            <>
              {searchLoading ? (
                <div className="flex items-center gap-2 px-4 py-3 text-xs text-blue-500 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
                </div>
              ) : filteredProcedures?.length > 0 ? (
                <div className="max-h-[280px] overflow-y-auto">
                  {filteredProcedures.map((proc: any) => (
                    <div
                      key={proc.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectProcedure(focusedRowId, proc);
                      }}
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{proc.name}</span>
                        </div>
                        {proc.category && (
                          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{proc.category}</div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-blue-600">₹{proc.basePrice}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 font-medium">
                  No procedures found for "{searchQuery}"
                </div>
              )}
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

const SessionRow = ({ caseId, procedure, session, doctorName }: any) => {
  const baseDate = new Date(session.createdAt || Date.now());
  const calculatedDate = new Date(baseDate);
  const totalFollowUpDays = (session.sessionNumber - 1) * (session.followUpDays || 0);
  calculatedDate.setDate(calculatedDate.getDate() + totalFollowUpDays);
  const displayDate = calculatedDate.toLocaleDateString();

  const [params, setParams] = useState({
    skinType: '', unit: '', power: '', waveLength: '', pulseDuration: '', spotSize: '', pulseImpuls: '', thickness: '', density: '', dotDensity: '', shortFire: ''
  });
  const [rate, setRate] = useState(session.rate ?? procedure.procedure?.basePrice ?? 0);
  const [discount, setDiscount] = useState(session.discount ?? 0);
  const [followUpDays, setFollowUpDays] = useState(session.followUpDays ?? '');
  const [bodyPart, setBodyPart] = useState(session.bodyPart ?? procedure.bodyPart ?? '');
  const [status, setStatus] = useState(session.status || 'SCHEDULED');
  const [paymentStatus, setPaymentStatus] = useState(session.paymentStatus || 'PENDING');
  const [performedDate, setPerformedDate] = useState(session.performedDate ? new Date(session.performedDate).toISOString().split('T')[0] : '');
  const [remarks, setRemarks] = useState(session.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session.parameters) {
      const p: any = { ...params };
      session.parameters.forEach((param: any) => {
        // map db keys to local state if needed, or just dump
        if (p[param.parameterName] !== undefined) p[param.parameterName] = param.parameterValue;
      });
      setParams(p);
    }
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/consultation/${caseId}/procedures/${session.id}`, {
        status, remarks, rate, discount, paymentStatus, performedDate, followUpDays, bodyPart, parameters: params
      });
      toast.success('Session updated successfully');
    } catch (err) {
      toast.error('Failed to update session');
    } finally {
      setSaving(false);
    }
  };

  const tblInputClass = "border border-slate-200 rounded bg-slate-50 px-2 py-1.5 w-full text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-500 outline-none placeholder-slate-300";

  return (
    <tr className="hover:bg-slate-50 transition-colors bg-white">
      <td className="px-4 py-2 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
        <div className="font-bold text-slate-800 text-xs whitespace-nowrap">{displayDate}</div>
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <div className="text-xs font-semibold text-slate-600 whitespace-nowrap">Dr. {doctorName}</div>
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <div className="font-bold text-slate-900 text-xs truncate max-w-[150px]">{procedure.procedure?.name}</div>
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <input type="text" value={bodyPart} onChange={e => setBodyPart(e.target.value)} placeholder="Body Part" className={tblInputClass} />
      </td>
      <td className="px-3 py-2 border-r border-slate-200 text-center">
        <div className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-[10px] border border-blue-100 inline-block">
          {session.sessionNumber}/{procedure.totalSessions || procedure.sessions?.length || 1}
        </div>
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <input type="number" value={followUpDays} onChange={e => setFollowUpDays(e.target.value)} placeholder="Days" className={`${tblInputClass} text-center`} />
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <input type="date" value={performedDate} onChange={e => setPerformedDate(e.target.value)} className={tblInputClass} />
      </td>
      {Object.keys(params).map(key => (
        <td key={key} className="px-3 py-2 border-r border-slate-200">
          <input type="text" value={(params as any)[key]} onChange={e => setParams({...params, [key]: e.target.value})} className={tblInputClass} placeholder={key.replace(/([A-Z])/g, ' $1').trim()} />
        </td>
      ))}
      <td className="px-3 py-2 border-r border-slate-200">
        <select value={status} onChange={e => setStatus(e.target.value)} className={tblInputClass}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Done</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NOT_TAKEN">Not Taken</option>
        </select>
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className={tblInputClass} placeholder="Reason/Note" />
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <input type="number" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className={`${tblInputClass} mb-1`} placeholder="Rate" />
        <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value))} className={tblInputClass} placeholder="Disc." />
      </td>
      <td className="px-3 py-2 border-r border-slate-200">
        <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className={tblInputClass}>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
        </select>
      </td>
      <td className="px-3 py-2 sticky right-0 bg-slate-50 border-l border-slate-200 z-10 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
        <button disabled={saving} onClick={handleSave} className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1.5 rounded flex items-center justify-center gap-1.5 w-full hover:bg-blue-700 shadow transition-colors">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          SAVE
        </button>
      </td>
    </tr>
  );
};

export default ProceduresTab;
