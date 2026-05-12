import StockManagementView from "@/views/medical/stock-management/page";

export const metadata = {
  title: 'Stock Management | MedFlow Pharmacy',
  description: 'Monitor current inventory, track low stock, and manage drug restocks.',
};

export default function StockManagementPage() {
  return <StockManagementView />;
}
