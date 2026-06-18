import RescheduleAppointmentView from '@/views/reception/appointments/reschedule/page';

export default async function RescheduleAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RescheduleAppointmentView appointmentId={id} />;
}
