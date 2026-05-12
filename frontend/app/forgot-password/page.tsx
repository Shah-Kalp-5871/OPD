import ForgotPasswordView from '@/views/auth/forgot-password/page';

export const metadata = {
  title: 'Forgot Password | MedFlow OPD',
  description: 'Recover your account access by entering your registered email.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
