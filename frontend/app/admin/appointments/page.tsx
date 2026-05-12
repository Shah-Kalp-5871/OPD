import AppointmentManagementView from '@/views/admin/appointments/page';

export const metadata = {
  title: 'Appointment Management | MedFlow Admin',
  description: 'Manage daily clinic appointments, track patient check-ins, and configure doctor time slots.',
};

export default function AppointmentManagementPage() {
  return <AppointmentManagementView />;
}
