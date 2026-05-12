'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X,
  Send,
  History,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';

const SupportTicketView = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const tickets = [
    { id: 'TKT-001', category: 'Technical Error', description: 'Login blocked on new device', priority: 'High', status: 'In Progress', date: '13/04/2026' },
    { id: 'TKT-002', category: 'Feature Request', description: 'Add bulk export for drug report', priority: 'Medium', status: 'Open', date: '12/04/2026' },
    { id: 'TKT-003', category: 'User Access', description: 'Reset password for nursing staff', priority: 'Low', status: 'Resolved', date: '10/04/2026' },
    { id: 'TKT-004', category: 'Billing Issue', description: 'Transaction mismatch in daily report', priority: 'High', status: 'Open', date: '13/04/2026' },
  ];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Progress': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const openTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Support Tickets</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">MedFlow Enterprise Helpdesk & Issue Tracking</p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" />
            Raise New Ticket
          </button>
        </div>

        {/* 🔷 SECTION 1: TICKET TABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                   <LifeBuoy className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Active Support Tickets</h3>
             </div>
             <div className="flex items-center gap-2">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                   <input type="text" placeholder="Search Tickets..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:border-blue-300 w-48 transition-all" />
                </div>
                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 transition-all">
                   <Filter className="w-4 h-4" />
                </button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-5">Ticket ID</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5">Priority</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.map((ticket, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-blue-600">{ticket.id}</span>
                       <span className="block text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">{ticket.date}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {ticket.category}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-xs font-bold text-slate-600 max-w-xs truncate">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityStyles(ticket.priority)}`}>
                          <Zap className="w-3 h-3" />
                          {ticket.priority}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(ticket.status)}`}>
                          {ticket.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3" /> : ticket.status === 'In Progress' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {ticket.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                         onClick={() => openTicket(ticket)}
                         className="px-4 py-1.5 border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all group-hover/row:bg-white"
                       >
                          View
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔷 SECTION 2: RAISE NEW TICKET FORM */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <Plus className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Raise New Ticket Form</h3>
          </div>
          <div className="p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                   <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer focus:border-blue-600 transition-all">
                      <option>Technical Error</option>
                      <option>Feature Request</option>
                      <option>User Access</option>
                      <option>Billing Issue</option>
                      <option>Other</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                   <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer focus:border-blue-600 transition-all">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                   </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none resize-none focus:bg-white transition-all" placeholder="Briefly describe the issue or request..."></textarea>
             </div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-300">
                   <Info className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Tickets are reviewed by IT staff within 24 hours</span>
                </div>
                <button className="flex items-center gap-3 px-12 py-4 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-[0.1em] hover:bg-black transition-all shadow-xl shadow-slate-200">
                   <Send className="w-4 h-4" />
                   SUBMIT TICKET
                </button>
             </div>
          </div>
        </div>

        {/* 🔷 SECTION 3: TICKET VIEW MODAL */}
        {showModal && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black tracking-widest">{selectedTicket.id}</span>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Ticket Details</h3>
                   </div>
                   <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="p-8 space-y-8">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                         <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getPriorityStyles(selectedTicket.priority)}`}>
                               {selectedTicket.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(selectedTicket.status)}`}>
                               {selectedTicket.status}
                            </span>
                         </div>
                      </div>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                         {selectedTicket.description}
                         <span className="block mt-4 text-[10px] font-bold text-slate-300 italic">— Logged on {selectedTicket.date}</span>
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <History className="w-3.5 h-3.5" />
                         Status History
                      </h4>
                      <div className="space-y-4 px-2">
                         <div className="flex gap-4 relative">
                            <div className="absolute left-[7px] top-4 bottom-0 w-[1px] bg-slate-100"></div>
                            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10"></div>
                            <div className="pb-4">
                               <p className="text-[11px] font-black text-slate-800 leading-none">Status changed to {selectedTicket.status}</p>
                               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-1">Today, 09:20 AM</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-white shadow-sm z-10"></div>
                            <div>
                               <p className="text-[11px] font-black text-slate-400 leading-none">Ticket Created</p>
                               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-1">{selectedTicket.date}, 11:00 AM</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Update Status</label>
                      <div className="flex gap-3">
                         <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer">
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                         </select>
                         <button className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-colors">
                            Update
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SupportTicketView;
