'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import {
  Scissors, AlertTriangle, Package, FileText, Clock, CheckCircle2, Edit3, Archive,
} from 'lucide-react';
import { procedureApi, Procedure } from '@/lib/api/procedures';
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
interface ProcedureForm {
  id?: string;
  name: string;
  code: string;
  description: string;
  basePrice: number;
  estimatedDuration: number;
  category: string;
  displayOrder: number;
  requiresConsent: boolean;
  requiresNursing: boolean;
  requiresRoom: boolean;
  preInstructions: string;
  postInstructions: string;
  isActive: boolean;
  consumablesCsv: string; // comma-separated "item:qty" for UX simplicity
}

const EMPTY_FORM: ProcedureForm = {
  name: '', code: '', description: '', basePrice: 0,
  estimatedDuration: 30, category: '', displayOrder: 0,
  requiresConsent: false, requiresNursing: true, requiresRoom: false,
  preInstructions: '', postInstructions: '', isActive: true,
  consumablesCsv: '',
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function csvToConsumables(csv: string) {
  return csv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const [itemName, qty] = s.split(':');
      return { itemName: itemName?.trim() || s, defaultQuantity: parseInt(qty ?? '1') || 1 };
    });
}

function consumablesToCsv(items?: { itemName: string; defaultQuantity: number }[]) {
  return items?.map(c => `${c.itemName}:${c.defaultQuantity}`).join(', ') ?? '';
}

