'use client';

import React, { useState, useEffect } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  AlertTriangle, 
  Clock, 
  XCircle,
  Package,
  Search,
  ChevronRight,
  Database,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

const AlertsView = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState({
    lowStock: [],
    nearExpiry: [],
    expired: []
  });
  const [activeTab, setActiveTab] = useState('lowStock');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pharmacy/inventory/alerts');
      setAlerts(res.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeData = activeTab === 'lowStock' ? alerts.lowStock :
                     activeTab === 'nearExpiry' ? alerts.nearExpiry :
                     alerts.expired;

  return (
    <MedicalLayout>
      <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-amber-200">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventory Alerts</h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    Critical stock levels and expiration notices
                 </p>
              </div>
           </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div 
              onClick={() => setActiveTab('lowStock')}
              className={`p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer ${
                activeTab === 'lowStock' 
                ? 'bg-amber-50 border-amber-500 shadow-xl shadow-amber-100' 
                : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'lowStock' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                 </div>
                 <h2 className={`text-4xl font-black ${activeTab === 'lowStock' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {alerts.lowStock.length}
                 </h2>
              </div>
              <h3 className="text-lg font-black text-slate-800">Low Stock</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Items at or below reorder level</p>
           </div>

           <div 
              onClick={() => setActiveTab('nearExpiry')}
              className={`p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer ${
                activeTab === 'nearExpiry' 
                ? 'bg-orange-50 border-orange-500 shadow-xl shadow-orange-100' 
                : 'bg-white border-slate-100 hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'nearExpiry' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    <Clock className="w-6 h-6" />
                 </div>
                 <h2 className={`text-4xl font-black ${activeTab === 'nearExpiry' ? 'text-orange-600' : 'text-slate-800'}`}>
                    {alerts.nearExpiry.length}
                 </h2>
              </div>
              <h3 className="text-lg font-black text-slate-800">Expiring Soon</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Batches expiring within 6 months</p>
           </div>

           <div 
              onClick={() => setActiveTab('expired')}
              className={`p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer ${
                activeTab === 'expired' 
                ? 'bg-rose-50 border-rose-500 shadow-xl shadow-rose-100' 
                : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'expired' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    <XCircle className="w-6 h-6" />
                 </div>
                 <h2 className={`text-4xl font-black ${activeTab === 'expired' ? 'text-rose-600' : 'text-slate-800'}`}>
                    {alerts.expired.length}
                 </h2>
              </div>
              <h3 className="text-lg font-black text-slate-800">Expired</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Batches past their expiry date</p>
           </div>
        </div>

        {/* ALERTS TABLE */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">
                 {activeTab === 'lowStock' && 'Low Stock Items'}
                 {activeTab === 'nearExpiry' && 'Near Expiry Batches'}
                 {activeTab === 'expired' && 'Expired Batches'}
              </h3>
              <button onClick={fetchAlerts} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all flex items-center gap-2">
                 Refresh List
              </button>
           </div>

           <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                  <p className="text-sm font-bold text-slate-500">Checking alert levels...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-white border-b border-slate-100">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                         {activeTab === 'lowStock' ? (
                           <>
                             <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                             <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Min Level</th>
                           </>
                         ) : (
                           <>
                             <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch Number</th>
                             <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Expiry Date</th>
                             <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch Stock</th>
                           </>
                         )}
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {activeData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">All clear!</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">No alerts in this category</p>
                          </td>
                        </tr>
                      ) : activeData.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6">
                              <span className="text-[13px] font-black text-slate-800 tracking-tight">
                                {activeTab === 'lowStock' ? item.drugName : item.inventory?.drug?.drugName}
                              </span>
                           </td>
                           
                           {activeTab === 'lowStock' ? (
                             <>
                               <td className="px-6 py-6 text-center">
                                  <span className={`text-[14px] font-black ${item.totalStock === 0 ? 'text-rose-600' : 'text-amber-600'}`}>{item.totalStock}</span>
                               </td>
                               <td className="px-6 py-6 text-center text-[12px] font-bold text-slate-400">{item.reorderLevel}</td>
                             </>
                           ) : (
                             <>
                               <td className="px-6 py-6 text-center text-[12px] font-black text-slate-600 uppercase">{item.batchNumber}</td>
                               <td className="px-6 py-6 text-center">
                                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeTab === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {new Date(item.expiryDate).toLocaleDateString()}
                                  </span>
                               </td>
                               <td className="px-6 py-6 text-center text-[12px] font-black text-slate-700">{item.stockQuantity}</td>
                             </>
                           )}

                           <td className="px-8 py-6 text-right">
                              <a href="/opd/medical/stock" className="inline-flex p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all">
                                 <ArrowRight className="w-4 h-4" />
                              </a>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              )}
           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default AlertsView;
