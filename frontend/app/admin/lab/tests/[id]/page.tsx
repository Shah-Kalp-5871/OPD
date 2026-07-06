
import EditTestView from '@/views/admin/lab/EditTestView';
export const metadata = { title: 'Edit Lab Test | Admin' };
export default function EditTestPage({ params }: { params: Promise<{ id: string }> }) { 
  return <EditTestView params={params} />; 
}
