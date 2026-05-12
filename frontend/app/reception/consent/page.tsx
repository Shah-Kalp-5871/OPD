import ConsentFormView from '@/views/reception/consent-form/page';

export const metadata = {
  title: 'Consent Form Management | MedFlow OPD',
  description: 'Manage medico-legal procedure consents with multi-language templates and print-friendly previews.',
};

export default function ConsentFormPage() {
  return <ConsentFormView />;
}
