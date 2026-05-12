import MyProfileView from '@/views/admin/profile/page';

export const metadata = {
  title: 'My Profile | MedFlow Admin',
  description: 'Manage your personal account details, contact information, and security settings.',
};

export default function ProfilePage() {
  return <MyProfileView />;
}
