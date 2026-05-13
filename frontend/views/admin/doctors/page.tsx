'use client';
import React from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import Link from 'next/link';
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
import api from '@/lib/api';
import { toast } from 'sonner';

const DoctorManagementView = () => {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error: any) {
        toast.error('Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Appointment & Schedule Configuration</p>
          </div>
          <Link 
            href="/admin/doctors/add"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <UserPlus className="w-4 h-4" />
            + Add Doctor
          </Link>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No doctors found</span>
                    </td>
                  </tr>
                ) : doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-extrabold text-slate-800">{doc.name}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-bold text-sm">
                      {doc.email}
                    </td>
                    <td className="px-8 py-5 text-slate-700 font-black text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-slate-400 font-medium">■</span> {doc.doctorProfile?.consultationFee || 0}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-600">
                          {doc.doctorProfile?.morningStart || '--:--'} - {doc.doctorProfile?.morningEnd || '--:--'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100/50 w-fit">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Future Appointments Only
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${doc.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link 
                        href={`/admin/doctors/edit?id=${doc.id}`}
                        className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-100"
                      >
                        [Edit]
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoctorManagementView;
