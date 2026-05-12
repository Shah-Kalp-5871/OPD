import NursingProfileView from "@/views/nursing/profile/page";

export const metadata = {
  title: 'My Profile | MedFlow Nursing',
  description: 'Manage your nursing account information and password.',
};

export default function ProfilePage() {
  return <NursingProfileView />;
}
