import PaymentManagementView from '@/views/admin/payment-management/page';

export const metadata = {
  title: 'Payment Management | MedFlow Admin',
  description: 'Configure UPI ID and direct payment options for the clinic.',
};

export default function PaymentManagementPage() {
  return <PaymentManagementView />;
}
