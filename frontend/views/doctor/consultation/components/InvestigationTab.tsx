import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Search, 
  Plus, 
  X, 
  AlertTriangle, 
  ChevronRight, 
  Info, 
  Clock, 
  Loader2, 
  CheckCircle2,
  ShoppingCart,
  Dna,
  Activity,
  FileText,
  History,
  AlertCircle
} from 'lucide-react';
import api, { secureFileUrl } from '@/lib/api';
import { labApi, LabCategory, LabParameter } from '@/lib/api/lab';
import { useLabSearch } from '@/hooks/useLabSearch';
import { toast } from 'sonner';
import { Card, Button, Badge, SectionHeader, Input } from './ClinicalDesignSystem';

interface InvestigationsTabProps {
  caseId: string;
  data: any;
  onOrderAdded?: (order: any) => void;
  onSaveAndNext?: () => void;
}

const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ caseId, data, onOrderAdded, onSaveAndNext }) => {
  const [categories, setCategories] = useState<LabCategory[]>([]);
  const { 
    query, 
    setQuery, 
    categoryId, 
    setCategoryId, 
    results: filteredMasters, 
    isLoading 
  } = useLabSearch();
  
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'ORDER' | 'RESULTS'>('ORDER');
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Results State
  const [labValues, setLabValues] = useState<Record<string, { value: string, parameterId: string, orderId: string }>>({});
  const [savingResults, setSavingResults] = useState(false);
  const [historicalReports, setHistoricalReports] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
    fetchHistoricalReports();
  }, [caseId]);

  useEffect(() => {
    if (activeSubTab === 'RESULTS') {
      fetchHistoricalReports();
      fetchDocuments();
    }
  }, [activeSubTab]);

  const fetchHistoricalReports = async () => {
    try {
      const res = await api.get(`/consultation/${caseId}/investigations/history`);
      setHistoricalReports(res.data);
    } catch (error) {
      console.error('Failed to fetch historical reports', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/consultation/${caseId}/documents`);
      setDocuments(res.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await labApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const toggleOrder = (item: LabParameter) => {
    if (pendingOrders.find(o => o.id === item.id)) {
      setPendingOrders(prev => prev.filter(o => o.id !== item.id));
    } else {
      setPendingOrders(prev => [...prev, { 
        id: item.id, 
        name: item.name, 
        categoryName: item.category?.name || 'Test',
        basePrice: item.basePrice,
        urgent: false 
      }]);
    }
  };

  const toggleUrgency = (id: string) => {
    setPendingOrders(prev => prev.map(o => 
      o.id === id ? { ...o, urgent: !o.urgent } : o
    ));
  };

  const handlePlaceOrder = async () => {
    if (pendingOrders.length === 0) return;
    
    try {
      setSubmitting(true);
      const orders = pendingOrders.map(o => ({
        id: o.id, // Backend CreateInvestigationOrderDto expects 'id' as the LabParameter ID
        urgent: o.urgent,
      }));
      
      await api.post(`/consultation/${caseId}/investigations`, { orders });
      
      toast.success(`${pendingOrders.length} Investigations ordered successfully`);
      setPendingOrders([]);
      if (onOrderAdded) onOrderAdded(true);
    } catch (error) {
      console.error('Failed to place orders', error);
      toast.error('Failed to place investigation orders');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'LAB_REPORT');
      
      await api.post(`/consultation/${caseId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(false);
      // reset file input
      e.target.value = '';
    }
  };

  const handleValueChange = (orderId: string, parameterId: string, value: string) => {
    setLabValues(prev => ({
      ...prev,
      [orderId]: { orderId, parameterId, value }
    }));
  };

  const handleSaveResults = async () => {
    const resultsToSave = Object.values(labValues).filter(v => v.value.trim() !== '');
    if (resultsToSave.length === 0) return;
    
    try {
      setSavingResults(true);
      // Group by orderId
      const byOrder = resultsToSave.reduce((acc, curr) => {
        if (!acc[curr.orderId]) acc[curr.orderId] = [];
        acc[curr.orderId].push({ parameterId: curr.parameterId, value: curr.value });
        return acc;
      }, {} as Record<string, any[]>);

      for (const [orderId, results] of Object.entries(byOrder)) {
        await api.post(`/consultation/investigations/${orderId}/results`, { results });
      }

      toast.success('Lab results saved successfully');
      setLabValues({});
      if (onOrderAdded) onOrderAdded(true);
    } catch (error) {
      console.error('Failed to save results', error);
      toast.error('Failed to save lab results');
    } finally {
      setSavingResults(false);
    }
  };

  const isAbnormal = (value: string, parameter: any) => {
    if (!value || isNaN(Number(value)) || !parameter) return false;
    const num = Number(value);
    
    if (parameter.criticalHigh && num > parameter.criticalHigh) return true;
    if (parameter.criticalLow && num < parameter.criticalLow) return true;

    if (parameter.referenceRanges && parameter.referenceRanges.length > 0) {
      const patientGender = data?.patientCase?.patient?.gender;
      const matchingRange = parameter.referenceRanges.find((r: any) => !r.gender || r.gender === patientGender) || parameter.referenceRanges[0];
      
      if (matchingRange) {
        if (matchingRange.minValue && num < matchingRange.minValue) return true;
        if (matchingRange.maxValue && num > matchingRange.maxValue) return true;
      }
    }
    
    return false;
  };

  const getNormalRangeString = (parameter: any) => {
    if (!parameter) return 'N/A';
    const patientGender = data?.patientCase?.patient?.gender;
    const range = parameter.referenceRanges?.find((r: any) => !r.gender || r.gender === patientGender) || parameter.referenceRanges?.[0];
    if (range && (range.minValue || range.maxValue)) {
      return `${range.minValue || 0} - ${range.maxValue || '∞'} ${parameter.unit || ''}`;
    }
    return parameter.normalRange || 'N/A';
  };

  return (
    <div className="flex flex-col space-y-8 pb-24">
      {/* Sub-Tabs for Investigation */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveSubTab('ORDER')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'ORDER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Order New Tests
          </button>
          <button 
            onClick={() => setActiveSubTab('RESULTS')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'RESULTS' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Review Results & Reports
          </button>
        </div>
      </div>

      {activeSubTab === 'ORDER' && (
        <>
          <div className="grid grid-cols-12 gap-8 overflow-hidden">
            {/* Left Column: Investigation Catalog */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
          <Card className="p-0 border-none shadow-none bg-transparent">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="relative group flex-1">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search lab tests, radiology, or profiles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-3xl text-lg font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-xl shadow-slate-100 placeholder:text-slate-300"
                  />
                </div>
                
                <button
                  onClick={() => window.open('/opd/doctor/settings/investigation', '_blank')}
                  className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-xl shadow-slate-100 transition-all active:scale-95 flex-shrink-0"
                  title="Manage Lab Catalog Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setCategoryId(undefined)}
                  className={`
                    px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border whitespace-nowrap
                    ${!categoryId 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-95' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 active:scale-95'}
                  `}
                >
                  ALL
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`
                      px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border whitespace-nowrap
                      ${categoryId === cat.id 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-95' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 active:scale-95'}
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pr-1 min-h-[200px]">
            {isLoading && filteredMasters.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Searching Catalog...</p>
              </div>
            ) : filteredMasters.length > 0 ? (
              filteredMasters.map(item => {
                const isSelected = pendingOrders.some(o => o.id === item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleOrder(item)}
                    className={`
                      p-5 rounded-[24px] border-2 transition-all duration-300 cursor-pointer group relative flex flex-col justify-between min-h-[160px]
                      ${isSelected 
                        ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-[1.02]' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1'}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 pr-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg inline-block ${isSelected ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            {item.category?.name || 'TEST'}
                          </span>
                        </div>
                        <h3 className={`text-base font-extrabold tracking-tight leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-indigo-900'}`}>
                          {item.name}
                        </h3>
                      </div>
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                        <FlaskConical className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-6">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>Base Price</span>
                        <span className={`text-xl font-black tracking-tighter leading-none ${isSelected ? 'text-white' : 'text-indigo-600'}`}>
                          ₹{item.basePrice || (item as any).price || 0}
                        </span>
                      </div>
                      
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 group-active:scale-95'}`}>
                        {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                < FlaskConical className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Type to search or select a category</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-[32px] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[750px] sticky top-6">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner shadow-white">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-extrabold text-lg tracking-tight mb-0.5">Order Cart</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pendingOrders.length} Items Selected</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-slate-50/30">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => (
                  <div key={order.id} className="group relative bg-white border border-slate-200 rounded-[24px] p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <Badge variant="slate" className="text-[9px] py-0.5 mb-2 bg-slate-100 text-slate-500">{order.categoryName}</Badge>
                        <h4 className="text-slate-900 font-extrabold text-sm tracking-tight leading-snug">{order.name}</h4>
                      </div>
                      <button 
                        onClick={() => toggleOrder(order)}
                        className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center active:scale-90 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 border-dashed">
                      <button 
                        onClick={() => toggleUrgency(order.id)}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                          ${order.urgent 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                            : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50'}
                        `}
                      >
                        <AlertTriangle className={`w-3 h-3 ${order.urgent ? 'animate-pulse' : ''}`} />
                        Urgent / STAT
                      </button>
                      <span className="text-sm font-black text-slate-900 tracking-tight">₹{order.basePrice}</span>
                    </div>
                  </div>
                )
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                    <FlaskConical className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-slate-400 font-extrabold text-sm uppercase tracking-[0.2em]">Cart is Empty</h3>
                  <p className="text-slate-400 text-xs font-medium mt-2 max-w-[200px]">Select investigations from the catalog to build an order</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t border-slate-100 space-y-5 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.03)] z-10">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  ₹{pendingOrders.reduce((sum, o) => sum + Number(o.basePrice), 0)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={pendingOrders.length === 0 || submitting}
                  loading={submitting}
                  className="w-full h-14 rounded-2xl text-xs tracking-[0.2em] shadow-xl shadow-indigo-200/50"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                >
                  PLACE ORDER & BILL
                </Button>
                
                {onSaveAndNext && (
                  <Button 
                    variant="secondary"
                    onClick={onSaveAndNext}
                    className="w-full h-14 rounded-2xl text-xs tracking-[0.2em] bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-transparent shadow-xl shadow-slate-900/20"
                    icon={<ChevronRight className="w-5 h-5" />}
                  >
                    SAVE & NEXT TAB
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                 <Activity className="w-3.5 h-3.5 text-indigo-400" /> Orders sync instantly with Laboratory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Investigations Section */}
      <div className="space-y-6">
        <SectionHeader 
          title="Recent Investigation Orders" 
          subtitle="Real-time status of diagnostic requests and available reports."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.case?.investigationOrders?.length > 0 ? (
            data.case.investigationOrders.map((order: any) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      <Dna className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.results?.[0]?.parameter?.name || 'Unknown Test'}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={order.status === 'COMPLETED' ? 'emerald' : 'amber'} 
                    className="text-[8px] uppercase tracking-[0.15em] px-3"
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {order.urgent ? 'URGENT / STAT' : 'ROUTINE'}
                    </span>
                  </div>
                  {order.status === 'COMPLETED' ? (
                    <button 
                      onClick={() => window.open(`/print/lab/${order.id}`, '_blank')}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Report
                    </button>
                  ) : (
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Processing...</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <FlaskConical className="w-10 h-10 text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Existing Orders</p>
              <p className="text-xs text-slate-300 mt-2">Place an order using the catalog to begin diagnostics.</p>
            </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'RESULTS' && (
        <div className="grid grid-cols-12 gap-8 h-[700px] overflow-hidden">
          {/* Left: Previous Reports */}
          <div className="col-span-12 lg:col-span-5 flex flex-col bg-slate-50 rounded-[2rem] border border-slate-200 p-6 overflow-hidden">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" /> Previous Reports
            </h3>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
              {/* Historical Data Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Lab History</h4>
                {historicalReports.length > 0 ? (
                  <div className="space-y-4">
                    {historicalReports.map((report: any) => {
                      const param = report.results?.[0]?.parameter;
                      return (
                      <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-center mb-3 border-b border-slate-50 pb-2">
                          <span className="text-xs font-black text-slate-800">{param?.name || 'Unknown Lab'}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-2">
                          {report.results?.map((res: any) => {
                            const val = res.numericValue ?? res.textValue;
                            if (val === null || val === undefined) return null;
                            const abnormal = isAbnormal(val, param);
                            return (
                              <div key={res.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                <span className="text-[10px] text-slate-500 font-medium">Recorded Value</span>
                                <span className={`text-xs font-black flex items-center gap-1.5 ${abnormal ? 'text-rose-600' : 'text-slate-700'}`}>
                                  {val} <span className="text-[9px] text-slate-400 font-normal">{param?.unit}</span>
                                  {abnormal && <AlertCircle className="w-3 h-3 text-rose-500" />}
                                </span>
                              </div>
                            );
                          })}
                          {report.files?.map((file: any) => (
                            <div key={file.id} className="mt-2 flex justify-between items-center bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                              <span className="text-[10px] text-indigo-500 font-medium flex items-center gap-1 truncate max-w-[180px]">
                                <FileText className="w-3 h-3 flex-shrink-0" /> {file.fileName}
                              </span>
                              <button onClick={() => window.open(secureFileUrl(file.fileUrl), '_blank')} className="text-[9px] font-bold text-white bg-indigo-500 px-3 py-1.5 rounded-md hover:bg-indigo-600 transition-colors shadow-sm">VIEW PDF</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    No historical data
                  </div>
                )}
              </div>

              {/* Uploaded Documents Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 pt-4">Uploaded Files</h4>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div key={doc.id} onClick={() => window.open(secureFileUrl(doc.fileUrl), '_blank')} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900">{doc.documentType || 'Lab Report'}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(doc.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant="slate" className="text-[8px]">{doc.fileUrl?.split('.').pop()?.toUpperCase() || 'FILE'}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    No files uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: New Report Data Entry & Master Key */}
          <div className="col-span-12 lg:col-span-7 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> Enter Lab Values
              </h3>
              <div className="relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileUpload} 
                  accept=".pdf,image/*" 
                />
                <Button size="sm" variant="secondary" icon={uploadingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4"/>}>
                  {uploadingDoc ? 'Uploading...' : 'Upload New Report'}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white/95 backdrop-blur z-10">
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter</th>
                    <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                    <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.investigationOrders?.filter((o: any) => o.status !== 'COMPLETED').length > 0 ? (
                    data.investigationOrders.filter((o: any) => o.status !== 'COMPLETED').map((order: any) => {
                      const param = order.results?.[0]?.parameter;
                      const currentVal = labValues[order.id]?.value || '';
                      const abnormal = isAbnormal(currentVal, param);

                      return (
                        <tr key={order.id} className="group">
                          <td className="py-4 px-4 text-xs font-bold text-slate-700">{param?.name || 'Unknown Test'}</td>
                          <td className="py-4 px-4 relative">
                            <Input 
                              placeholder="Value" 
                              className={`h-8 text-xs w-28 pr-8 transition-colors ${abnormal ? 'border-rose-300 text-rose-700 bg-rose-50 focus:border-rose-500 focus:ring-rose-200' : ''}`} 
                              value={currentVal}
                              onChange={(e) => handleValueChange(order.id, param?.id, e.target.value)}
                            />
                            {abnormal && (
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500" title="Abnormal value">
                                <AlertCircle className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                            {getNormalRangeString(param)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-4">
                        No pending lab orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button 
                onClick={handleSaveResults} 
                disabled={Object.values(labValues).filter(v => v.value.trim() !== '').length === 0 || savingResults}
                loading={savingResults}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Save Values
              </Button>
              {onSaveAndNext && (
                <Button variant="primary" onClick={onSaveAndNext}>
                  Save & Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigationsTab;
