import NursingFollowupView from "@/views/nursing/followup/page";

export const metadata = {
  title: 'Follow-Up Call Management | MedFlow Nursing',
  description: 'Manage patient follow-up calls, rescheduling, and outcomes forwarded by doctors.',
};

export default function FollowupPage() {
  return <NursingFollowupView />;
}
