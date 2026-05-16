import { Suspense } from 'react';
import VitalsEntryView from "@/views/nursing/vitals/page";
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Vitals Entry | MedFlow Nursing',
  description: 'Pre-consultation patient vitals capture and history.',
};

export default function VitalsEntryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Vitals Entry...</p>
      </div>
    }>
      <VitalsEntryView />
    </Suspense>
  );
}
