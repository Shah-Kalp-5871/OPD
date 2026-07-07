import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Search,
  Pill,
  Trash2
} from 'lucide-react';
import api from '@/lib/api';
import { aiApi } from '@/lib/api/ai';
import { toast } from 'sonner';
import { Button, TextArea, Badge } from './ClinicalDesignSystem';

import { useDrugSearch } from '@/hooks/useDrugSearch';

interface PrescriptionTabProps {
  caseId: string;
  data: any;
  onPrescriptionAdded?: () => void;
  onSaveAndNext?: () => void;
}

export interface PrescriptionRow {
  id: string;
  drugId?: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: number | string;
  totalQty: number | string;
  instructions: string;
  isSimple?: boolean;
  unitPrice?: number;
  formulation?: string;
}

const PrescriptionTab: React.FC<PrescriptionTabProps> = ({ caseId, data, onPrescriptionAdded, onSaveAndNext }) => {
  const [rows, setRows] = useState<PrescriptionRow[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search Autocomplete state
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Only fire search after 2+ chars typed
  const debouncedQuery = searchQuery.length >= 2 ? searchQuery : '';
  const { results: filteredDrugs, isLoading: searchLoading } = useDrugSearch(debouncedQuery);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // AI Safety State
  const [aiSafetyReport, setAiSafetyReport] = useState<any>(null);
  const [checkingSafety, setCheckingSafety] = useState(false);

  const patientId = data?.case?.patientId || '';
  const branchId = data?.case?.branchId || 'default-branch';
  const chiefComplaint = data?.complaint?.chiefComplaint || '';
  const commonFrequencies = [
    '1-0-1', '1-0-0', '0-1-0', '0-0-1', '1-1-1', '1-1-1-1', 
    'OD (Once Daily)', 'BD (Twice Daily)', 'TDS (Thrice Daily)', 'QID (Four Times a Day)', 
    'SOS (As Needed)', 'HS (At Bedtime)', 'Stat (Immediately)', 
    'Q4H (Every 4 Hours)', 'Q6H (Every 6 Hours)', 'Q8H (Every 8 Hours)'
  ];

  const commonDosages = [
    '1 Tab', '1/2 Tab', '2 Tabs', '5 ml', '10 ml', '15 ml', '1 Cap', '2 Caps', '1 Sachet', '2 Drops', 'Apply Locally'
  ];

  const commonInstructions = [
    'After Food (PC)', 'Before Food (AC)', 'Empty Stomach', 'With Milk', 'With Warm Water', 'At Bedtime', 'Apply twice daily', 'As directed by physician'
  ];

  // Initialize with one empty row
  useEffect(() => {
    if (rows.length === 0) {
      addEmptyRow();
    }
  }, []);

  // Auto-scroll to bottom when new row is added
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [rows.length]);

  // Position portal dropdown relative to the focused input
  const updateDropdownPos = useCallback(() => {
    if (activeInputRef.current) {
      const rect = activeInputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 440),
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

  // Close dropdown when clicking outside
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
    setRows(prev => [
      ...prev,
      { 
        id: crypto.randomUUID(), 
        drugName: '', 
        dosage: '', 
        frequency: '1-0-1', 
        duration: 5, 
        totalQty: 10, 
        instructions: '' 
      }
    ]);
  };

  // Trigger real-time clinical safety checks whenever items are modified
  useEffect(() => {
    const activeDrugs = rows.filter(r => r.drugId);
    if (activeDrugs.length > 0) {
      runSafetyCrossCheck(activeDrugs);
    } else {
      setAiSafetyReport(null);
    }
  }, [rows.length]); // Optimistic: trigger mainly when row count changes to save API calls

  const runSafetyCrossCheck = async (activeDrugs: PrescriptionRow[]) => {
    try {
      setCheckingSafety(true);
      const drugList = activeDrugs.map(item => item.drugName);
      
      const res = await aiApi.getClinicalSuggestions({
        caseId,
        patientId,
        branchId,
        chiefComplaint,
        prescribedDrugs: drugList
      });

      if (res && res.data && res.data.suggestions) {
        setAiSafetyReport(res.data.suggestions);
      }
    } catch (err) {
      console.error('AI Safety cross check failed', err);
    } finally {
      setCheckingSafety(false);
    }
  };

  const calculateQty = (freq: string, days: number | string): number | string => {
    const numDays = Number(days) || 0;
    let perDay = 1;
    if (freq === '1-0-0' || freq === '0-1-0' || freq === '0-0-1' || freq === 'OD') perDay = 1;
    else if (freq === '1-0-1' || freq === 'BD') perDay = 2;
    else if (freq === '1-1-1' || freq === 'TDS') perDay = 3;
    else if (freq === 'SOS') return 'As needed';
    
    const total = perDay * numDays;
    return total === 0 ? 'Take from outside' : total;
  };

  const updateRow = (id: string, field: keyof PrescriptionRow, value: any) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        // Auto calculate total if frequency or duration changes
        if (field === 'frequency' || field === 'duration') {
          updatedRow.totalQty = calculateQty(updatedRow.frequency, updatedRow.duration);
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const selectDrug = (rowId: string, drug: any) => {
    setRows(prev => {
      const newRows = prev.map(row => {
        if (row.id === rowId) {
          const dosage = drug.formulation === 'TAB' ? '1 Tablet' : '';
          return {
            ...row,
            drugId: drug.id,
            drugName: drug.drugName,
            formulation: drug.formulation,
            dosage,
            isSimple: drug.drugCategory === 'SIMPLE' || drug.category === 'SIMPLE',
            unitPrice: Number(drug.unitPrice) || 0,
            searchQuery: '' // clear local search query
          };
        }
        return row;
      });

      // If the row we just populated was the last row, append a new empty row
      const isLastRow = prev[prev.length - 1].id === rowId;
      if (isLastRow) {
        return [
          ...newRows,
          { id: crypto.randomUUID(), drugName: '', dosage: '', frequency: '1-0-1', duration: 5, totalQty: 10, instructions: '' }
        ];
      }
      return newRows;
    });

    setFocusedRowId(null);
    setSearchQuery('');
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) {
      // If it's the last row, just clear it instead of removing
      setRows([{ id: crypto.randomUUID(), drugName: '', dosage: '', frequency: '1-0-1', duration: 5, totalQty: 10, instructions: '' }]);
    } else {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handlePlacePrescription = async () => {
    // Only submit rows that have a selected drug
    const validItems = rows.filter(r => r.drugId);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid medication');
      return;
    }
    
    try {
      setSubmitting(true);
      await api.post(`/consultation/${caseId}/prescriptions`, {
        items: validItems.map(item => ({
          drugId: item.drugId,
          drugName: item.drugName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: Number(item.duration) || 0,
          instructions: item.instructions,
          route: 'Oral', // default for now, or add column
          formulation: item.formulation,
          isSimple: item.isSimple,
          unitPrice: item.unitPrice,
          totalQty: item.totalQty
        })),
        notes
      });
      
      toast.success('Prescription created successfully');
      
      // Log accepted outcome in AI safety ledger
      if (aiSafetyReport?.logId) {
        try {
          await aiApi.recordSuggestionOutcome({
            logId: aiSafetyReport.logId,
            outcome: 'ACCEPTED',
            reviewNotes: 'Prescription signed and saved after AI safety checks.'
          });
        } catch (err) {
          console.error(err);
        }
      }

      if (onPrescriptionAdded) onPrescriptionAdded();
    } catch (error) {
      console.error('Failed to create prescription', error);
      toast.error('Failed to save prescription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 font-black text-lg tracking-tight">Prescription Entry</h2>
          <p className="text-xs text-slate-500 font-medium">Search and select items to build the prescription.</p>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="flex-1 overflow-auto pb-48" ref={tableContainerRef}>
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[35%]">Item Name</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[15%]">Dosage</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[15%]">Frequency</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[8%] text-center">Days</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[7%] text-center">Total</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 w-[15%]">Note</th>
              <th className="px-3 py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 w-[5%] text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-3 py-2 relative border-r border-slate-200 align-top">
                  <div className="relative">
                    {row.drugId ? (
                      <div className="flex items-center justify-between py-1.5">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            {row.isSimple ? <span className="text-blue-600 mr-1.5 font-black text-[11px] px-1 bg-blue-100 rounded">S</span> : null}
                            {row.drugName}
                          </span>
                          {row.formulation && <Badge variant="slate" className="ml-2 text-[10px] bg-slate-100 font-bold">{row.formulation}</Badge>}
                        </div>
                        <button 
                          onClick={() => updateRow(row.id, 'drugId', undefined)}
                          className="text-[10px] text-blue-600 hover:underline font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                        <input 
                          type="text"
                          placeholder="Type 2+ chars to search..."
                          className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 focus:border-blue-500 rounded-lg text-sm font-semibold text-slate-900 outline-none shadow-sm transition-all placeholder:text-slate-400"
                          value={focusedRowId === row.id ? searchQuery : row.drugName}
                          ref={focusedRowId === row.id ? (el) => { activeInputRef.current = el; } : undefined}
                          onFocus={(e) => {
                            activeInputRef.current = e.currentTarget;
                            setFocusedRowId(row.id);
                            setSearchQuery(row.drugName);
                            updateDropdownPos();
                          }}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            updateRow(row.id, 'drugName', e.target.value);
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
                <td className="px-3 py-2 border-r border-slate-200 align-top relative">
                  <input 
                    list="dosage-options"
                    type="text"
                    value={row.dosage}
                    onChange={(e) => updateRow(row.id, 'dosage', e.target.value)}
                    placeholder="e.g. 1 Tab"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                  />
                  <datalist id="dosage-options">
                    {commonDosages.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </datalist>
                </td>
                <td className="px-3 py-2 border-r border-slate-200 align-top relative">
                  <input 
                    list="frequency-options"
                    value={row.frequency}
                    onChange={(e) => updateRow(row.id, 'frequency', e.target.value)}
                    placeholder="Select or Type..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-800 outline-none transition-all"
                  />
                  <datalist id="frequency-options">
                    {commonFrequencies.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </datalist>
                </td>
                <td className="px-3 py-2 border-r border-slate-200 align-top text-center">
                  <input 
                    type="number"
                    min="1"
                    value={row.duration}
                    onChange={(e) => updateRow(row.id, 'duration', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 hover:border-slate-300 rounded-lg text-sm font-bold text-slate-800 outline-none transition-all text-center"
                  />
                </td>
                <td className="px-3 py-2 border-r border-slate-200 align-top">
                  <div className="px-2 py-1.5 mt-0.5 text-sm font-black text-slate-700 text-center">
                    {row.totalQty}
                  </div>
                </td>
                <td className="px-3 py-2 border-r border-slate-200 align-top relative">
                  <input 
                    list="instructions-options"
                    type="text"
                    value={row.instructions}
                    onChange={(e) => updateRow(row.id, 'instructions', e.target.value)}
                    placeholder="Notes"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400"
                  />
                  <datalist id="instructions-options">
                    {commonInstructions.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </datalist>
                </td>
                <td className="px-2 py-2 align-top text-center">
                  <button 
                    onClick={() => removeRow(row.id)}
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

      {/* FOOTER SECTION: AI Safety + Submit */}
      <div className="bg-slate-50 border-t border-slate-200 p-6 space-y-6">
        
        {/* Real-time AI Safety Cross Check Indicators */}
        {checkingSafety && (
          <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-600 font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            Cross-checking patient history, allergies & drug interactions...
          </div>
        )}

        {aiSafetyReport && !checkingSafety && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSafetyReport.allergyWarnings?.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-800 space-y-2">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Allergy Risk
                </div>
                <ul className="list-disc pl-4 font-bold space-y-1">
                  {aiSafetyReport.allergyWarnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            
            {aiSafetyReport.drugInteractions?.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Drug Interactions
                </div>
                <ul className="list-disc pl-4 font-bold space-y-1">
                  {aiSafetyReport.drugInteractions.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            
            {aiSafetyReport.duplicateTherapies?.length > 0 && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-800 space-y-2">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-indigo-900">
                  <AlertCircle className="w-4 h-4 text-indigo-500" /> Duplicate Therapy
                </div>
                <ul className="list-disc pl-4 font-bold space-y-1">
                  {aiSafetyReport.duplicateTherapies.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex items-end gap-6">
          <div className="flex-1">
            <TextArea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General clinical notes for this prescription..."
              className="min-h-[80px] bg-white text-sm shadow-sm"
              label="Prescription Notes"
            />
          </div>
          <div className="w-[300px] flex flex-col gap-3">
            <Button 
              onClick={handlePlacePrescription}
              loading={submitting}
              className="w-full h-14 rounded-2xl text-xs tracking-[0.2em] shadow-xl shadow-blue-200"
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              SIGN & SEND
            </Button>
            {onSaveAndNext && (
              <Button 
                variant="secondary"
                onClick={onSaveAndNext}
                className="w-full h-12 rounded-xl text-xs tracking-widest bg-slate-200 hover:bg-slate-300 text-slate-700"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                SAVE & NEXT
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* PORTAL DROPDOWN: rendered outside DOM tree to avoid table scroll clipping */}
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
        {/* Search hint */}
        {searchQuery.length < 2 && (
          <div className="px-4 py-3 text-xs text-slate-400 font-medium border-b border-slate-100 flex items-center gap-2">
            <Search className="w-3 h-3" />
            Type at least 2 characters to search medications...
          </div>
        )}

        {searchQuery.length >= 2 && (
          <>
            {searchLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-blue-500 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching...
              </div>
            ) : filteredDrugs.length > 0 ? (
              <div className="max-h-[280px] overflow-y-auto">
                {filteredDrugs.map(drug => (
                  <div
                    key={drug.id}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur before click
                      selectDrug(focusedRowId, drug);
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{drug.drugName}</span>
                        {drug.formulation && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">{drug.formulation}</span>
                        )}
                        {(drug.drugCategory === 'SIMPLE' || drug.category === 'SIMPLE') && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-1.5 py-0.5 rounded">S</span>
                        )}
                      </div>
                      {drug.genericName && (
                        <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{drug.genericName}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-blue-600">Select →</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 font-medium">
                No medications found for "{searchQuery}"
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

export default PrescriptionTab;
