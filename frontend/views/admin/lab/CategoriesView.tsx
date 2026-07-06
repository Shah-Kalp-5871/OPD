
'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { labApi, LabCategory } from '@/lib/api/lab';
import { toast } from 'sonner';
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, Column } from '@/components/admin';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function CategoriesView() {
    const [categories, setCategories] = useState<LabCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = () => { setLoading(true); labApi.getCategories(true).then(res => setCategories(res.data)).finally(() => setLoading(false)); };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setSubmitting(true);
        try {
            await labApi.createCategory({ name: newCategoryName.trim() });
            toast.success('Category created');
            setNewCategoryName('');
            setShowModal(false);
            load();
        } catch (e: any) { 
            toast.error(e?.response?.data?.message || 'Failed to create category'); 
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (cat: LabCategory) => {
        // Option to archive or toggle category status if supported by API.
        toast.info("This feature will be fully supported once backend supports category toggling.");
    };

    const columns: Column<LabCategory>[] = [
        { key: 'name', header: 'Name', render: (c) => <span className="text-sm font-extrabold text-slate-800">{c.name}</span> },
        { key: 'status', header: 'Status', render: (c) => <AdminStatusBadge isActive={c.isActive} />, align: 'right' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                <AdminPageHeader
                    title="Lab Categories"
                    subtitle={`${categories.length} categories configured`}
                    actions={[{ label: 'Add Category', onClick: () => setShowModal(true), variant: 'primary' }]}
                />
                <AdminDataTable
                    data={categories}
                    columns={columns}
                    loading={loading}
                    totalItems={categories.length}
                    totalPages={1}
                    page={1}
                    onPageChange={() => {}}
                    emptyText="No categories found"
                    rowKey={c => c.id}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="font-black text-slate-800 text-lg">Add New Category</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-2 mb-6">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Hematology, Biochemistry"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm">Cancel</button>
                                <button type="submit" disabled={submitting || !newCategoryName.trim()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
