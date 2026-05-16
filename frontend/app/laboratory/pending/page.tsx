import LaboratoryPendingView from '@/views/laboratory/LaboratoryPendingView';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function LaboratoryPendingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <LaboratoryPendingView />
    </Suspense>
  );
}
