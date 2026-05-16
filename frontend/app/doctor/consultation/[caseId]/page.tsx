import ConsultationView from '@/views/doctor/consultation/page';

export const metadata = {
  title: 'Consultation Workspace | MedFlow Clinical OS',
  description: 'Structured clinical consultation workspace for physicians.',
};

export default async function ConsultationPage({ params }: { params: Promise<{ caseId: string }> }) {
  const resolvedParams = await params;
  return <ConsultationView caseId={resolvedParams.caseId} />;
}
