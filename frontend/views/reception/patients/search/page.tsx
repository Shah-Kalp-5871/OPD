'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Search, 
  User, 
  Phone, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  Activity,
  Filter,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';
import api from '@/lib/api';

const PatientSearchView = () => {
  const router = useRouter();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Patients
  const fetchPatients = useCallback(async (query = '', page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/patients/search?q=${query}&page=${page}&limit=${pagination?.limit || 10}`);
      const data = response.data || response;
      if (data) {
        setPatients(data.items || []);
        setPagination({
          total: data.total || 0,
          page: Number(data.page) || 1,
          limit: Number(data.limit) || 10,
          totalPages: data.totalPages || 1
        });
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination?.limit]);

  // Initial load
  useEffect(() => {
    fetchPatients('', 1);
  }, [fetchPatients]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        fetchPatients(searchQuery, 1);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPatients]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPatients(searchQuery, newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* 🔷 HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Patient Directory</h1>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Browse and manage all registered patients</p>
          </div>
          <button 
            onClick={() => router.push('/reception/patients/register')}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100"
          >
            <UserPlus className="w-4 h-4" />
            New Registration
          </button>
        </div>

        {/* 🔷 SEARCH & FILTER BAR */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
              placeholder="Search by MRD Number, Name, or Mobile Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* 🔷 PATIENTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">MRD Number <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gender</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Visit</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg. Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.length > 0 ? (
                  patients.map(p => (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/reception/patients/${p.id}`)}
                    >
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-black tracking-widest border border-orange-100">
                          {p.mrdNumber}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-black text-[10px] uppercase">
                            {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{p.firstName} {p.lastName}</p>
                            <p className="text-[10px] font-bold text-slate-400">{p.profile?.age || 'N/A'} Years • {p.profile?.bloodGroup || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs font-bold tracking-tight">{p.mobile}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                          p.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 
                          p.gender === 'FEMALE' ? 'bg-rose-50 text-rose-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         {p.cases && p.cases.length > 0 ? (
                           <span className="text-[10px] font-black text-orange-600 uppercase tracking-tight">{formatDate(p.cases[0].createdAt)}</span>
                         ) : (
                           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">New Patient</span>
                         )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{formatDate(p.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/reception/patients/${p.id}`);
                            }}
                            className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-orange-600 hover:border-orange-200 hover:shadow-sm rounded-xl transition-all"
                            title="Open Patient File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                          <Search className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No patients found</p>
                        <p className="text-[10px] font-bold text-slate-300 max-w-[200px]">Try adjusting your search filters or register a new patient.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Skeleton state
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-8 py-6">
                        <div className="h-8 bg-slate-50 rounded-xl w-full"></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔷 PAGINATION */}
          {pagination?.totalPages > 1 && (
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {((pagination?.page - 1) * pagination?.limit) + 1} - {Math.min(pagination?.page * pagination?.limit, pagination?.total)} of {pagination?.total} patients
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(pagination?.page - 1)}
                  disabled={pagination?.page === 1}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination?.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                        pagination?.page === i + 1 
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-100' 
                          : 'bg-white text-slate-400 hover:text-slate-800 border border-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handlePageChange(pagination?.page + 1)}
                  disabled={pagination?.page === pagination?.totalPages}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default PatientSearchView;
