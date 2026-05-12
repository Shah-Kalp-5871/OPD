import BookAppointmentView from '@/views/reception/appointments/book/page';

export const metadata = {
  title: 'Book Appointment | MedFlow OPD',
  description: 'Schedule outpatient appointments, manage time slots, and assign doctors.',
};

export default function BookAppointmentPage() {
  return <BookAppointmentView />;
}
