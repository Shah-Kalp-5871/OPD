import CheckInView from '@/views/reception/check-in/page';

export const metadata = {
  title: 'Patient Check-In | MedFlow OPD',
  description: 'Manage arriving patient appointments, enter vitals, and handle no-show management.',
};

export default function CheckInPage() {
  return <CheckInView />;
}
