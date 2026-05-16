import { Suspense } from 'react';
import ConsentFormView from '@/views/reception/consent-form/page';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Consent Form Management | MedFlow OPD',
  description: 'Manage medico-legal procedure consents with multi-language templates and print-friendly previews.',
};

export default function ConsentFormPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Consent Forms...</p>
      </div>
    }>
      <ConsentFormView />
    </Suspense>
  );
}
