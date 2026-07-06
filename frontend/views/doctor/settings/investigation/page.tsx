'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Settings, Plus, Edit2, Trash2, FlaskConical, Beaker, Loader2 } from 'lucide-react';

const InvestigationSettingsView = () => {
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'PARAMETERS'>('CATEGORIES');
  const [categories, setCategories] = useState<any[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', active: true, color: '#3b82f6' });
  const [parameterForm, setParameterForm] = useState({ name: '', categoryId: '', price: '', unit: '', normalRange: '', active: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, paramRes] = await Promise.all([
        api.get('/admin/lab/categories?includeInactive=true'),
        api.get('/admin/lab/parameters?includeInactive=true')
      ]);
      setCategories(catRes.data);
      setParameters(paramRes.data?.data || paramRes.data);
    } catch (err) {
      toast.error('Failed to load lab settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) return toast.error('Name is required');
    try {
      if (editItem) {
        await api.patch(`/admin/lab/categories/${editItem.id}`, categoryForm);
        toast.success('Category updated');
      } else {
        await api.post('/admin/lab/categories', categoryForm);
        toast.success('Category created');
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleSaveParameter = async () => {
    if (!parameterForm.name || !parameterForm.categoryId) return toast.error('Name and Category are required');
    try {
      const payload = { ...parameterForm, price: Number(parameterForm.price) || 0 };
      if (editItem) {
        await api.patch(`/admin/lab/parameters/${editItem.id}`, payload);
        toast.success('Parameter updated');
      } else {
        await api.post('/admin/lab/parameters', payload);
        toast.success('Parameter created');
      }
      setShowParameterModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save parameter');
    }
  };

  const handleDelete = async (type: 'category' | 'parameter', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/admin/lab/${type === 'category' ? 'categories' : 'parameters'}/${id}`);
      toast.success('Deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const openCategoryModal = (cat?: any) => {
    if (cat) {
      setEditItem(cat);
      setCategoryForm({ name: cat.name, description: cat.description || '', active: cat.active, color: cat.color || '#3b82f6' });
    } else {
      setEditItem(null);
      setCategoryForm({ name: '', description: '', active: true, color: '#3b82f6' });
    }
    setShowCategoryModal(true);
  };

  const openParameterModal = (param?: any) => {
    if (param) {
      setEditItem(param);
      setParameterForm({ 
        name: param.name, 
        categoryId: param.categoryId, 
        price: param.price.toString(), 
        unit: param.unit || '', 
        normalRange: param.normalRange || '', 
        active: param.active 
      });
    } else {
      setEditItem(null);
      setParameterForm({ name: '', categoryId: categories[0]?.id || '', price: '', unit: '', normalRange: '', active: true });
    }
    setShowParameterModal(true);
  };

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-32">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400">
                 <Settings className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    Investigation Settings
                 </h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    Manage Lab Categories, Parameters, and Pricing
                 </p>
              </div>
           </div>
        </div>

        <div className="flex gap-4 border-b border-slate-200">
          <button 
            className={`pb-4 px-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'CATEGORIES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
            onClick={() => setActiveTab('CATEGORIES')}
          >
            Categories
          </button>
          <button 
            className={`pb-4 px-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'PARAMETERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-800'}`}
            onClick={() => setActiveTab('PARAMETERS')}
          >
            Tests / Parameters
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'CATEGORIES' && (
              <>
                <div className="flex justify-end">
                  <button onClick={() => openCategoryModal()} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: cat.color || '#3b82f6', opacity: 0.2 }} />
                        <div className="flex gap-2">
                          <button onClick={() => openCategoryModal(cat)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('category', cat.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-2">{cat.description || 'No description'}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'PARAMETERS' && (
              <>
                <div className="flex justify-end">
                  <button onClick={() => openParameterModal()} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Parameter
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Normal Range</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {parameters.map(param => (
                        <tr key={param.id} className="hover:bg-slate-50/50">
                          <td className="p-4 text-xs font-black text-slate-800 uppercase tracking-widest">{param.name}</td>
                          <td className="p-4 text-xs font-bold text-slate-500">{param.category?.name}</td>
                          <td className="p-4 text-xs font-bold text-blue-600">₹{param.price}</td>
                          <td className="p-4 text-xs font-bold text-slate-500">{param.normalRange || '-'} {param.unit}</td>
                          <td className="p-4 flex justify-end gap-2">
                            <button onClick={() => openParameterModal(param)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('parameter', param.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* MODALS */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">{editItem ? 'Edit' : 'Add'} Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                  <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <input type="text" value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleSaveCategory} className="flex-1 py-3 text-xs font-black text-white uppercase tracking-widest bg-blue-600 rounded-xl hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        )}

        {showParameterModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">{editItem ? 'Edit' : 'Add'} Parameter</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Name</label>
                  <input type="text" value={parameterForm.name} onChange={e => setParameterForm({...parameterForm, name: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select value={parameterForm.categoryId} onChange={e => setParameterForm({...parameterForm, categoryId: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                    <input type="number" value={parameterForm.price} onChange={e => setParameterForm({...parameterForm, price: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Normal Range</label>
                    <input type="text" placeholder="e.g. 10 - 20" value={parameterForm.normalRange} onChange={e => setParameterForm({...parameterForm, normalRange: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</label>
                    <input type="text" placeholder="e.g. mg/dL" value={parameterForm.unit} onChange={e => setParameterForm({...parameterForm, unit: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowParameterModal(false)} className="flex-1 py-3 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleSaveParameter} className="flex-1 py-3 text-xs font-black text-white uppercase tracking-widest bg-blue-600 rounded-xl hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default InvestigationSettingsView;
