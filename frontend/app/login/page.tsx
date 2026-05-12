import StaticLoginView from "@/views/auth/login/page";

export const metadata = {
  title: 'Login | MedFlow Clinic Management',
  description: 'Access the MedFlow Clinic Management System with role-based authentication.',
};

export default function LoginPage() {
  return <StaticLoginView />;
}