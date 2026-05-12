import MyProfileView from '@/views/reception/my-profile/page';

export const metadata = {
  title: 'My Profile | MedFlow Reception',
  description: 'Manage your reception account details, security settings, and view attendance records.',
};

export default function MyProfilePage() {
  return <MyProfileView />;
}
