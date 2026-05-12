import BillingView from '@/views/reception/billing/page';

export const metadata = {
  title: 'Billing & Payment | MedFlow OPD',
  description: 'Manage patient billing, collection, and receipt generation for OPD services.',
};

export default function BillingPage() {
  return <BillingView />;
}
