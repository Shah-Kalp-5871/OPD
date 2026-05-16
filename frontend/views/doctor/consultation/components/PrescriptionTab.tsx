import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  X, 
  Clock, 
  Info, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
  History,
  FileText,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, Button, Input, Badge, SectionHeader, TextArea } from './ClinicalDesignSystem';

import { useDrugSearch } from '@/hooks/useDrugSearch';

interface PrescriptionTabProps {
  caseId: string;
  data: any;
  onPrescriptionAdded?: () => void;
}

const PrescriptionTab: React.FC<PrescriptionTabProps> = ({ caseId, data, onPrescriptionAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { results: filteredDrugs, isLoading: searchLoading } = useDrugSearch(searchQuery);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [notes, setNotes] = useState('');

  const [currentDrug, setCurrentDrug] = useState<any>(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1-0-1');
  const [duration, setDuration] = useState(5);
  const [instructions, setInstructions] = useState('After Food');

  const addItem = () => {
    if (!currentDrug) return;
    
    const newItem = {
      drugId: currentDrug.id,
      drugName: currentDrug.drugName,
      dosage,
      frequency,
      duration,
      instructions,
      formulation: currentDrug.formulation
    };

    setSelectedItems(prev => [...prev, newItem]);
    setCurrentDrug(null);
    setSearchQuery(''); // Reset search after selection
    setDosage('');
    setFrequency('1-0-1');
    setDuration(5);
    setInstructions('After Food');
  };

  const removeItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlacePrescription = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setSubmitting(true);
      await api.post(`/consultation/${caseId}/prescriptions`, {
        items: selectedItems,
        notes
      });
      
      toast.success('Prescription created successfully');
      setSelectedItems([]);
      setNotes('');
      if (onPrescriptionAdded) onPrescriptionAdded();
    } catch (error) {
      console.error('Failed to create prescription', error);
      toast.error('Failed to save prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const commonFrequencies = ['1-0-0', '0-1-0', '0-0-1', '1-0-1', '1-1-1', 'OD', 'BD', 'TDS', 'SOS'];


  return (
    <div className="grid grid-cols-12 gap-8 pb-12 overflow-hidden">
      {/* Left: Drug Selection Area */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        {!currentDrug ? (
          <div className="space-y-6">
            <Card className="p-0 border-none shadow-none bg-transparent">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search medication name or generic molecule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-12 py-5 bg-white border border-slate-200 rounded-3xl text-lg font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all shadow-xl shadow-slate-100 placeholder:text-slate-300"
                  autoFocus
                />
                {searchLoading && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3 pr-1">
              {filteredDrugs.map(drug => (
                <div 
                  key={drug.id}
                  onClick={() => {
                    setCurrentDrug(drug);
                    setDosage(drug.formulation === 'TAB' ? '1 Tablet' : '');
                  }}
                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center transition-all group-hover:bg-blue-50 group-hover:scale-110">
                      <Pill className="w-7 h-7 text-slate-300 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900 font-black text-base leading-none">{drug.drugName}</h3>
                        <Badge variant="slate" className="bg-slate-100 text-[9px]">{drug.formulation}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight italic">{drug.genericName}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                          <CheckCircle2 className="w-3 h-3" /> {drug.inventory?.totalStock || 0} In Stock
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              ))}
              {filteredDrugs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">No Medications Found</h3>
                  <p className="text-slate-400 text-xs font-medium mt-1">Try searching with a generic name or check inventory.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Card 
            className="animate-in zoom-in-95 duration-300 border-2 border-blue-50 shadow-2xl shadow-blue-100/50"
            title="Dosage Configuration"
            subtitle={`Set parameters for ${currentDrug.drugName}`}
            headerAction={
              <button 
                onClick={() => setCurrentDrug(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            }
          >
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <Input
                  label="Dosage Strength"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, 1 Tab, 5ml"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Duration (Days)</label>
                    <span className="text-blue-600 font-black text-sm">{duration} Days</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Frequency Schedule</label>
                <div className="flex flex-wrap gap-2.5">
                  {commonFrequencies.map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`
                        px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border
                        ${frequency === f 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 active:scale-95' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 active:scale-95'}
                      `}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Clinical Instructions</label>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {['After Food', 'Before Food', 'Empty Stomach', 'With Milk', 'SOS'].map(inst => (
                    <button
                      key={inst}
                      onClick={() => setInstructions(inst)}
                      className={`
                        px-4 py-2 rounded-xl text-[10px] font-bold transition-all border
                        ${instructions === inst 
                          ? 'bg-slate-800 text-white border-slate-800' 
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
                <TextArea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Additional specific instructions for the patient..."
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                onClick={addItem}
                className="w-full h-14 rounded-2xl text-sm tracking-widest"
                icon={<Plus className="w-5 h-5" />}
              >
                ADD TO PRESCRIPTION
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Right: Active Prescription List */}
      <div className="col-span-12 lg:col-span-5">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[650px] sticky top-6">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-black text-base leading-none mb-1">Prescription Hub</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedItems.length} Items Selected</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <div key={index} className="group relative bg-slate-50/50 border border-slate-100 rounded-[24px] p-5 hover:border-blue-200 hover:bg-white transition-all animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-slate-900 font-black text-sm tracking-tight">{item.drugName}</h4>
                        <Badge variant="blue" className="text-[8px] py-0">{item.formulation}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
                          {item.dosage}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {item.frequency} • {item.duration} Days
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white/50 border border-slate-100 rounded-xl text-[10px] text-slate-500 font-bold italic">
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {item.instructions}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                  <Pill className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">List is Empty</h3>
                <p className="text-slate-300 text-[11px] font-medium mt-2 max-w-[200px]">Add medications from the left panel to begin prescription</p>
              </div>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.05)]">
              <TextArea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Doctor's notes for the pharmacist or patient..."
                className="min-h-[80px] bg-white text-[11px]"
                label="Clinical Notes"
              />

              <Button 
                onClick={handlePlacePrescription}
                loading={submitting}
                className="w-full h-16 rounded-2xl text-xs tracking-[0.25em] shadow-2xl shadow-blue-200"
                icon={<CheckCircle2 className="w-5 h-5" />}
              >
                SIGN & SEND PRESCRIPTION
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTab;
