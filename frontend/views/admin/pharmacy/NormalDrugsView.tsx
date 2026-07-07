'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { pharmacyAdminApi } from '@/lib/api/pharmacy';
import { Drug } from '@/lib/api/drugs';
import { toast } from 'sonner';
import AdminLayout from '@/views/layouts/AdminLayout';

export default function NormalDrugsView() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState<Partial<Drug>>({
    drugName: '',
    drugCategory: '',
    formulation: '',
    unitOfMeasure: '',
    unitPrice: 0,
    taxable: false,
    stockTracked: true,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      setLoading(true);
      const data = await pharmacyAdminApi.getNormalDrugs();
      setDrugs(data);
    } catch (e: any) {
      toast.error('Failed to load normal drugs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        drugName: form.drugName,
        genericName: form.genericName,
        drugCategory: form.drugCategory,
        formulation: form.formulation,
        unitOfMeasure: form.unitOfMeasure,
        unitPrice: Number(form.unitPrice) || 0,
        stockTracked: form.stockTracked,
      };
      
      if (editingId) {
        await pharmacyAdminApi.updateNormalDrug(editingId, payload);
        toast.success('Drug updated successfully');
      } else {
        await pharmacyAdminApi.createNormalDrug(payload);
        toast.success('Drug created successfully');
      }
      setShowModal(false);
      loadDrugs();
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || 'Failed to save drug';
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingId(drug.id);
    setForm(drug);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to disable this drug?')) {
      try {
        await pharmacyAdminApi.deleteNormalDrug(id);
        toast.success('Drug disabled');
        loadDrugs();
      } catch (e: any) {
        toast.error('Failed to disable drug');
      }
    }
  };

  const handleToggle = async (drug: Drug) => {
    try {
      await pharmacyAdminApi.updateNormalDrug(drug.id, { isActive: !drug.isActive });
      toast.success(drug.isActive ? 'Drug deactivated' : 'Drug activated');
      loadDrugs();
    } catch (e: any) {
      toast.error('Failed to toggle status');
    }
  };

  const filteredDrugs = drugs.filter(d => 
    d.drugName.toLowerCase().includes(search.toLowerCase()) || 
    d.genericName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Normal Drugs Master</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              drugName: '',
              drugCategory: 'TABLET',
              formulation: 'ORAL',
              unitOfMeasure: 'TAB',
              unitPrice: 0,
              taxable: false,
              stockTracked: true,
            });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Drug
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search drugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">Drug Name</th>
                <th className="p-4 font-bold border-b border-slate-100">Generic Name</th>
                <th className="p-4 font-bold border-b border-slate-100">Category</th>
                <th className="p-4 font-bold border-b border-slate-100">Price (₹)</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredDrugs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                    No drugs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDrugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-800">
                      {drug.drugName}
                      {!drug.isActive && <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Inactive</span>}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{drug.genericName || '-'}</td>
                    <td className="p-4 text-sm text-slate-600">{drug.drugCategory}</td>
                    <td className="p-4 text-sm text-slate-600">₹{drug.unitPrice}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggle(drug)}
                        className={`p-2 rounded-lg transition-colors ${drug.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title={drug.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {drug.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(drug)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(drug.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Drug' : 'Add New Drug'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Drug Name</label>
                <input
                  type="text"
                  required
                  value={form.drugName}
                  onChange={(e) => setForm({ ...form, drugName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  placeholder="e.g. Paracetamol 500mg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Generic Name</label>
                <input
                  type="text"
                  value={form.genericName || ''}
                  onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  placeholder="e.g. Acetaminophen"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                  <input
                    type="text"
                    required
                    value={form.drugCategory}
                    onChange={(e) => setForm({ ...form, drugCategory: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                    placeholder="e.g. TABLET"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Formulation</label>
                  <input
                    type="text"
                    required
                    value={form.formulation}
                    onChange={(e) => setForm({ ...form, formulation: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                    placeholder="e.g. ORAL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Unit</label>
                  <input
                    type="text"
                    required
                    value={form.unitOfMeasure}
                    onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                    placeholder="e.g. TAB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.unitPrice || ''}
                    onChange={(e) => setForm({ ...form, unitPrice: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
