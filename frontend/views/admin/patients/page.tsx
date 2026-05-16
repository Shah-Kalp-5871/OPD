'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  User, 
  Eye, 
  History, 
  CreditCard, 
  Calendar,
  MoreVertical,
  Activity,
  FileText,
  UserCheck,
  UserX
} from 'lucide-react';
import { 
  AdminPageHeader,
  AdminToolbar,
  AdminDataTable,
  Column 
} from '@/components/admin';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';
import { patientApi, Patient } from '@/lib/api/patients';
import { toast } from 'sonner';

const PatientManagementView = () => {
  const {
    data,
    total,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    refresh,
    filters,
    setFilter,
    loading,
  } = usePaginatedAdminData<Patient, { gender?: string; isActive?: boolean }>({
    fetchFn: (params) => patientApi.findAll(params),
    defaultFilters: {
      gender: '',
      isActive: undefined,
    },
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const columns: Column<Patient>[] = [
    {
      key: 'mrd',
      header: 'MRD No.',
      render: (p) => p.mrdNumber,
      className: 'font-bold text-indigo-600',
    },
    {
      key: 'name',
      header: 'Patient Name',
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-800">{p.firstName} {p.lastName}</span>
          <span className="text-[10px] text-slate-400 font-bold">Mobile: {p.mobile}</span>
        </div>
      ),
    },
    {
      key: 'age_gender',
      header: 'Age / Gender',
      render: (p) => (
        <span className="text-xs font-bold text-slate-600">
          {p.profile?.age || 'N/A'}Y / {p.gender}
        </span>
      ),
    },
    {
      key: 'registration',
      header: 'Registration',
      render: (p) => (
        <span className="text-xs font-bold text-slate-500">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'completeness',
      header: 'Completeness',
      render: (p) => (
        <div className="w-24">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black text-slate-400">{p.profileCompletionStatus}%</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                p.profileCompletionStatus > 80 ? 'bg-emerald-500' : 
                p.profileCompletionStatus > 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${p.profileCompletionStatus}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (p) => (
        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
          p.isActive 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-slate-100 text-slate-400 border border-slate-200'
        }`}>
          {p.isActive ? 'Active' : 'Archived'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => {
              setSelectedPatient(p);
              setShowDetailModal(true);
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleActive(p)}
            className={`p-1.5 rounded-lg transition-colors ${
              p.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={p.isActive ? 'Archive' : 'Restore'}
          >
            {p.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  const handleToggleActive = async (patient: Patient) => {
    try {
      await patientApi.toggleActive(patient.id, patient.isActive);
      toast.success(`Patient ${patient.isActive ? 'archived' : 'restored'} successfully`);
      refresh();
    } catch (error) {
      toast.error('Failed to update patient status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader 
          title="Patient Administration" 
          subtitle="Manage patient records, lifecycle, and operational history"
          icon={<User className="w-6 h-6 text-indigo-600" />}
        />

        <AdminToolbar 
          searchQuery={search}
          onSearchChange={setSearch}
          onRefresh={refresh}
          searchPlaceholder="Search Name / MRD / Mobile..."
          filters={[
            {
              value: filters.gender || '',
              onChange: (val) => setFilter('gender', val),
              placeholder: 'All Genders',
              options: [
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]
            },
            {
              value: filters.isActive === undefined ? '' : filters.isActive.toString(),
              onChange: (val) => setFilter('isActive', val === '' ? undefined : val === 'true'),
              placeholder: 'All Status',
              options: [
                { label: 'Active', value: 'true' },
                { label: 'Archived', value: 'false' },
              ]
            }
          ]}
        />

        <AdminDataTable 
          columns={columns}
          data={data}
          loading={loading}
          totalItems={total}
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}
          rowKey={(p) => p.id}
        />
      </div>

      {showDetailModal && selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </AdminLayout>
  );
};

// Internal Component for Patient Details
const PatientDetailModal = ({ patient, onClose }: { patient: Patient, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'billing' | 'appointments'>('history');
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === 'history') res = await patientApi.getHistory(patient.id);
        else if (activeTab === 'billing') res = await patientApi.getBilling(patient.id);
        else if (activeTab === 'appointments') res = await patientApi.getAppointments(patient.id);
        setDetailData(res);
      } catch (error) {
        toast.error('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [activeTab, patient.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{patient.firstName} {patient.lastName}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{patient.mrdNumber}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{patient.gender} • {patient.profile?.age || 'N/A'} Years</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex px-6 pt-4 border-b border-slate-100 gap-8">
          {[
            { id: 'history', label: 'Visit History', icon: History },
            { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : detailData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p>No records found for this category</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'history' && detailData.map((item: any) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-800">{item.caseNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        item.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>{item.status}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Consulting Doctor</p>
                      <p className="text-xs font-bold text-slate-700">{item.doctor?.name || 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                      <p className="text-xs font-bold text-slate-700 italic">{item.consultation?.provisionalDiagnosis || 'No diagnosis recorded'}</p>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'billing' && detailData.map((bill: any) => (
                <div key={bill.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-800">{bill.billNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        bill.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>{bill.paymentStatus}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">₹{bill.netAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    {bill.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>{item.serviceName} x{item.quantity}</span>
                        <span>₹{item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {activeTab === 'appointments' && detailData.map((appt: any) => (
                <div key={appt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-slate-800">{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{appt.appointmentTime}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500">Dr. {appt.doctor?.user?.name} ({appt.doctor?.specialization})</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                      appt.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                    }`}>{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-900 transition-all shadow-md shadow-slate-200"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientManagementView;
