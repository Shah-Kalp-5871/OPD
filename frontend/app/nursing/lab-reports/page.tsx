import { Suspense } from 'react';
import LabReportManagementView from "@/views/nursing/lab-reports/page";

export const metadata = {
  title: 'Lab Report Management | MedFlow Nursing',
  description: 'Upload lab reports and enter investigation results for patient cases.',
};

export default function LabReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LabReportManagementView />
    </Suspense>
  );
}
