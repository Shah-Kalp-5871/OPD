import ReceptionFollowupView from "@/views/reception/followup/page";

export const metadata = {
  title: 'Follow-Up Booking & Management | MedFlow Reception',
  description: 'Manage patient follow-up calls, rescheduling, and outcomes.',
};

export default function FollowupPage() {
  return <ReceptionFollowupView />;
}
