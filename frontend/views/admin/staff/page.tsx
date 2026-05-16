'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Briefcase, 
  Clock,
  Edit3,
  Archive,
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  AdminPageHeader, 
  AdminToolbar, 
  AdminDataTable, 
  AdminStatusBadge,
  AdminFormWrapper
} from '@/components/admin';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';
import { staffApi, StaffMember } from '@/lib/api/staff';

const EMPTY_FORM = {
  id: undefined,
  name: '',
  email: '',
  password: '',
  role: '',
  salary: 0,
  overtimeRate: 200,
  isActive: true,
};

const StaffManagementView = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterRole, setFilterRole] = useState('');

  const {
    data: staffMembers,
    total,
    totalPages,
    page,
    limit,
    search,
    loading,
    setPage,
    setSearch,
    refresh,
  } = usePaginatedAdminData<StaffMember, any>({
    fetchFn: (params) => staffApi.findAll({ ...params, role: filterRole || undefined }),
    initialLimit: 20,
    defaultFilters: { role: filterRole },
  });

  const getProfile = (staff: StaffMember) => {
    return staff.receptionProfile || staff.nurseProfile || staff.medicalProfile || {};
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
    setTimeout(() => scrollToForm(), 50);
  };

  const openEdit = (s: StaffMember) => {
    const profile = getProfile(s) as any;
    setForm({
      id: s.id as any,
      name: s.name,
      email: s.email,
      password: '',
      role: s.role,
      salary: profile.salary || 0,
      overtimeRate: profile.overtimeRate || 200,
      isActive: s.isActive,
    });
    setShowForm(true);
    setTimeout(() => scrollToForm(), 50);
  };

  const scrollToForm = () => document.getElementById('admin-form-wrapper')?.scrollIntoView({ behavior: 'smooth' });

  const handleSave = async () => {
    if (!form.name || !form.email || !form.role) {
      toast.error('Name, Email, and Role are required.');
      return;
    }
    try {
      setSubmitting(true);
      if (form.id) {
        await staffApi.update(form.id, form);
        toast.success('Staff member updated');
      } else {
        await staffApi.create(form as any);
        toast.success('Staff member created');
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      refresh();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleToggleActive = async (s: StaffMember) => {
    try {
      await staffApi.toggleActive(s.id, s.isActive);
      toast.success(s.isActive ? 'Staff deactivated' : 'Staff activated');
      refresh();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const tableColumns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (s: StaffMember) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 uppercase font-black text-xs">
            {s.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800">{s.name}</span>
            <span className="text-[10px] font-bold text-slate-400 lowercase">{s.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Department/Role',
      render: (s: StaffMember) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200/50">
          <Briefcase className="w-3 h-3" />
          {s.role}
        </span>
      ),
    },
    {
      key: 'salary',
      header: 'Salary (₹)',
      render: (s: StaffMember) => {
        const profile = getProfile(s) as any;
        return <span className="text-sm font-black text-slate-700">₹{profile.salary || 0}</span>;
      },
    },
    {
      key: 'joined',
      header: 'Joined Date',
      render: (s: StaffMember) => (
        <span className="text-xs font-bold text-slate-500">
          {new Date(s.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: StaffMember) => <AdminStatusBadge isActive={s.isActive} />,
      align: 'right' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (s: StaffMember) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => openEdit(s)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Staff"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleActive(s)}
            className={`p-2 rounded-lg transition-all ${s.isActive ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
            title={s.isActive ? "Archive Staff" : "Activate Staff"}
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
          title="Staff Administration"
          subtitle={`${total} staff members configured`}
          actions={[
            {
              label: 'Add Staff Member',
              onClick: openCreate,
              variant: 'primary',
            }
          ]}
        />

        <AdminToolbar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or email..."
          onRefresh={refresh}
          filters={[
            {
              value: filterRole,
              onChange: setFilterRole,
              options: [
                { value: 'RECEPTION', label: 'Reception' },
                { value: 'NURSING', label: 'Nursing' },
                { value: 'MEDICAL', label: 'Medical' },
              ],
              placeholder: 'All Roles',
            }
          ]}
        />

        <AdminDataTable
          data={staffMembers}
          columns={tableColumns}
          loading={loading}
          totalItems={total}
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}
          emptyIcon={<Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />}
          emptyText="No staff records found"
          rowKey={(s: any) => s.id || 'new'}
        />

        {showForm && (
          <AdminFormWrapper
            title={form.id ? 'Staff Member' : 'Staff Member'}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            isEditing={!!form.id}
            submitting={submitting}
          >
            <div className="p-2 mb-6 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500 ml-2" />
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-tight">
                Overtime auto-calc based on admin-set hourly rate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role *</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="">Select Role</option>
                  <option value="RECEPTION">Reception</option>
                  <option value="NURSING">Nursing</option>
                  <option value="MEDICAL">Medical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {form.id ? 'Change Password (optional)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={form.id ? 'Leave blank to keep' : 'Min 6 chars'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Salary (■) *</label>
                <input
                  type="number"
                  value={form.salary}
                  onChange={e => setForm(f => ({ ...f, salary: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Overtime Rate / hr (■)</label>
                <input
                  type="number"
                  value={form.overtimeRate}
                  onChange={e => setForm(f => ({ ...f, overtimeRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="relative cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Staff Member</span>
            </div>
          </AdminFormWrapper>
        )}
      </div>
    </AdminLayout>
  );
};

export default StaffManagementView;

