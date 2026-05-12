'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  DollarSign, 
  Calendar, 
  Settings, 
  Save, 
  Edit3, 
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const DoctorManagementView = () => {
  const [editingDoctor, setEditingDoctor] = useState<any>(null);

  const doctors = [
    { 
      id: 1,
      name: 'Dr. Raj Valaki', 
      email: 'dr.valaki@clinic.com', 
      fee: 500, 
      slots: '10:00 - 14:00', 
      status: 'Active',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      morning: { start: '10:00', end: '14:00' },
      evening: { start: '17:00', end: '20:00' },
      gap: 10,
      duration: 15
    },
    { 
      id: 2,
      name: 'Dr. Meena Shah', 
      email: 'dr.shah@clinic.com', 
      fee: 400, 
      slots: '10:00 - 14:00', 
      status: 'Active',
      days: ['Mon', 'Wed', 'Fri'],
      morning: { start: '10:00', end: '14:00' },
      evening: { start: '16:00', end: '19:00' },
      gap: 5,
      duration: 20
    },
  ];

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    // Smooth scroll to form
    document.getElementById('doctor-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    document.getElementById('doctor-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Appointment & Schedule Configuration</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <UserPlus className="w-4 h-4" />
            + Add Doctor
          </button>
        </div>

        {/* Doctor List Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Consult Fee</th>
                  <th className="px-8 py-5">Time Slots</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-extrabold text-slate-800">{doc.name}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-bold text-sm">
                      {doc.email}
                    </td>
                    <td className="px-8 py-5 text-slate-700 font-black text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-slate-400 font-medium">■</span> {doc.fee}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-600">{doc.slots}</span>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100/50 w-fit">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Future Appointments Only
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(doc)}
                        className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-100"
                      >
                        [Edit]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Form Section - NOW AT BOTTOM */}
        <div id="doctor-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-12 scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              {editingDoctor ? 'Edit Doctor Form' : 'Add / Edit Doctor Form'}
            </h3>
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg flex items-center gap-3">
              <Info className="w-4 h-4 text-amber-500" />
              <p className="text-[10px] text-amber-700 font-bold uppercase leading-tight tracking-wider">
                Disable = doctor hidden from booking.<br/>History retained.
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Row 1: Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Doctor Full Name *</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingDoctor?.name}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingDoctor?.email}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Consult Fee (■) *</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingDoctor?.fee}
                />
              </div>
            </div>

            {/* Row 2: Availability & Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Available Days (Checkboxes)</label>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <button key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[10px] font-black hover:border-blue-500 transition-all">
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Morning Slot (Start–End)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="10:00" />
                  <input type="time" className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="14:00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Evening Slot (Start–End)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="17:00" />
                  <input type="time" className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="20:00" />
                </div>
              </div>
            </div>

            {/* Row 3: Configurations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Inter-Appt Gap (mins)</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Min Slot Duration (mins)</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active / Disabled</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 flex justify-center">
              <button className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                SAVE DOCTOR
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoctorManagementView;
