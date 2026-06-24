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
  History
} from 'lucide-react';
import api from '@/lib/api';
import { labApi, LabCategory, LabParameter } from '@/lib/api/lab';
import { useLabSearch } from '@/hooks/useLabSearch';
import { toast } from 'sonner';
import { Card, Button, Badge, SectionHeader, Input } from './ClinicalDesignSystem';

interface InvestigationsTabProps {
  caseId: string;
  data: any;
  onOrderAdded?: (order: any) => void;
}

const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ caseId, data, onOrderAdded }) => {
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

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, [caseId]);

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
              <div className="relative group">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1 min-h-[200px]">
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
                      p-5 rounded-2xl border transition-all cursor-pointer group relative flex items-center justify-between
                      ${isSelected 
                        ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-500/10' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-100'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className={`text-xs font-black uppercase tracking-tight leading-none mb-1.5 truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="slate" className="bg-slate-100 text-[8px] tracking-widest truncate max-w-[80px]">{item.category?.name}</Badge>
                          <span className="text-[11px] font-black text-indigo-600 italic">₹{item.basePrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-4 h-4" />}
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
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[650px] sticky top-6">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-base leading-none mb-1">Order Cart</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pendingOrders.length} Items Selected</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => (
                  <div key={order.id} className="group relative bg-slate-50/50 border border-slate-100 rounded-[24px] p-5 hover:border-indigo-200 hover:bg-white transition-all animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-slate-900 font-black text-sm tracking-tight mb-1">{order.name}</h4>
                        <Badge variant="blue" className="text-[8px] py-0">{order.categoryName}</Badge>
                      </div>
                      <button 
                        onClick={() => toggleOrder(order)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center active:scale-90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => toggleUrgency(order.id)}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                          ${order.urgent 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
                            : 'bg-white text-slate-400 border border-slate-100 hover:border-rose-200 hover:text-rose-500'}
                        `}
                      >
                        <AlertTriangle className={`w-3 h-3 ${order.urgent ? 'animate-pulse' : ''}`} />
                        Urgent / STAT
                      </button>
                      <span className="text-xs font-black text-indigo-600 italic tracking-tight">₹{order.basePrice}</span>
                    </div>
                  </div>
                )
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                    <FlaskConical className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Cart is Empty</h3>
                  <p className="text-slate-300 text-[11px] font-medium mt-2 max-w-[200px]">Select investigations from the catalog to build an order</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Estimated Total</span>
                <span className="text-2xl font-black text-slate-900 italic tracking-tighter">
                  ₹{pendingOrders.reduce((sum, o) => sum + o.basePrice, 0)}
                </span>
              </div>

              <Button 
                onClick={handlePlaceOrder}
                disabled={pendingOrders.length === 0 || submitting}
                loading={submitting}
                className="w-full h-16 rounded-2xl text-xs tracking-[0.25em] shadow-2xl shadow-indigo-200"
                icon={<CheckCircle2 className="w-5 h-5" />}
              >
                PLACE ORDER & BILL
              </Button>
              <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                 <Activity className="w-3 h-3" /> Orders sync instantly with Laboratory & Billing
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
          {data?.investigationOrders?.length > 0 ? (
            data.investigationOrders.map((order: any) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      <Dna className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.labParameter?.name}</h4>
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
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {documents.map(doc => (
                <div key={doc.id} onClick={() => window.open(doc.fileUrl, '_blank')} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{doc.documentType || 'Lab Report'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="slate" className="text-[8px]">{doc.fileUrl?.split('.').pop()?.toUpperCase() || 'FILE'}</Badge>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No previous reports found
                </div>
              )}
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
                  {data?.investigationOrders?.length > 0 ? (
                    data.investigationOrders.map((order: any) => (
                      <tr key={order.id}>
                        <td className="py-4 px-4 text-xs font-bold text-slate-700">{order.results?.[0]?.parameter?.name || order.labParameter?.name || 'Unknown Test'}</td>
                        <td className="py-4 px-4"><Input placeholder="Value" className="h-8 text-xs w-24" /></td>
                        <td className="py-4 px-4 text-[10px] font-medium text-slate-500">{order.results?.[0]?.parameter?.normalRange || order.labParameter?.normalRange || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-xs font-medium text-slate-400 italic">No lab parameters ordered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button icon={<CheckCircle2 className="w-4 h-4" />}>Save Values</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigationsTab;
