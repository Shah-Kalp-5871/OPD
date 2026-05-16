'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import {
  FlaskConical, ShieldAlert, AlertOctagon, Edit3, Archive,
} from 'lucide-react';
import { labApi, LabCategory, LabParameter } from '@/lib/api/lab';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminToolbar,
  AdminDataTable,
  AdminStatusBadge,
  AdminFormWrapper,
  Column,
} from '@/components/admin';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ParamForm {
  id?: string;
  categoryId: string;
  name: string;
  code: string;
  unit: string;
  basePrice: number;
  criticalLow: string;
  criticalHigh: string;
  displayOrder: number;
  isActive: boolean;
}

const EMPTY_FORM: ParamForm = {
  categoryId: '', name: '', code: '', unit: '',
  basePrice: 0, criticalLow: '', criticalHigh: '',
  displayOrder: 0, isActive: true,
};

// ─── Component ────────────────────────────────────────────────────────────────
const LabMasterView = () => {
  const [categories, setCategories] = useState<LabCategory[]>([]);
  const [form, setForm] = useState<ParamForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Use the shared hook for fetching data
  const {
    data: parameters,
    total,
    totalPages,
    page,
    limit,
    search,
    filters,
    loading,
    setPage,
    setSearch,
    setFilter,
    refresh,
  } = usePaginatedAdminData<LabParameter, any>({
    fetchFn: labApi.getParameters.bind(labApi),
    initialLimit: 20
  });

  const filterCat = filters.categoryId || '';
  const setFilterCat = (val: string) => setFilter('categoryId', val);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await labApi.getCategories(true);
      setCategories(res.data);
    } catch { toast.error('Failed to load categories'); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (p: LabParameter) => {
    setForm({
      id: p.id, categoryId: p.categoryId, name: p.name,
      code: p.code || '', unit: p.unit || '',
      basePrice: p.basePrice, displayOrder: p.displayOrder,
      criticalLow: p.criticalLow?.toString() ?? '',
      criticalHigh: p.criticalHigh?.toString() ?? '',
      isActive: p.isActive,
    });
    setShowForm(true);
    setTimeout(() => document.getElementById('admin-form-wrapper')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSave = async () => {
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
      if (form.id) {
        await labApi.updateParameter(form.id, payload);
        toast.success('Parameter updated');
      } else {
        await labApi.createParameter(payload);
        toast.success('Parameter created');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      refresh();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save parameter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleToggleActive = async (p: LabParameter) => {
    try {
      await labApi.updateParameter(p.id, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Parameter archived' : 'Parameter activated');
      refresh();
    } catch { toast.error('Failed to update status'); }
  };

  const handleCreateCategory = async () => {
    const name = prompt('New category name:');
    if (!name?.trim()) return;
    try {
      await labApi.createCategory({ name: name.trim() });
      toast.success('Category created');
      fetchCategories();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
  };

  const tableColumns: Column<LabParameter>[] = [
    {
      key: 'category',
      header: 'Category',
      render: (p: LabParameter) => (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
          {p.category?.name ?? '—'}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Parameter',
      render: (p: LabParameter) => <span className="text-sm font-extrabold text-slate-800">{p.name}</span>,
    },
    {
      key: 'code',
      header: 'Code',
      render: (p: LabParameter) => <span className="text-xs font-mono text-slate-400">{p.code ?? '—'}</span>,
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (p: LabParameter) => <span className="text-xs font-black text-slate-400 italic">{p.unit ?? '—'}</span>,
    },
    {
      key: 'price',
      header: 'Price (₹)',
      render: (p: LabParameter) => <span className="text-sm font-black text-indigo-600">₹{p.basePrice}</span>,
      align: 'right' as const,
    },
    {
      key: 'critical',
      header: 'Critical',
      render: (p: LabParameter) => (
        (p.criticalLow != null || p.criticalHigh != null) ? (
          <div className="flex items-center justify-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[8px] font-black uppercase mx-auto w-fit">
            <ShieldAlert className="w-2.5 h-2.5" />
            {p.criticalLow ?? '—'} / {p.criticalHigh ?? '—'}
          </div>
        ) : <span className="text-slate-200 text-xs">—</span>
      ),
      align: 'center' as const,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: LabParameter) => <AdminStatusBadge isActive={p.isActive} />,
      align: 'right' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (p: LabParameter) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => openEdit(p)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Parameter"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleActive(p)}
            className={`p-2 rounded-lg transition-all ${p.isActive ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
            title={p.isActive ? "Archive Parameter" : "Activate Parameter"}
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <AdminPageHeader
          title="Lab Investigation Master"
          subtitle={`${total} parameters configured`}
          actions={[
            {
              label: 'Add Category',
              onClick: handleCreateCategory,
              variant: 'secondary',
            },
            {
              label: 'Add Parameter',
              onClick: openCreate,
              variant: 'primary',
            }
          ]}
        />

        <AdminToolbar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search parameters..."
          onRefresh={refresh}
          filters={[
            {
              value: filterCat,
              onChange: setFilterCat,
              options: categories.map(c => ({ value: c.id, label: c.name })),
              placeholder: 'All Categories'
            }
          ]}
        />

        <AdminDataTable
          data={parameters}
          columns={tableColumns}
          loading={loading}
          totalItems={total}
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}
          emptyIcon={<FlaskConical className="w-10 h-10 text-slate-200 mx-auto mb-3" />}
          emptyText="No parameters found"
          rowKey={(p) => p.id}
        />

        {showForm && (
          <AdminFormWrapper
            title={form.id ? 'Parameter' : 'Parameter'}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            isEditing={!!form.id}
            submitting={submitting}
          >
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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

            <div className="flex items-center gap-3 cursor-pointer mt-6">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Parameter</span>
            </div>
          </AdminFormWrapper>
        )}
      </div>
    </AdminLayout>
  );
};

export default LabMasterView;

