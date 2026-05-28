'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  History, 
  Search, 
  ArrowRight,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

const BillingHistoryView = () => {
  const router = useRouter();

  // Filters
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, PAID, UNPAID
  
  // Data
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchHistory();
  }, [dateFilter, statusFilter, currentPage]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/billing/list/history', {
        params: {
          date: dateFilter || undefined,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage
        }
      });
      
      const data = response.data;
      setBills(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalItems(data.meta?.total || 0);
    } catch (error) {
      toast.error('Failed to fetch billing history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PAID') {
      return <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-200 inline-block">PAID</div>;
    }
    if (status === 'PARTIAL') {
      return <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase tracking-widest border border-amber-200 inline-block">PARTIAL</div>;
    }
    return <div className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-black uppercase tracking-widest border border-rose-200 inline-block">PENDING</div>;
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none flex items-center gap-4">
                 <History className="w-8 h-8 text-teal-600" />
                 Billing History
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">View and filter past patient bills and collections</p>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/reception/billing')}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Back to Dashboard
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
           {/* Filters Bar */}
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <Filter className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Filters</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date:</span>
                    <input 
                      type="date" 
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="text-[11px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                    />
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status:</span>
                    <select 
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="text-[11px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer pr-4"
                    >
                      <option value="ALL">All Bills</option>
                      <option value="PAID">Fully Paid</option>
                      <option value="UNPAID">Pending / Due</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Table Area */}
           <div className="flex-1 relative overflow-auto bg-white">
             {isLoading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
                   <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Loading History Data...</p>
               </div>
             )}
             
             {bills.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-4 h-full">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-black uppercase tracking-widest text-slate-800 mb-1">No billing records found</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Try adjusting your date or status filters</span>
                  </div>
                </div>
             ) : (
               <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-10">
                   <tr className="divide-x divide-slate-200">
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Bill No</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Date</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Patient</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-right">Gross</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-right">Discount</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-right">Net Payable</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-right">Paid</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-right">Due</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-center">Status</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-center">Finalized</th>
                     <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {bills.map((bill, idx) => {
                     const valDue = bill.balanceAmount || 0;
                     const d = bill.billingDate ? new Date(bill.billingDate) : null;
                     
                     return (
                       <tr key={bill.id || idx} className="hover:bg-slate-50/50 transition-colors group divide-x divide-slate-100">
                         <td className="py-3 px-6 whitespace-nowrap">
                           <span className="text-[12px] font-black text-slate-800 tracking-wider uppercase">{bill.billNumber || '--'}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap">
                           {d ? (
                             <div className="flex flex-col">
                               <span className="text-[12px] font-bold text-slate-800">{format(d, 'dd MMM yyyy')}</span>
                               <span className="text-[10px] text-slate-400 font-bold">{format(d, 'HH:mm a')}</span>
                             </div>
                           ) : '--'}
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap">
                           <div className="text-[12px] font-black uppercase text-slate-900 tracking-wider">
                             {bill.patient?.firstName} {bill.patient?.lastName}
                             <div className="text-[10px] text-slate-400 font-bold mt-0.5">MRD: {bill.patient?.mrdNumber}</div>
                           </div>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-right">
                           <span className="text-[12px] font-bold text-slate-600 tracking-wider">₹ {bill.grossAmount?.toLocaleString() || '0'}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-right">
                           <span className="text-[12px] font-bold text-slate-600 tracking-wider">₹ {bill.discountTotal?.toLocaleString() || '0'}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-right">
                           <span className="text-[12px] font-black text-slate-800 tracking-wider">₹ {bill.netAmount?.toLocaleString() || '0'}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-right">
                           <span className="text-[12px] font-black text-emerald-600 tracking-wider">₹ {bill.paidAmount?.toLocaleString() || '0'}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-right">
                           <span className={`text-[12px] font-black ${valDue > 0 ? 'text-rose-600' : 'text-slate-600'} tracking-wider`}>₹ {valDue.toLocaleString()}</span>
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-center">
                           {getStatusBadge(bill.paymentStatus)}
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-center">
                           {bill.isFinalized ? (
                             <div className="flex items-center justify-center text-emerald-600">
                               <CheckCircle2 className="w-4 h-4" />
                             </div>
                           ) : (
                             <div className="flex items-center justify-center text-amber-500">
                               <Clock className="w-4 h-4" />
                             </div>
                           )}
                         </td>
                         <td className="py-3 px-6 whitespace-nowrap text-center">
                           <a 
                             href={`/reception/billing?caseId=${bill.caseId}`}
                             className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-teal-600 transition-colors shadow-sm inline-block group cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600"
                           >
                             View
                           </a>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             )}
           </div>

           {/* Pagination */}
           <div className="bg-slate-50 border-t border-slate-100 p-5 flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 Showing {(currentPage - 1) * itemsPerPage + (bills.length > 0 ? 1 : 0)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} records
              </div>
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                   disabled={currentPage === 1 || isLoading}
                   className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:hover:border-slate-200 transition-colors"
                 >
                   <ChevronLeft className="w-4 h-4" />
                   Prev
                 </button>
                 <span className="text-[11px] font-bold text-slate-600">
                   Page <span className="font-black text-slate-900">{currentPage}</span> of {totalPages}
                 </span>
                 <button 
                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                   disabled={currentPage === totalPages || isLoading}
                   className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:hover:border-slate-200 transition-colors"
                 >
                   Next
                   <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default BillingHistoryView;
