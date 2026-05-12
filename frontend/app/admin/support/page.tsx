import SupportTicketView from '@/views/admin/support/page';

export const metadata = {
  title: 'Support & Tickets | MedFlow Admin',
  description: 'IT helpdesk and support ticket management for system issues, feature requests, and access control.',
};

export default function SupportPage() {
  return <SupportTicketView />;
}
