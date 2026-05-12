'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  RefreshCcw, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Lock,
  MoreVertical
} from 'lucide-react';

const PatientManagementView = () => {
  const [activeTab, setActiveTab] = useState('All Patients');

  const tabs = ['All Patients', 'New (This Month)', 'Active', 'Deactivated'];

  const patients = [
    { mrd: 'P03-260001', name: 'Rameshbhai M. Patel', age: 35, gender: 'Male', date: '01/03/2026', status: 'Active' },
    { mrd: 'P03-260002', name: 'Sneha R. Shah', age: 28, gender: 'Female', date: '02/03/2026', status: 'Active' },
    { mrd: 'P03-260003', name: 'Mahesh K. Kumar', age: 45, gender: 'Male', date: '03/03/2026', status: 'Active' },
    { mrd: 'P02-260044', name: 'Priya N. Desai', age: 22, gender: 'Female', date: '14/02/2026', status: 'Active' },
    { mrd: 'P01-260010', name: 'Kishore P. Joshi', age: 60, gender: 'Male', date: '10/01/2026', status: 'Deactivated' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Patient Management</h1>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by Name / Mobile / MRD No."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm w-full md:w-80"
              />
            </div>
            <button className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-900 transition-all shadow-md shadow-slate-200">
              Search
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm inline-flex gap-1 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Patient Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                  <th className="px-6 py-4">MRD No.</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Age</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Reg. Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.map((p) => (
                  <tr key={p.mrd} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600">{p.mrd}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-800">{p.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">Mobile: 98XXXXXX21</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-600">{p.age}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">{p.gender}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500">{p.date}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'Active' ? (
                          <>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group/btn" title="Deactivate">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Restore">
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing 1-5 of <span className="text-slate-800">1,248</span> records
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700">
                Page 1 of 250
              </div>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Upgrade Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Profile Upgrade (Doctor / Admin Only)</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sensitive medical data restricted access</p>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'DOB (E/D)', placeholder: 'DD/MM/YYYY' },
              { label: 'Blood Group (E/D)', placeholder: 'Select' },
              { label: 'Email (E/D)', placeholder: 'user@email.com' },
              { label: 'Allergies', placeholder: 'e.g. Penicillin' },
              { label: 'Past History', placeholder: 'e.g. Diabetes' },
            ].map((field) => (
              <div key={field.label} className="space-y-2 opacity-50 grayscale pointer-events-none">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{field.label}</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-400 italic">
                  {field.placeholder}
                </div>
              </div>
            ))}
          </div>
          <div className="px-8 pb-8 flex justify-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">
              <Lock className="w-3.5 h-3.5" />
              OTP verification required for basic field edits.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientManagementView;
