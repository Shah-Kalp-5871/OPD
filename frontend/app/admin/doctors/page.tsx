import DoctorManagementView from '@/views/admin/doctors/page';

export const metadata = {
  title: 'Doctor Management | MedFlow Admin',
  description: 'Manage doctor profiles, consultation fees, and appointment schedules.',
};

export default function DoctorManagementPage() {
  return <DoctorManagementView />;
}
