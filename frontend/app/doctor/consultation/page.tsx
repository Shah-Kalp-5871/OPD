import { redirect } from 'next/navigation';

export default function ConsultationRedirect() {
  redirect('/doctor/consultation/complaints');
}
