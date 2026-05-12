import MedicalDispensingView from "@/views/medical/dispensing/page";

export const metadata = {
  title: 'Drug Dispensing | MedFlow Pharmacy',
  description: 'Dispense prescribed drugs, track stock deduction, and process drug returns.',
};

export default function DispensingPage() {
  return <MedicalDispensingView />;
}
