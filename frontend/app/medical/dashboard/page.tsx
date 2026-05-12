import MedicalDashboardView from "@/views/medical/dashboard/page";

export const metadata = {
  title: 'Medical Dashboard | MedFlow Pharmacy',
  description: 'Pharmacy operations overview, dispensing queue, and stock management dashboard.',
};

export default function MedicalDashboardPage() {
  return <MedicalDashboardView />;
}
