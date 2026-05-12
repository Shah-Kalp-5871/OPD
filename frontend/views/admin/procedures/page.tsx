'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Plus, 
  Stethoscope, 
  IndianRupee, 
  CalendarDays, 
  Layers, 
  Package, 
  FileText, 
  Edit3, 
  ChevronRight, 
  Info,
  Clock,
  ClipboardList
} from 'lucide-react';

const ProcedureMasterView = () => {
  const [editingProcedure, setEditingProcedure] = useState<any>(null);

  const procedures = [
    { 
      name: 'Hair Removal - Diode Laser', 
      price: '2,000', 
      sessions: '4', 
      interval: '20 days', 
      instruments: ['Diode device', 'cooling gel', 'marking pen'] 
    },
    { 
      name: 'Chemical Peel', 
      price: '1,500', 
      sessions: '3', 
      interval: '28 days', 
      instruments: [] 
    },
    { 
      name: 'PRP Therapy', 
      price: '3,000', 
      sessions: '4', 
      interval: '30 days', 
      instruments: ['PRP kit', '10ml syringe', 'collection tube'] 
    },
  ];

  const handleEdit = (proc: any) => {
    setEditingProcedure(proc);
    document.getElementById('procedure-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingProcedure(null);
    document.getElementById('procedure-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Procedure Master</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 text-[10px]">Clinical Treatment & Planning</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            + Add Procedure
          </button>
        </div>

        {/* Procedure List Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 text-[10px]">
                  <th className="px-8 py-5">Procedure Name</th>
                  <th className="px-8 py-5">Base Price (■)</th>
                  <th className="px-8 py-5">Sessions</th>
                  <th className="px-8 py-5">Btwn Sessions</th>
                  <th className="px-8 py-5">Instruments</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {procedures.map((proc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">{proc.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 font-black text-slate-700">
                        <span className="text-xs text-slate-300">■</span>
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm">{proc.price}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                        {proc.sessions}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2 uppercase tracking-tighter">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        {proc.interval}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {proc.instruments.length > 0 ? proc.instruments.map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-black uppercase tracking-tight">
                            {item}
                          </span>
                        )) : (
                          <span className="text-[10px] text-slate-300 font-bold italic uppercase tracking-widest">Optional</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(proc)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        [E]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50">
             <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                  Note: Pre/Post templates auto-load when doctor selects procedure. Adding a procedure updates Reception billing counter balance in real-time.
                </p>
             </div>
          </div>
        </div>

        {/* 🔷 Add / Edit Procedure & Templates Form */}
        <div id="procedure-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              Add / Edit Procedure & Templates
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ClipboardList className="w-3.5 h-3.5" />
              Treatment Workflow Protocol
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Top Grid: Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Procedure Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingProcedure?.name}
                  placeholder="e.g. Chemical Peel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  Base Price <span className="text-slate-300">■</span>
                </label>
                <div className="relative">
                  <input type="text" className="w-full px-5 py-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingProcedure?.price} placeholder="0" />
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No. of Sessions</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingProcedure?.sessions} placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Days Between Sessions</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingProcedure?.interval} placeholder="e.g. 20 days" />
              </div>
            </div>

            {/* Instruments / Consumables (CSV) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-blue-500" />
                Instruments / Consumables (CSV)
              </label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" 
                placeholder="Item 1, Item 2, Item 3..." 
                defaultValue={editingProcedure?.instruments.join(', ')}
              />
            </div>

            {/* Template Textareas */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Pre-Procedure Instruction Template
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all resize-none placeholder:text-slate-300 placeholder:italic"
                  placeholder="[ Free text template — auto-populates when procedure selected by Doctor ]"
                ></textarea>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Post-Procedure Care Template
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all resize-none placeholder:text-slate-300 placeholder:italic"
                  placeholder="[ Free text template — auto-populates when procedure selected by Doctor ]"
                ></textarea>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Adding procedure updates Reception billing counter balance.</span>
              </div>
              <button className="px-20 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center gap-3">
                <Plus className="w-4 h-4" />
                SAVE PROCEDURE
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProcedureMasterView;
