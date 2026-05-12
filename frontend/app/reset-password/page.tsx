import ResetPasswordView from '@/views/auth/reset-password/page';

export const metadata = {
  title: 'Reset Password | MedFlow OPD',
  description: 'Set a new secure password for your OPD Clinic Management account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
