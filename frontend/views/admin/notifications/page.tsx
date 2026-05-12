'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Bell, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Smartphone, 
  Users, 
  Search,
  Info,
  Layers,
  Save,
  MessageCircle
} from 'lucide-react';

const NotificationsView = () => {
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const templates = [
    { name: 'Appointment Confirmation', status: 'Enabled', trigger: 'Immediate on booking', type: 'Auto' },
    { name: '1-Day Advance Reminder', status: 'Enabled', trigger: '1 day before appointment', type: 'Auto' },
    { name: 'Follow-Up Reminder', status: 'Enabled', trigger: '1 day before F/U date', type: 'Auto' },
    { name: 'Appointment Cancellation', status: 'Enabled', trigger: 'On cancellation', type: 'Auto' },
    { name: 'Birthday Wish', status: 'Enabled', trigger: 'On patient birthday', type: 'Auto' },
    { name: 'F/U Rescheduled', status: 'Enabled', trigger: 'After nursing updates F/U', type: 'Auto' },
    { name: 'Bulk Appointment Message', status: 'Manual', trigger: 'Admin-triggered', type: 'Manual' },
    { name: 'Google Review Request', status: 'Manual', trigger: 'Doctor-triggered per patient', type: 'Manual' },
  ];

  const handleEdit = (tmpl: any) => {
    setEditingTemplate(tmpl);
    document.getElementById('edit-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  const placeholders = [
    '[Patient Name]', '[Appointment Date]', '[Appointment Time]', 
    '[Doctor Name]', '[Clinic Name]', '[Review Link]'
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">SMS / WhatsApp Message Template Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Clinic Automation & Communication Panel</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600">
                  <Smartphone className="w-4 h-4" />
                </div>
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Channels</span>
          </div>
        </div>

        {/* Template Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Template Name</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Trigger</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {templates.map((tmpl, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tmpl.type === 'Manual' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">{tmpl.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {tmpl.status === 'Enabled' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" />
                            {tmpl.status}
                          </span>
                        ) : tmpl.status === 'Manual' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <Send className="w-3 h-3" />
                            {tmpl.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <XCircle className="w-3 h-3" />
                            {tmpl.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 italic uppercase tracking-tighter">
                        <Zap className={`w-3.5 h-3.5 ${tmpl.type === 'Manual' ? 'text-slate-300' : 'text-amber-500'}`} />
                        {tmpl.trigger}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(tmpl)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        [Edit]
                      </button>
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
                  Note: Templates support dynamic placeholders auto-replaced at send time. Birthday wishes only sent if DOB is present in patient profile.
                </p>
             </div>
          </div>
        </div>

        {/* 🔷 Edit Template Section */}
        <div id="edit-panel" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Edit Template (Click Edit on any row)'}
            </h3>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Template Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
                  defaultValue={editingTemplate?.name}
                  placeholder="e.g. Follow-Up Reminder"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status (Enabled/Disabled)</label>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={editingTemplate?.status === 'Enabled'} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Automation</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Message Body (use [placeholders] for dynamic fields)</label>
                <div className="flex flex-wrap gap-2">
                   {placeholders.map((p, i) => (
                     <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-tighter border border-blue-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
                       {p}
                     </span>
                   ))}
                </div>
              </div>
              <textarea 
                rows={5}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all resize-none placeholder:text-slate-300 placeholder:italic leading-relaxed"
                placeholder="Dear [Patient Name], your appointment is scheduled on [Appointment Date] at [Appointment Time] with Dr. [Doctor Name]. Thank you for choosing [Clinic Name]."
                defaultValue={editingTemplate ? `Dear [Patient Name], your ${editingTemplate.name} is set for [Appointment Date]. We look forward to seeing you at [Clinic Name].` : ''}
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Automated messages follow clinic working hours (9 AM - 8 PM).</span>
              </div>
              <button className="px-20 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center gap-3">
                <Save className="w-4 h-4" />
                SAVE TEMPLATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotificationsView;
