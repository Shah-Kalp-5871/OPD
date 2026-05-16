import { Suspense } from 'react';
import LabUploadView from '@/views/reception/lab-upload/page';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Lab Report Upload | MedFlow OPD',
  description: 'Upload scanned lab reports, enter key parameters, and link investigations to OPD cases.',
};

export default function LabUploadPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Lab Upload...</p>
      </div>
    }>
      <LabUploadView />
    </Suspense>
  );
}
