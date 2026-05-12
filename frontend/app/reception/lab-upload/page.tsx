import LabUploadView from '@/views/reception/lab-upload/page';

export const metadata = {
  title: 'Lab Report Upload | MedFlow OPD',
  description: 'Upload scanned lab reports, enter key parameters, and link investigations to OPD cases.',
};

export default function LabUploadPage() {
  return <LabUploadView />;
}
