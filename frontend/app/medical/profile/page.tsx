import MedicalProfileView from "@/views/medical/profile/page";

export const metadata = {
  title: 'My Profile | MedFlow Pharmacy',
  description: 'Manage your pharmacy account information and password settings.',
};

export default function ProfilePage() {
  return <MedicalProfileView />;
}
