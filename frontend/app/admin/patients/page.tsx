import PatientManagementView from '@/views/admin/patients/page';

export const metadata = {
  title: 'Patient Management | MedFlow Admin',
  description: 'Manage clinic patient records, view medical history, and upgrade profiles.',
};

export default function PatientManagementPage() {
  return <PatientManagementView />;
}
