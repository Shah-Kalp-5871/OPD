import BookAppointmentView from '@/views/doctor/appointments/book/page';

export const metadata = {
  title: 'Book Appointment | Doctor Panel',
  description: 'Schedule outpatient appointments for your OPD queue.',
};

export default function BookAppointmentPage() {
  return <BookAppointmentView />;
}
