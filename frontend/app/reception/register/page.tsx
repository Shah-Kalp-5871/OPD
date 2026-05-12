import PatientRegistrationView from '@/views/reception/patients/register/page';

export const metadata = {
  title: 'New Patient Registration | MedFlow OPD',
  description: 'Hospital front desk registration system for patient onboarding and sticker printing.',
};

export default function ReceptionRegisterPage() {
  return <PatientRegistrationView />;
}
