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
  Column,
} from '@/components/admin';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';
import { useRouter } from "next/navigation";

// ─── Component ────────────────────────────────────────────────────────────────
const LabMasterView = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<LabCategory[]>([]);
  
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

  const openCreate = () => { router.push("/admin/lab/tests/add"); };
  const openEdit = (p: LabParameter) => { router.push(`/admin/lab/tests/${p.id}`); };

  const handleToggleActive = async (p: LabParameter) => {
    try {
      await labApi.updateParameter(p.id, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Parameter archived' : 'Parameter activated');
      refresh();
    } catch { toast.error('Failed to update status'); }
  };

  const handleCreateCategory = () => {
    router.push('/admin/lab/categories');
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
      </div>
    </AdminLayout>
  );
};

export default LabMasterView;
