import DrugMasterView from '@/views/admin/drugs/page';

export const metadata = {
  title: 'Drug Master Database | MedFlow Admin',
  description: 'Manage clinic pharmacy inventory, drug stock alerts, and prescription master data.',
};

export default function DrugMasterPage() {
  return <DrugMasterView />;
}
