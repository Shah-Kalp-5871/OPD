import LaboratoryProcessingView from '@/views/laboratory/LaboratoryProcessingView';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function LaboratoryProcessingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <LaboratoryProcessingView orderId={resolvedParams.orderId} />
    </Suspense>
  );
}
