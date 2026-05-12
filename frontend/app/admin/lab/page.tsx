import LabMasterView from '@/views/admin/lab/page';

export const metadata = {
  title: 'Lab Investigation Master | MedFlow Admin',
  description: 'Configure diagnostic parameters, normal ranges, and critical thresholds.',
};

export default function LabMasterPage() {
  return <LabMasterView />;
}
