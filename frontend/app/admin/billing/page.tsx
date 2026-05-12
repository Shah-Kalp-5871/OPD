import BillingManagementView from '@/views/admin/billing/page';

export const metadata = {
  title: 'Billing & Transactions | MedFlow Admin',
  description: 'Clinic financial dashboard, revenue tracking, and payment gateway configuration.',
};

export default function BillingPage() {
  return <BillingManagementView />;
}
