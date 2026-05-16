import PharmacyQueueView from '@/views/pharmacy/PharmacyQueueView';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function PharmacyQueuePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <PharmacyQueueView />
    </Suspense>
  );
}
