import NotificationsView from '@/views/admin/notifications/page';

export const metadata = {
  title: 'Notifications & Templates | MedFlow Admin',
  description: 'Manage SMS and WhatsApp communication templates, automation triggers, and patient reminders.',
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
