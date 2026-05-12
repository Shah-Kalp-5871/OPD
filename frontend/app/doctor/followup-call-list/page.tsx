import FollowUpCallListView from '@/views/doctor/followup-call-list/page';

export const metadata = {
  title: 'Follow-Up Call List | MedFlow Doctor',
  description: 'Doctor-to-Nursing coordination workflow dashboard for follow-up patient tracking.',
};

export default function FollowUpCallListPage() {
  return <FollowUpCallListView />;
}
