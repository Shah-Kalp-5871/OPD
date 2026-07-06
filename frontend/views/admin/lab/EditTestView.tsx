
'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { useRouter } from 'next/navigation';
import { ShieldAlert, AlertOctagon, ArrowLeft } from 'lucide-react';
import { labApi, LabCategory } from '@/lib/api/lab';
import { toast } from 'sonner';

export default function EditTestView({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  const router = useRouter();
  const [categories, setCategories] = useState<LabCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    categoryId: '', name: '', code: '', unit: '',
    basePrice: 0, criticalLow: '', criticalHigh: '',
    displayOrder: 0, isActive: true,
  });

  useEffect(() => {
    labApi.getCategories(true).then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
        labApi.getParameterById(id).then(res => {
            const p = (res as any).data || res;
            setForm({
                categoryId: p.categoryId, name: p.name, code: p.code || '', unit: p.unit || '',
                basePrice: p.basePrice, criticalLow: p.criticalLow?.toString() || '', criticalHigh: p.criticalHigh?.toString() || '',
                displayOrder: p.displayOrder, isActive: p.isActive,
            });
        });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.name.trim()) {
      toast.error('Category and name are required'); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        criticalLow: form.criticalLow ? parseFloat(form.criticalLow) : undefined,
        criticalHigh: form.criticalHigh ? parseFloat(form.criticalHigh) : undefined,
      };
      await labApi.updateParameter(id, payload);
      toast.success('Parameter updated');
      router.push('/admin/lab/tests');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save parameter');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Lab Test</h1>
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">Lab Master / Tests / Edit</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category *</label>
                <select value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none outline-none focus:border-indigo-400 transition-all cursor-pointer">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Parameter Name *</label>
                <input type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Haemoglobin"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Short Code</label>
                <input type="text" value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. HGB"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit</label>
                <input type="text" value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  placeholder="g/dL"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Base Price (₹)</label>
                <input type="number" value={form.basePrice}
                  onChange={e => setForm(f => ({ ...f, basePrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-rose-500" /> Critical Low
                </label>
                <input type="number" value={form.criticalLow}
                  onChange={e => setForm(f => ({ ...f, criticalLow: e.target.value }))}
                  placeholder="e.g. 7"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-rose-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertOctagon className="w-3 h-3 text-amber-500" /> Critical High
                </label>
                <input type="number" value={form.criticalHigh}
                  onChange={e => setForm(f => ({ ...f, criticalHigh: e.target.value }))}
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-amber-400 transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Parameter</span>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl text-[11px] font-black tracking-widest text-slate-500 hover:bg-slate-50 transition-colors uppercase">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black tracking-widest transition-colors uppercase disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Test'}
                </button>
            </div>
        </form>
      </div>
    </AdminLayout>
  );
}
