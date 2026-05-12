import PatientSearchView from '@/views/reception/patients/search/page';

export const metadata = {
  title: 'Patient Search | MedFlow OPD',
  description: 'Hospital patient lookup system with secure profile view and visit history.',
};

export default function ReceptionSearchPage() {
  return <PatientSearchView />;
}
