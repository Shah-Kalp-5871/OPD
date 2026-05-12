'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Info, 
  Save, 
  Filter,
  ChevronDown,
  LayoutGrid,
  FileText,
  Thermometer,
  ShieldAlert,
  Archive
} from 'lucide-react';

const DrugMasterView = () => {
  const [editingDrug, setEditingDrug] = useState<any>(null);

  const drugs = [
    { content: 'Tab Fluconazole 400mg', brand: 'Flucocip', form: 'Tablet', dose: '1 Tab', freq: 'OD', price: 12, stock: 48, minStock: 10, isSimple: false },
    { content: 'Cream Clotrimazole 1%', brand: 'Monpic', form: 'Cream', dose: '1 App', freq: 'TDS', price: 25, stock: 30, minStock: 5, isSimple: false },
    { content: '(S) Tab Levocetrizine', brand: '(S) Zylivo', form: 'Tablet', dose: '1 Tab', freq: 'OD', price: 12, stock: 8, minStock: 12, isSimple: true },
    { content: 'Syrup Albendazole', brand: 'Zentel', form: 'Syrup', dose: '5 ml', freq: 'Weekly', price: 8, stock: 25, minStock: 8, isSimple: false },
  ];

  const handleEdit = (drug: any) => {
    setEditingDrug(drug);
    document.getElementById('drug-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingDrug(null);
    document.getElementById('drug-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Drug Master Database</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pharmacy Inventory & Prescription Master</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            + Add Drug
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative group max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search drugs by Content Name / Brand Name / Form..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* Drug Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Content Name</th>
                  <th className="px-8 py-5">Brand Name</th>
                  <th className="px-8 py-5">Form</th>
                  <th className="px-8 py-5">Dose</th>
                  <th className="px-8 py-5">Freq</th>
                  <th className="px-8 py-5">Price/Unit</th>
                  <th className="px-8 py-5 text-center">Stock</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium">
                {drugs.map((drug, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {drug.isSimple && <span className="text-blue-600 font-black">(S)</span>}
                        <span className="text-slate-800 font-extrabold">{drug.content.replace('(S) ', '')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-bold italic">{drug.brand}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {drug.form}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-bold">{drug.dose}</td>
                    <td className="px-8 py-5 text-slate-600 font-bold">{drug.freq}</td>
                    <td className="px-8 py-5 text-slate-800 font-black">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-slate-400 font-medium">■</span> {drug.price}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {drug.stock <= drug.minStock ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-rose-600 font-black text-xs">{drug.stock}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] font-black uppercase tracking-tighter">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            Stock Below Minimum
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-black">{drug.stock}</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(drug)}
                        className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50">
             <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  (S) prefix = simple / sample drug. Separate inventory tracking enabled. Low stock alerts are notified to admin & doctors.
                </p>
             </div>
          </div>
        </div>

        {/* 🔷 Add / Edit Drug Form */}
        <div id="drug-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              Add / Edit Drug Form
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Archive className="w-3.5 h-3.5" />
              Prescription Master Data
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Content Name / Generic *</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingDrug?.content.replace('(S) ', '')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Brand Name *</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingDrug?.brand.replace('(S) ', '')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Manufacturer / Brand</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  placeholder="e.g. Cipla, Mankind"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Drug Form (Dropdown)</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none cursor-pointer" defaultValue={editingDrug?.form}>
                    <option>Select Form</option>
                    <option>Tablet</option>
                    <option>Syrup</option>
                    <option>Cream</option>
                    <option>Injection</option>
                    <option>Capsule</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Dose</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="1 Tab / 5 ml" defaultValue={editingDrug?.dose} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Frequency</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="OD / TDS / BD" defaultValue={editingDrug?.freq} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Timing</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                  <option>After Food</option>
                  <option>Before Food</option>
                  <option>Empty Stomach</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-end">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="Oral / Topical" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Price per Unit (■)</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingDrug?.price} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Min Stock Alert</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingDrug?.minStock || 10} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Slot Code</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="Rack-A1" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Simple Drug (S)?</label>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={editingDrug?.isSimple} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mark as (S)</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 flex justify-center">
              <button className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                SAVE DRUG
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DrugMasterView;
