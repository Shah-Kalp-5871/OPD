import StaffManagementView from '@/views/admin/staff/page';

export const metadata = {
  title: 'Staff Management | MedFlow Admin',
  description: 'Manage clinic staff, track attendance, and process payroll/salary.',
};

export default function StaffManagementPage() {
  return <StaffManagementView />;
}
