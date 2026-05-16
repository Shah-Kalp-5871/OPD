import InventoryAnalyticsView from '@/views/admin/reports/InventoryAnalyticsView';

export const metadata = {
  title: "Inventory Intelligence | MedFlow Admin",
  description: "Stock valuation, expiry tracking and supply chain analytics.",
};

export default function InventoryReportsPage() {
  return <InventoryAnalyticsView />;
}
