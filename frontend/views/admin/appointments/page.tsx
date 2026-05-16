'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  CalendarDays, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar,
  Users,
  Activity,
  User as UserIcon,
  ChevronRight,
  RefreshCcw,
  Ban,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { DetailModal } from '@/components/admin/DetailModal';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { usePaginatedAdminData } from '@/hooks/admin/usePaginatedAdminData';
import { appointmentApi, Appointment, AppointmentStats } from '@/lib/api/appointments';
import { doctorsApi, Doctor } from '@/lib/api/doctors';

interface AppointmentFilters {
  status: string;
  doctorId: string;
  startDate: string;
  endDate: string;
}

const AppointmentStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string, variant: 'blue' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'slate' | 'orange' }> = {
    SCHEDULED: { label: 'Scheduled', variant: 'slate' },
    CONFIRMED: { label: 'Confirmed', variant: 'indigo' },
    CHECKED_IN: { label: 'Checked-In', variant: 'amber' },
    COMPLETED: { label: 'Completed', variant: 'emerald' },
    CANCELLED: { label: 'Cancelled', variant: 'rose' },
    NO_SHOW: { label: 'No Show', variant: 'orange' },
  };

  const config = statusConfig[status] || { label: status, variant: 'slate' };
  return <StatusBadge label={config.label} variant={config.variant} />;
};

const StatCard = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
    <div className="flex items-center justify-between text-slate-400">
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      {icon}
    </div>
    <span className="text-2xl font-black text-slate-800">{value}</span>
  </div>
);

