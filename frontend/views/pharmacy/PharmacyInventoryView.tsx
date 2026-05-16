'use client';

import React, { useState, useEffect } from 'react';
import PharmacyLayout from '@/views/layouts/PharmacyLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  Package, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertTriangle,
  Settings2,
  Filter,
  Loader2,
  RefreshCcw,
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  History,
  TrendingUp,
  DollarSign,
  Scale
} from 'lucide-react';
import ReceiveStockModal from '@/components/pharmacy/ReceiveStockModal';
import StockAdjustmentModal from '@/components/pharmacy/StockAdjustmentModal';
import { format } from 'date-fns';

const PharmacyInventoryView = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any>({ lowStock: [], nearExpiry: [], expired: [] });
  const [valuation, setValuation] = useState<any>({ totalValue: 0, batchCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  
  // Modal States
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, alertsRes, valRes] = await Promise.all([
        api.get('/pharmacy/inventory'),
        api.get('/pharmacy/inventory/alerts'),
        api.get('/pharmacy/inventory/valuation')
      ]);
      setInventory(invRes.data);
      setAlerts(alertsRes.data);
      setValuation(valRes.data);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const openAdjustModal = (batch: any) => {
    setSelectedBatch(batch);
    setIsAdjustModalOpen(true);
  };

  const filteredInventory = inventory.filter(item => 
    item.drug?.drugName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.drug?.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PharmacyLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Drug Inventory</h1>
            <p className="text-slate-500 font-bold mt-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" />
              {inventory.length} total drug items in stock
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search drugs or generics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold w-full md:w-80 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                />
             </div>
             <button 
               onClick={fetchData}
               className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
             >
               {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> : <RefreshCcw className="w-6 h-6 text-slate-600" />}
             </button>
             <button 
                onClick={() => setIsReceiveModalOpen(true)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                STOCK INWARD
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                 <DollarSign className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Inventory Value</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                 ₹{valuation.totalValue?.toLocaleString()}
              </h3>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                 <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Low Stock Alerts</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                 {alerts.lowStock?.length || 0}
              </h3>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                 <Calendar className="w-7 h-7 text-amber-600" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Near Expiry</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                 {alerts.nearExpiry?.length || 0}
              </h3>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-slate-900">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                 <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Batches</p>
              <h3 className="text-3xl font-black text-white mt-2">
                 {valuation.batchCount || 0}
              </h3>
           </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                 <Filter className="w-5 h-5 text-slate-400" />
                 <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Filters</span>
              </div>
              <div className="flex items-center gap-2">
                 <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">All Drugs</button>
                 <button className="px-5 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Low Stock</button>
                 <button className="px-5 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Expired</button>
              </div>
           </div>
           
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-white border-b border-slate-50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Drug Details</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Stock</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reorder Level</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                       <td colSpan={6} className="px-10 py-20 text-center">
                          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Fetching Inventory...</p>
                       </td>
                    </tr>
                 ) : filteredInventory.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-10 py-20 text-center text-slate-400 font-bold">No drugs found in inventory</td>
                    </tr>
                 ) : filteredInventory.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr 
                        onClick={() => toggleRow(item.id)}
                        className={`group cursor-pointer transition-colors ${expandedRows.includes(item.id) ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                      >
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-900 shadow-sm">
                                  {expandedRows.includes(item.id) ? <ChevronUp className="w-5 h-5 text-emerald-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 uppercase">{item.drug?.drugName}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.drug?.genericName || 'No Generic Name'}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-200">
                               {item.drug?.drugCategory}
                            </span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-2">
                               <span className={`text-base font-black ${item.totalStock < item.reorderLevel ? 'text-red-600' : 'text-slate-900'}`}>
                                  {item.totalStock}
                               </span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.drug?.unitOfMeasure || 'Units'}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8 text-sm font-bold text-slate-500">
                            {item.reorderLevel}
                         </td>
                         <td className="px-10 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               item.totalStock < item.reorderLevel 
                                 ? 'bg-red-50 text-red-600 border-red-100' 
                                 : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                               {item.totalStock < item.reorderLevel ? 'Low Stock' : 'In Stock'}
                            </span>
                         </td>
                         <td className="px-10 py-8">
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                               <Settings2 className="w-5 h-5" />
                            </button>
                         </td>
                      </tr>
                      
                      {/* Expanded Batches Row */}
                      {expandedRows.includes(item.id) && (
                        <tr>
                          <td colSpan={6} className="px-10 py-0 bg-slate-50/50">
                            <div className="py-6 space-y-4">
                               <div className="flex items-center justify-between px-4">
                                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Active Batches (FEFO Order)</h4>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.batches?.length || 0} Batches Tracked</span>
                               </div>
                               
                               <div className="grid grid-cols-1 gap-3">
                                  {item.batches?.map((batch: any) => (
                                    <div key={batch.id} className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                       <div className="flex items-center gap-8">
                                          <div>
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Number</p>
                                             <p className="text-sm font-black text-slate-900 mt-1">{batch.batchNumber}</p>
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Expiry
                                             </p>
                                             <p className={`text-sm font-black mt-1 ${new Date(batch.expiryDate) < new Date() ? 'text-red-600' : 'text-slate-900'}`}>
                                                {format(new Date(batch.expiryDate), 'dd MMM yyyy')}
                                             </p>
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                                             <p className="text-sm font-black text-slate-900 mt-1">{batch.stockQuantity} {item.drug?.unitOfMeasure}</p>
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (MRP)</p>
                                             <p className="text-sm font-black text-slate-900 mt-1">₹{batch.mrp}</p>
                                          </div>
                                       </div>
                                       
                                       <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openAdjustModal(batch);
                                            }}
                                            className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                                          >
                                             <Scale className="w-4 h-4" /> Adjust
                                          </button>
                                          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                             <History className="w-4 h-4" />
                                          </button>
                                       </div>
                                    </div>
                                  ))}
                                  {(!item.batches || item.batches.length === 0) && (
                                    <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-white border border-dashed border-slate-200 rounded-3xl">
                                       No batches found for this medication
                                    </div>
                                  )}
                               </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                 ))}
              </tbody>
           </table>
        </div>

        <ReceiveStockModal 
          isOpen={isReceiveModalOpen} 
          onClose={() => setIsReceiveModalOpen(false)} 
          onSuccess={fetchData} 
        />

        <StockAdjustmentModal 
          isOpen={isAdjustModalOpen} 
          onClose={() => setIsAdjustModalOpen(false)} 
          onSuccess={fetchData} 
          batchData={selectedBatch}
        />
      </div>
    </PharmacyLayout>
  );
};

export default PharmacyInventoryView;
