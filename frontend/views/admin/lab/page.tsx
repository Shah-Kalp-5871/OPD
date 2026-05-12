'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Plus, 
  FlaskConical, 
  Activity, 
  AlertOctagon, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  ChevronDown, 
  Info,
  ShieldAlert,
  ArrowDownCircle,
  FileText
} from 'lucide-react';

const LabMasterView = () => {
  const [editingParam, setEditingParam] = useState<any>(null);

  const parameters = [
    { group: 'CBC', name: 'Haemoglobin', unit: 'g/dL', male: '13.5–17.5', female: '11.5–15.5', child: '11–16', critLow: '7', status: 'Active' },
    { group: 'CBC', name: 'WBC Count', unit: 'K/uL', male: '4.5–11', female: '4.5–11', child: '4.5–11', critLow: '2', status: 'Active' },
    { group: 'Blood Sugar', name: 'Fasting', unit: 'mg/dL', male: '70–100', female: '70–100', child: '70–100', critLow: '50', status: 'Active' },
    { group: 'Thyroid', name: 'TSH', unit: 'mIU/L', male: '0.4–4.0', female: '0.4–4.0', child: '0.5–4.5', critLow: '0.1', status: 'Active' },
    { group: 'LFT', name: 'SGPT', unit: 'IU/L', male: '7–40', female: '7–40', child: '7–40', critLow: '0', status: 'Inactive' },
  ];

  const handleEdit = (param: any) => {
    setEditingParam(param);
    document.getElementById('param-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingParam(null);
    document.getElementById('param-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lab Investigation Master</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Diagnostic Parameter Configuration</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            + Add Parameter
          </button>
        </div>

        {/* Lab Parameters Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Group</th>
                  <th className="px-8 py-5">Parameter</th>
                  <th className="px-8 py-5">Unit</th>
                  <th className="px-8 py-5">Normal (M)</th>
                  <th className="px-8 py-5">Normal (F)</th>
                  <th className="px-8 py-5">Normal (C)</th>
                  <th className="px-8 py-5 text-center">Crit Low</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parameters.map((p, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/50 transition-colors group ${p.status === 'Inactive' ? 'opacity-40 grayscale' : ''}`}>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        {p.group}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-extrabold text-slate-800">{p.name}</td>
                    <td className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider italic">{p.unit}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{p.male}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{p.female}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{p.child}</td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-rose-600 font-black text-xs">{p.critLow}</span>
                        {p.critLow !== '0' && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[8px] font-black uppercase tracking-tighter">
                            <ShieldAlert className="w-2 h-2" />
                            Red Flag
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {p.status}
                        </span>
                      </div>
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
                  Note: Inactive parameters are hidden from doctor's investigation search. Critical thresholds trigger real-time red flag indicators in the doctor's module.
                </p>
             </div>
          </div>
        </div>

        {/* 🔷 Add / Edit Parameter Form */}
        <div id="param-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              {editingParam ? 'Edit Parameter Configuration' : 'Add / Edit Parameter'}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <FlaskConical className="w-3.5 h-3.5" />
              Diagnostic Standards Data
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Row 1: Primary Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Test Group (Dropdown)</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none cursor-pointer" defaultValue={editingParam?.group}>
                    <option>Select Group</option>
                    <option>CBC</option>
                    <option>Blood Sugar</option>
                    <option>Thyroid</option>
                    <option>LFT</option>
                    <option>RFT</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Parameter Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingParam?.name}
                  placeholder="e.g. Haemoglobin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingParam?.unit} placeholder="g/dL" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Display Order</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="1" />
              </div>
            </div>

            {/* Row 2: Normal Ranges */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Normal Range – Male
                </label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingParam?.male} placeholder="13.5-17.5" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Normal Range – Female</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingParam?.female} placeholder="11.5-15.5" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Normal Range – Child</label>
                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingParam?.child} placeholder="11-16" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active (Y/N)</label>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={editingParam?.status === 'Active'} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Parameter</span>
                </div>
              </div>
            </div>

            {/* Row 3: Critical Thresholds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                  Critical Low Threshold
                </label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue={editingParam?.critLow} placeholder="e.g. 7" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Critical High Threshold
                </label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="Optional" />
              </div>
              <div className="flex justify-end">
                <button className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                  SAVE PARAMETER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LabMasterView;
