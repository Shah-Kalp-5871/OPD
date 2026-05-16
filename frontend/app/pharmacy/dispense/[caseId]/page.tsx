import PharmacyDispensingView from '@/views/pharmacy/PharmacyDispensingView';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function PharmacyDispensingPage({ params }: { params: Promise<{ caseId: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <PharmacyDispensingView caseId={resolvedParams.caseId} />
    </Suspense>
  );
}
