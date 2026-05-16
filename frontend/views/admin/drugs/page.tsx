'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { Package, Edit3, ShieldAlert, Archive, ChevronDown } from 'lucide-react';
import { drugApi, Drug } from '@/lib/api/drugs';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminToolbar,
  AdminDataTable,
  AdminStatusBadge,
  AdminFormWrapper
} from '@/components/admin';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';

const DrugMasterView = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [formulations, setFormulations] = useState<string[]>([]);
  
  const [editingDrug, setEditingDrug] = useState<Partial<Drug> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: drugs,
    total: totalItems,
    page,
    totalPages,
    limit,
    search: searchQuery,
    filters,
    loading,
    setPage,
    setSearch,
    refresh
  } = usePaginatedAdminData<Drug, any>({
    fetchFn: drugApi.findAll.bind(drugApi)
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Drug>>({
    drugName: '',
    genericName: '',
    manufacturer: '',
    drugCategory: 'GENERAL',
    formulation: 'TABLET',
    strength: '',
    unitOfMeasure: 'UNIT',
    unitPrice: 0,
    taxable: true,
    stockTracked: true,
    schedule: '',
    isActive: true
  });

  const fetchMasters = useCallback(async () => {
    try {
      const [cats, forms] = await Promise.all([
        drugApi.getMasterCategories(),
        drugApi.getMasterFormulations()
      ]);
      setCategories(cats);
      setFormulations(forms);
    } catch (error) {
      console.error('Failed to fetch masters', error);
    }
  }, []);

  useEffect(() => {
    fetchMasters();
  }, [fetchMasters]);

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setFormData(drug);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAdd = () => {
    setEditingDrug(null);
    setFormData({
      drugName: '',
      genericName: '',
      manufacturer: '',
      drugCategory: 'GENERAL',
      formulation: 'TABLET',
      strength: '',
      unitOfMeasure: 'UNIT',
      unitPrice: 0,
      taxable: true,
      stockTracked: true,
      schedule: '',
      isActive: true
    });
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.drugName || !formData.drugCategory || !formData.formulation) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      setSubmitting(true);
      if (editingDrug?.id) {
        await drugApi.update(editingDrug.id, formData);
        toast.success('Drug updated successfully');
      } else {
        await drugApi.create(formData);
        toast.success('New drug added to master');
      }
      setShowForm(false);
      refresh();
    } catch (error) {
      console.error('Save failed', error);
      toast.error('Failed to save drug data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (drug: Drug) => {
    if (!confirm(`Are you sure you want to archive ${drug.drugName}?`)) return;
    try {
      await drugApi.archive(drug.id);
      toast.success('Drug archived');
      refresh();
    } catch (error) {
      toast.error('Failed to archive drug');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Medication Name',
      render: (drug: Drug) => (
        <div className="flex flex-col gap-1">
          <span className="text-slate-800 font-extrabold">{drug.drugName}</span>
          {!drug.isActive && <AdminStatusBadge isActive={false} />}
        </div>
      )
    },
    {
      key: 'generic',
      header: 'Generic Molecule',
      render: (drug: Drug) => (
        <span className="text-slate-500 font-bold italic">{drug.genericName || 'N/A'}</span>
      )
    },
    {
      key: 'formulation',
      header: 'Form / Strength',
      render: (drug: Drug) => (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
            {drug.formulation}
          </span>
          <span className="text-slate-400 text-xs font-bold">{drug.strength}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (drug: Drug) => (
        <span className="text-blue-600 font-black text-[10px] uppercase tracking-wider">{drug.drugCategory}</span>
      )
    },
    {
      key: 'price',
      header: 'Price (₹)',
      render: (drug: Drug) => (
        <span className="text-slate-800 font-black">{drug.unitPrice.toFixed(2)}</span>
      )
    },
    {
      key: 'stock',
      header: 'In Stock',
      align: 'center' as const,
      render: (drug: Drug) => {
        if (drug.inventory && drug.inventory.totalStock <= drug.inventory.minStockLevel) {
          return (
            <div className="flex flex-col items-center gap-1">
              <span className="text-rose-600 font-black text-xs">{drug.inventory.totalStock}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] font-black uppercase tracking-tighter">
                <ShieldAlert className="w-2.5 h-2.5" />
                Low Stock
              </span>
            </div>
          );
        }
        return <span className="text-slate-600 font-black">{drug.inventory?.totalStock || 0}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (drug: Drug) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleEdit(drug)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Drug"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {drug.isActive && (
            <button 
              onClick={() => handleDeactivate(drug)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Archive Drug"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <AdminPageHeader
          title="Drug Master Database"
          totalCount={totalItems}
          onAdd={handleAdd}
          addLabel="+ Add Drug"
        />

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <AdminToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearch}
            onRefresh={refresh}
          />
        </div>

        {showForm && (
          <AdminFormWrapper
            title="Drug"
            isEditing={!!editingDrug}
            submitting={submitting}
            onClose={() => setShowForm(false)}
            onSubmit={handleSave}
          >
            <div className="space-y-10">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Medication Name *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                    value={formData.drugName || ''}
                    onChange={(e) => setFormData({...formData, drugName: e.target.value})}
                    placeholder="e.g. Paracetamol 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Generic Name / Molecule</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                    value={formData.genericName || ''}
                    onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                    placeholder="e.g. Acetaminophen"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Manufacturer</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    placeholder="e.g. Cipla, Mankind"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Drug Category *</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none cursor-pointer uppercase"
                      value={formData.drugCategory}
                      onChange={(e) => setFormData({...formData, drugCategory: e.target.value})}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Formulation *</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none cursor-pointer uppercase"
                      value={formData.formulation}
                      onChange={(e) => setFormData({...formData, formulation: e.target.value})}
                    >
                      {formulations.map(form => <option key={form} value={form}>{form}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Strength</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
                    placeholder="e.g. 500mg, 10mg" 
                    value={formData.strength || ''}
                    onChange={(e) => setFormData({...formData, strength: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit of Measure</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer"
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({...formData, unitOfMeasure: e.target.value})}
                  >
                    <option value="UNIT">UNIT</option>
                    <option value="STRIP">STRIP</option>
                    <option value="BOTTLE">BOTTLE</option>
                    <option value="VIAL">VIAL</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unit Price (₹) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
                    value={formData.unitPrice || 0}
                    onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Schedule (Class)</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
                    placeholder="e.g. H, H1, G"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stock Tracking</label>
                  <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.stockTracked || false}
                        onChange={(e) => setFormData({...formData, stockTracked: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Track Inventory</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Taxable</label>
                  <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.taxable || false}
                        onChange={(e) => setFormData({...formData, taxable: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Apply GST/Tax</span>
                  </div>
                </div>
              </div>
            </div>
          </AdminFormWrapper>
        )}

        <AdminDataTable
          columns={columns}
          data={drugs}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
          rowKey={(d) => d.id}
          rowClassName={(d) => !d.isActive ? 'opacity-50' : ''}
          emptyIcon={<Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />}
          emptyText="No drugs found in database"
        />
      </div>
    </AdminLayout>
  );
};

export default DrugMasterView;
