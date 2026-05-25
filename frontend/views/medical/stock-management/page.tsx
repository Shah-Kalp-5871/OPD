'use client';

import React, { useState, useEffect, useRef } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  Package, 
  Search, 
  Plus, 
  History, 
  AlertCircle, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronDown,
  ArrowUpRight,
  Database,
  Filter,
  MoreVertical,
  ClipboardList,
  Pill,
  Factory,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import api from '@/lib/api';

interface Drug {
  id: string;
  drugName: string;
  drugCategory: string;
}

interface InventoryItem {
  id: string;
  drugId: string;
  branchId: string;
  totalStock: number;
  reorderLevel: number;
  drug: Drug;
  batches?: any[];
}

interface StockMovement {
  id: string;
  movementType: string;
  quantity: number;
  reason?: string;
  referenceId?: string;
  createdAt: string;
  user?: {
    name: string;
  };
  batch?: {
    batchNumber: string;
  };
}

const StockManagementView = () => {
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [allDrugs, setAllDrugs] = useState<any[]>([]);
  const [dispensingHistory, setDispensingHistory] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown state
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New Drug Modal state
  const [showNewDrugModal, setShowNewDrugModal] = useState(false);
  const [newDrugForm, setNewDrugForm] = useState({
    drugName: '',
    drugCategory: 'Tablet',
    formulation: 'Solid',
    unitOfMeasure: 'Tabs'
  });
  const [creatingDrug, setCreatingDrug] = useState(false);

  // Form state for receiving stock
  const [restockForm, setRestockForm] = useState({
    drugId: '',
    quantity: '',
    batchNumber: '',
    expiryDate: '',
    supplierId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchAllDrugs();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDrugDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedDrugId) {
      fetchHistory(selectedDrugId);
    }
  }, [selectedDrugId]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pharmacy/inventory');
      setInventoryData(res.data);
      if (res.data.length > 0 && !selectedDrugId) {
        setSelectedDrugId(res.data[0].drugId);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDrugs = async () => {
    try {
      const res = await api.get('/admin/drugs?limit=1000');
      // The API returns { data: [...], meta: {...} } or just the array depending on implementation
      setAllDrugs(res.data.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch all drugs:', error);
    }
  };

  const fetchHistory = async (drugId: string) => {
    try {
      setHistoryLoading(true);
      const res = await api.get(`/pharmacy/inventory/movements?drugId=${drugId}`);
      setDispensingHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCreateDrug = async () => {
    if (!newDrugForm.drugName) {
      alert("Drug Name is required");
      return;
    }
    try {
      setCreatingDrug(true);
      const res = await api.post('/admin/drugs', newDrugForm);
      const newDrug = res.data;
      
      await fetchAllDrugs();
      
      // Auto-select the newly created drug
      setRestockForm({ ...restockForm, drugId: newDrug.id });
      setDrugSearchQuery(newDrug.drugName);
      
      setShowNewDrugModal(false);
      setNewDrugForm({ drugName: '', drugCategory: 'Tablet', formulation: 'Solid', unitOfMeasure: 'Tabs' });
    } catch (error: any) {
      console.error('Failed to create drug:', error);
      alert(error?.response?.data?.message || 'Failed to create drug. You might need Admin permissions.');
    } finally {
      setCreatingDrug(false);
    }
  };

  const handleRestockSubmit = async () => {
    if (!restockForm.drugId || !restockForm.quantity || !restockForm.batchNumber || !restockForm.expiryDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/pharmacy/inventory/receive', {
        drugId: restockForm.drugId,
        quantity: parseInt(restockForm.quantity, 10),
        batchNumber: restockForm.batchNumber,
        expiryDate: new Date(restockForm.expiryDate).toISOString(),
        location: restockForm.supplierId
      });
      
      setSubmitSuccess(true);
      setRestockForm({
        drugId: '',
        quantity: '',
        batchNumber: '',
        expiryDate: '',
        supplierId: ''
      });
      setDrugSearchQuery('');
      
      await fetchInventory();
      if (selectedDrugId === restockForm.drugId) {
         await fetchHistory(selectedDrugId);
      }
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      console.error('Failed to receive stock:', error);
      alert(error?.response?.data?.message || 'Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatus = (item: InventoryItem) => {
    if (item.totalStock === 0) return 'OUT OF STOCK';
    if (item.totalStock <= item.reorderLevel) return 'LOW';
    return 'Normal';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'LOW': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'OUT OF STOCK': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const filteredInventory = inventoryData.filter(item => 
    item.drug.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.drug.drugCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = inventoryData.find(i => i.drugId === selectedDrugId);

  const filteredDropdownDrugs = allDrugs.filter(d => 
    d.drugName.toLowerCase().includes(drugSearchQuery.toLowerCase())
  );

  return (
    <MedicalLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
        
        {/* 🔷 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-xl shadow-slate-200">
                 <Database className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Drug Stock Management</h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-emerald-500" />
                    Central Pharmacy Inventory & Batch Tracking
                 </p>
              </div>
           </div>
           <button 
             onClick={() => document.getElementById('add-stock-section')?.scrollIntoView({ behavior: 'smooth' })}
             className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3 active:scale-95"
           >
              <Plus className="w-5 h-5" />
              Add / Update Stock
           </button>
        </div>

        {/* 🔷 MAIN INVENTORY TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative group flex-1 max-w-md">
                 <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search drugs by name or form..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" 
                 />
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => { fetchInventory(); fetchAllDrugs(); }} className="px-6 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all">Refresh</button>
              </div>
           </div>

           <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                  <p className="text-sm font-bold text-slate-500">Loading inventory data...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-white border-b border-slate-100">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Min Alert</th>
                         <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredInventory.map((row) => (
                        <tr 
                          key={row.id} 
                          onClick={() => setSelectedDrugId(row.drugId)}
                          className={`group cursor-pointer transition-all ${selectedDrugId === row.drugId ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}
                        >
                           <td className="px-8 py-6">
                              <span className={`text-[13px] font-black tracking-tight ${selectedDrugId === row.drugId ? 'text-emerald-700' : 'text-slate-800'}`}>{row.drug.drugName}</span>
                           </td>
                           <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.drug.drugCategory}</td>
                           <td className="px-6 py-6 text-center">
                              <span className={`text-[14px] font-black ${row.totalStock <= row.reorderLevel ? 'text-rose-600' : 'text-slate-700'}`}>{row.totalStock}</span>
                           </td>
                           <td className="px-6 py-6 text-center text-[12px] font-bold text-slate-400">{row.reorderLevel || 0}</td>
                           <td className="px-6 py-6">
                              <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(getStatus(row))}`}>
                                 {getStatus(row)}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                                 <ArrowUpRight className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                      ))}
                      {filteredInventory.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-bold">No inventory items found.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
              )}
           </div>
        </div>

        {/* 🔷 DRUG DETAIL & HISTORY SECTION */}
        {selectedItem && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
              {/* Left Column: Detail Summary */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <Pill className="w-24 h-24 text-emerald-50 opacity-[0.05] -rotate-12" />
                    </div>
                    <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Drug Detail</h2>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedItem.drug.drugName}</h3>
                    <div className="mt-8 space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</span>
                          <span className="text-xl font-black text-slate-800">{selectedItem.totalStock} <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Units</span></span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Alert Level</span>
                          <span className="text-lg font-black text-amber-600 underline decoration-amber-200 underline-offset-4">{selectedItem.reorderLevel || 0}</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Batches Active</span>
                          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">{selectedItem.batches?.length || 0}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Dispensing History Table */}
              <div className="lg:col-span-8">
                 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-full">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                             <History className="w-5 h-5" />
                          </div>
                          <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Stock Movement History</h2>
                       </div>
                    </div>
                    <div className="overflow-x-auto min-h-[200px]">
                       {historyLoading ? (
                          <div className="flex justify-center items-center py-12">
                             <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                          </div>
                       ) : (
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reason/Ref</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {dispensingHistory.length === 0 ? (
                               <tr>
                                  <td colSpan={5} className="py-8 text-center text-xs font-bold text-slate-400">No recent movements</td>
                               </tr>
                             ) : dispensingHistory.map((history) => (
                               <tr key={history.id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="px-8 py-5">
                                     <span className="text-[11px] font-black text-slate-800">{new Date(history.createdAt).toLocaleDateString()}</span>
                                  </td>
                                  <td className="px-6 py-5">
                                     <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                       history.movementType === 'DISPENSE' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                       history.movementType === 'RECEIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                       'bg-slate-50 text-slate-600 border-slate-200'
                                     }`}>
                                       {history.movementType}
                                     </span>
                                  </td>
                                  <td className="px-6 py-5 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                                    {history.movementType === 'DISPENSE' ? '-' : '+'}{Math.abs(history.quantity)}
                                  </td>
                                  <td className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    {history.batch?.batchNumber || '-'}
                                  </td>
                                  <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                     {history.reason || history.referenceId || '-'}
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 🔷 ADD STOCK ENTRY FORM */}
        <div id="add-stock-section" className="bg-white rounded-[3rem] border-4 border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden relative">
           {isSubmitting && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
               <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
             </div>
           )}
           <div className="p-10 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                    <Plus className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Stock Entry</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 italic">Real-time inventory update & batch linking</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <AlertCircle className="w-5 h-5 text-amber-500" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Updating stock will instantly reflect across dispensing panels.</p>
              </div>
           </div>

           <div className="p-12 space-y-12">
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Stock successfully updated!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <div className="space-y-4 relative" ref={dropdownRef}>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Drug Name <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                       <Pill className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                       <input 
                         type="text"
                         value={drugSearchQuery}
                         onChange={(e) => {
                           setDrugSearchQuery(e.target.value);
                           setShowDrugDropdown(true);
                           if (restockForm.drugId) setRestockForm({...restockForm, drugId: ''});
                         }}
                         onFocus={() => setShowDrugDropdown(true)}
                         placeholder="Search all drugs..."
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
                       />
                       <ChevronDown className={`w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform ${showDrugDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Autocomplete Dropdown Menu */}
                    {showDrugDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-[300px] flex flex-col overflow-hidden">
                        <div className="overflow-y-auto flex-1">
                          {filteredDropdownDrugs.length > 0 ? (
                            filteredDropdownDrugs.map(drug => (
                              <button
                                key={drug.id}
                                onClick={() => {
                                  setRestockForm({...restockForm, drugId: drug.id});
                                  setDrugSearchQuery(drug.drugName);
                                  setShowDrugDropdown(false);
                                }}
                                className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors focus:bg-slate-50 outline-none"
                              >
                                <div className="text-[13px] font-black text-slate-800">{drug.drugName}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{drug.drugCategory}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-6 py-8 text-center">
                              <p className="text-sm font-bold text-slate-500">No drugs found</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1">Try a different search term</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                          <button 
                            onClick={() => setShowNewDrugModal(true)}
                            className="w-full py-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Register New Drug
                          </button>
                        </div>
                      </div>
                    )}
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity Added <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                       <Package className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input 
                         type="number" 
                         value={restockForm.quantity}
                         onChange={(e) => setRestockForm({...restockForm, quantity: e.target.value})}
                         placeholder="Enter units" 
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-emerald-600">Batch Number <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                       <Database className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input 
                         type="text" 
                         value={restockForm.batchNumber}
                         onChange={(e) => setRestockForm({...restockForm, batchNumber: e.target.value})}
                         placeholder="e.g. BATCH-2026-X" 
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expiry Date <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                       <Calendar className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input 
                         type="date" 
                         value={restockForm.expiryDate}
                         onChange={(e) => setRestockForm({...restockForm, expiryDate: e.target.value})}
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                 </div>
                 <div className="space-y-4 lg:col-span-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Supplier / Manufacturer</label>
                    <div className="relative group">
                       <Factory className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input 
                         type="text" 
                         value={restockForm.supplierId}
                         onChange={(e) => setRestockForm({...restockForm, supplierId: e.target.value})}
                         placeholder="Enter supplier name or pharma co." 
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex flex-col items-center border-t border-slate-100 gap-8">
                 <button 
                   onClick={handleRestockSubmit}
                   disabled={isSubmitting}
                   className="px-24 py-7 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black transition-all active:scale-[0.97] flex items-center gap-4 group disabled:opacity-50 disabled:pointer-events-none"
                 >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 group-hover:scale-125 transition-transform" />
                    )}
                    SAVE STOCK UPDATE
                 </button>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-slate-200" />
                    MedFlow Secure Inventory System
                    <div className="w-8 h-[1px] bg-slate-200" />
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* 🔷 CREATE NEW DRUG MODAL */}
      {showNewDrugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">Register New Drug</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add to master database</p>
              </div>
              <button 
                onClick={() => setShowNewDrugModal(false)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drug Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  value={newDrugForm.drugName}
                  onChange={e => setNewDrugForm({...newDrugForm, drugName: e.target.value})}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input 
                    type="text"
                    value={newDrugForm.drugCategory}
                    onChange={e => setNewDrugForm({...newDrugForm, drugCategory: e.target.value})}
                    placeholder="e.g. Tablet"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit of Measure</label>
                  <input 
                    type="text"
                    value={newDrugForm.unitOfMeasure}
                    onChange={e => setNewDrugForm({...newDrugForm, unitOfMeasure: e.target.value})}
                    placeholder="e.g. Tabs, ml"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleCreateDrug}
                disabled={creatingDrug || !newDrugForm.drugName}
                className="w-full mt-4 py-5 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                {creatingDrug ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Save to Master Database
              </button>
            </div>
          </div>
        </div>
      )}
    </MedicalLayout>
  );
};

export default StockManagementView;
