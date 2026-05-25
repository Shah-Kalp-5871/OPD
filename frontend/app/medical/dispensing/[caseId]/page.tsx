import MedicalHubView from "@/views/medical/dispensing/[caseId]/page";

export const metadata = {
  title: 'Pharmacy POS & Dispensing | MedFlow',
  description: 'Process payments and dispense prescribed drugs at the pharmacy counter.',
};

export default function MedicalHubPage() {
  return <MedicalHubView />;
}