// ─── Component ────────────────────────────────────────────────────────────────
const ProcedureMasterView = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<ProcedureForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: procedures,
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
  } = usePaginatedAdminData<Procedure, any>({
    fetchFn: procedureApi.findAll.bind(procedureApi),
    initialLimit: 20
  });

  const filterCat = filters.category || '';
  const setFilterCat = (val: string) => setFilter('category', val);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await procedureApi.getCategories();
      setCategories(res);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setForm(EMPTY_FORM); setShowForm(true); setTimeout(() => scrollToForm(), 50); };
  const openEdit = (p: Procedure) => {
    setForm({
      id: p.id, name: p.name, code: p.code ?? '', description: p.description ?? '',
      basePrice: p.basePrice, estimatedDuration: p.estimatedDuration,
      category: p.category ?? '', displayOrder: p.displayOrder,
      requiresConsent: p.requiresConsent, requiresNursing: p.requiresNursing,
      requiresRoom: p.requiresRoom, preInstructions: p.preInstructions ?? '',
      postInstructions: p.postInstructions ?? '', isActive: p.isActive,
      consumablesCsv: consumablesToCsv(p.consumableTemplates),
    });
    setShowForm(true);
    setTimeout(() => scrollToForm(), 50);
  };

  const scrollToForm = () => document.getElementById('admin-form-wrapper')?.scrollIntoView({ behavior: 'smooth' });

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Procedure name is required'); return; }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name, code: form.code || undefined, description: form.description || undefined,
        basePrice: form.basePrice, estimatedDuration: form.estimatedDuration,
        category: form.category || undefined, displayOrder: form.displayOrder,
        requiresConsent: form.requiresConsent, requiresNursing: form.requiresNursing,
        requiresRoom: form.requiresRoom,
        preInstructions: form.preInstructions || undefined,
        postInstructions: form.postInstructions || undefined,
        isActive: form.isActive,
        consumables: form.consumablesCsv.trim() ? csvToConsumables(form.consumablesCsv) : [],
      };
      if (form.id) {
        await procedureApi.update(form.id, payload);
        toast.success('Procedure updated');
      } else {
        await procedureApi.create(payload);
        toast.success('Procedure created');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      refresh();
      fetchCategories();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save procedure');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleToggleActive = async (p: Procedure) => {
    try {
      await procedureApi.update(p.id, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Procedure archived' : 'Procedure activated');
      refresh();
    } catch { toast.error('Failed to update status'); }
  };

  const tableColumns: Column<Procedure>[] = [
    {
      key: 'procedure',
      header: 'Procedure',
      render: (p: Procedure) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800">{p.name}</p>
            {p.code && <p className="text-[9px] font-mono text-slate-400">{p.code}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p: Procedure) => (
        p.category ? (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
            {p.category}
          </span>
        ) : <span className="text-slate-200 text-xs">—</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (p: Procedure) => (
        <div className="flex items-center justify-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-xs font-black">{p.estimatedDuration}m</span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'price',
      header: 'Price (₹)',
      render: (p: Procedure) => <span className="text-sm font-black text-indigo-600">₹{p.basePrice}</span>,
      align: 'right' as const,
    },
    {
      key: 'flags',
      header: 'Flags',
      render: (p: Procedure) => (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {p.requiresConsent && (
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[8px] font-black uppercase">Consent</span>
          )}
          {p.requiresNursing && (
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[8px] font-black uppercase">Nursing</span>
          )}
          {p.requiresRoom && (
            <span className="px-1.5 py-0.5 bg-violet-50 text-violet-600 border border-violet-100 rounded text-[8px] font-black uppercase">Room</span>
          )}
          {!p.requiresConsent && !p.requiresNursing && !p.requiresRoom && (
            <span className="text-slate-200 text-xs">—</span>
          )}
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Procedure) => <AdminStatusBadge isActive={p.isActive} />,
      align: 'right' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (p: Procedure) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => openEdit(p)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Procedure"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleActive(p)}
            className={`p-2 rounded-lg transition-all ${p.isActive ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
            title={p.isActive ? "Archive Procedure" : "Activate Procedure"}
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
          title="Procedure Master"
          subtitle={`${total} procedures configured`}
          actions={[
            {
              label: 'Add Procedure',
              onClick: openCreate,
              variant: 'primary',
            }
          ]}
        />

        <AdminToolbar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search procedures..."
          onRefresh={refresh}
          filters={[
            {
              value: filterCat,
              onChange: setFilterCat,
              options: categories.map(c => ({ value: c, label: c })),
              placeholder: 'All Categories'
            }
          ]}
        />

        <AdminDataTable
          data={procedures}
          columns={tableColumns}
          loading={loading}
          totalItems={total}
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}
          emptyIcon={<Scissors className="w-10 h-10 text-slate-200 mx-auto mb-3" />}
          emptyText="No procedures found"
          rowKey={(p) => p.id}
        />

        {showForm && (
          <AdminFormWrapper
            title={form.id ? 'Procedure' : 'Procedure'}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            isEditing={!!form.id}
            submitting={submitting}
          >
            {/* Row 1 — Basics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Procedure Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Dressing"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Short Code</label>
                <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. DRS"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. MINOR SURGERY"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
            </div>

            {/* Row 2 — Pricing & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Base Price (₹)</label>
                <input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Duration (mins)
                </label>
                <input type="number" value={form.estimatedDuration} onChange={e => setForm(f => ({ ...f, estimatedDuration: parseInt(e.target.value) || 30 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Display Order</label>
                <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all" />
              </div>
            </div>

            {/* Row 3 — Flags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 mt-6">
              <p className="md:col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Flags</p>
              {[
                { key: 'requiresConsent', label: 'Requires Consent', icon: <AlertTriangle className="w-3 h-3 text-amber-500" /> },
                { key: 'requiresNursing', label: 'Requires Nursing', icon: <CheckCircle2 className="w-3 h-3 text-blue-500" /> },
                { key: 'requiresRoom', label: 'Requires Room', icon: <CheckCircle2 className="w-3 h-3 text-violet-500" /> },
              ].map(flag => (
                <label key={flag.key} className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors">
                  <div className="relative shrink-0">
                    <input type="checkbox" className="sr-only peer"
                      checked={form[flag.key as keyof ProcedureForm] as boolean}
                      onChange={e => setForm(f => ({ ...f, [flag.key]: e.target.checked }))} />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {flag.icon} {flag.label}
                  </div>
                </label>
              ))}
            </div>

            {/* Row 4 — Description & Consumables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief clinical description..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Package className="w-3 h-3 text-indigo-500" /> Consumables
                  <span className="text-[9px] font-bold text-slate-300 normal-case">(name:qty, name:qty)</span>
                </label>
                <textarea rows={3} value={form.consumablesCsv} onChange={e => setForm(f => ({ ...f, consumablesCsv: e.target.value }))}
                  placeholder="Gloves:2, Dressing pad:1, Betadine:1"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none" />
              </div>
            </div>

            {/* Row 5 — Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-500" /> Pre-Procedure Instructions
                </label>
                <textarea rows={4} value={form.preInstructions} onChange={e => setForm(f => ({ ...f, preInstructions: e.target.value }))}
                  placeholder="Instructions shown to doctor/nurse before starting..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-emerald-500" /> Post-Procedure Care
                </label>
                <textarea rows={4} value={form.postInstructions} onChange={e => setForm(f => ({ ...f, postInstructions: e.target.value }))}
                  placeholder="Care instructions after the procedure..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none" />
              </div>
            </div>

            {/* Footer Status */}
            <div className="flex items-center gap-3 cursor-pointer mt-6">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Procedure</span>
            </div>
          </AdminFormWrapper>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProcedureMasterView;
