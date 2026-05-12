import ProcedureMasterView from '@/views/admin/procedures/page';

export const metadata = {
  title: 'Procedure Master | MedFlow Admin',
  description: 'Manage clinical/aesthetic procedures, pricing structures, and session planning templates.',
};

export default function ProcedureMasterPage() {
  return <ProcedureMasterView />;
}
