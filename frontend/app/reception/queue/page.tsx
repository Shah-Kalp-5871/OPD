import OpdQueueView from '@/views/reception/opd-queue/page';

export const metadata = {
  title: 'OPD Queue Management | MedFlow OPD',
  description: 'Live tracking of patient appointments, doctor signals, and check-in statuses.',
};

export default function OpdQueuePage() {
  return <OpdQueueView />;
}