export default function AppointmentManagementView() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', remarks: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch doctors for filter
  useEffect(() => {
    doctorsApi.findAll({ limit: 100 }).then(res => setDoctors(res.items));
  }, []);

  const { 
    data, 
    total,
    page,
    totalPages,
    loading, 
    search: searchQuery, 
    setSearch: setSearchQuery, 
    filters, 
    setFilter, 
    setPage,
    refresh 
  } = usePaginatedAdminData<Appointment, AppointmentFilters>({
    fetchFn: (params) => appointmentApi.findAll(params),
    defaultFilters: {
      status: 'ALL',
      doctorId: 'ALL',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const { status, doctorId, startDate, endDate } = filters;

  const [adminStats, setAdminStats] = useState<AppointmentStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const s = await appointmentApi.getStats(startDate);
      setAdminStats(s);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, [startDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleData.date || !rescheduleData.time) return;
    
    setIsRescheduling(true);
    try {
      await appointmentApi.reschedule(selectedAppointment.id, {
        newDate: rescheduleData.date,
        newTime: rescheduleData.time,
        remarks: rescheduleData.remarks
      });
      toast.success('Appointment rescheduled successfully');
      setIsDetailModalOpen(false);
      refresh();
      fetchStats();
    } catch (e) {
      toast.error('Failed to reschedule');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment || !cancelReason) return;
    
    setIsCancelling(true);
    try {
      await appointmentApi.cancel(selectedAppointment.id, { reason: cancelReason });
      toast.success('Appointment cancelled successfully');
      setIsDetailModalOpen(false);
      refresh();
      fetchStats();
    } catch (e) {
      toast.error('Failed to cancel');
    } finally {
      setIsCancelling(false);
    }
  };

  const columns: Column<Appointment>[] = [
    {
      header: 'Case / Appt ID',
      key: 'id',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">
            {row.patientCase?.caseNumber || 'No Case'}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            {row.id.slice(0, 8)}...
          </span>
        </div>
      )
    },
    {
      header: 'Patient',
      key: 'patient',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-800">{row.patient.firstName} {row.patient.lastName}</span>
          <span className="text-[10px] font-bold text-slate-400">{row.patient.mobile}</span>
        </div>
      )
    },
    {
      header: 'Appt Time',
      key: 'appointmentTime',
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-700 font-black text-sm">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          {format(new Date(row.appointmentTime), 'hh:mm a')}
        </div>
      )
    },
    {
      header: 'Purpose',
      key: 'purpose',
      render: (row) => (
        <span className="px-2.5 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {row.purpose}
        </span>
      )
    },
    {
      header: 'Doctor',
      key: 'doctor',
      render: (row) => (
        <span className="text-xs font-bold text-slate-600">
          Dr. {row.doctor.user.firstName} {row.doctor.user.lastName}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (row) => <AppointmentStatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <button 
          onClick={() => {
            setSelectedAppointment(row);
            setIsDetailModalOpen(true);
          }}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <AdminPageHeader 
          title="Appointment Management" 
          subtitle="Operational command center for scheduling and capacity control"
          icon={<CalendarDays className="w-6 h-6 text-indigo-500" />}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label="Total" value={adminStats?.total || 0} icon={<CalendarDays className="w-4 h-4" />} color="blue" />
          <StatCard label="Confirmed" value={adminStats?.confirmed || 0} icon={<CheckCircle2 className="w-4 h-4" />} color="indigo" />
          <StatCard label="Checked-In" value={adminStats?.checkedIn || 0} icon={<Clock className="w-4 h-4" />} color="amber" />
          <StatCard label="Completed" value={adminStats?.completed || 0} icon={<CheckCircle2 className="w-4 h-4" />} color="emerald" />
          <StatCard label="Cancelled" value={adminStats?.cancelled || 0} icon={<XCircle className="w-4 h-4" />} color="rose" />
          <StatCard label="Scheduled" value={adminStats?.scheduled || 0} icon={<Clock className="w-4 h-4" />} color="slate" />
          <StatCard label="No Show" value={adminStats?.noShow || 0} icon={<AlertCircle className="w-4 h-4" />} color="orange" />
        </div>

        <div className="flex flex-col gap-4">
          <AdminToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={refresh}
            filters={[
              {
                value: startDate,
                onChange: (val) => setFilter('startDate', val),
                placeholder: 'Date',
                type: 'date'
              },
              {
                value: doctorId,
                onChange: (val) => setFilter('doctorId', val),
                placeholder: 'All Doctors',
                options: doctors.map(d => ({ label: `Dr. ${d.name}`, value: d.doctorProfile?.id }))
              },
              {
                value: status,
                onChange: (val) => setFilter('status', val),
                placeholder: 'All Statuses',
                options: [
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Scheduled', value: 'SCHEDULED' },
                  { label: 'Confirmed', value: 'CONFIRMED' },
                  { label: 'Checked-In', value: 'CHECKED_IN' },
                  { label: 'Completed', value: 'COMPLETED' },
                  { label: 'Cancelled', value: 'CANCELLED' }
                ]
              }
            ]}
          />

          <div className="min-h-[400px]">
            <AdminDataTable 
              columns={columns}
              data={data}
              loading={loading}
              page={page}
              totalPages={totalPages}
              totalItems={total}
              onPageChange={setPage}
              rowKey={(item) => item.id}
            />
          </div>
        </div>

        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Appointment Operations"
        >
          {selectedAppointment && (
            <div className="flex flex-col gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                  <AppointmentStatusBadge status={selectedAppointment.status} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-slate-800">
                      {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {selectedAppointment.patient.mobile}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <RefreshCcw className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Reschedule</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="date" 
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <input 
                      type="time" 
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                    />
                    <textarea 
                      placeholder="Reason/Remarks"
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg h-16 resize-none"
                      value={rescheduleData.remarks}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, remarks: e.target.value }))}
                    />
                    <button 
                      onClick={handleReschedule}
                      disabled={isRescheduling || !rescheduleData.date}
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      {isRescheduling ? 'Processing...' : 'Reschedule'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2 text-rose-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Cancel</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <textarea 
                      placeholder="Cancellation Reason"
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg h-32 resize-none"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <button 
                      onClick={handleCancel}
                      disabled={isCancelling || !cancelReason}
                      className="w-full py-2 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      {isCancelling ? 'Processing...' : 'Cancel Appointment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DetailModal>
      </div>
    </AdminLayout>
  );
}
