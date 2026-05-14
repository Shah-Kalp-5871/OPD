import ConsultationView from '@/views/doctor/consultation/page';

export const metadata = {
  title: 'Consultation Workspace | MedFlow Clinical OS',
  description: 'Structured clinical consultation workspace for physicians.',
};

export default function ConsultationPage({ params }: { params: { caseId: string } }) {
  return <ConsultationView caseId={params.caseId} />;
}
