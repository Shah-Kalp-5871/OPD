import SecurityCommandCenterView from '@/views/admin/security-command-center/page';

export const metadata = {
  title: "Zero-Trust Security & SOC Command Center | MedFlow Admin",
  description: "Enterprise multi-tenant cyber-resilience monitoring, SIEM event logs, encrypted key vaults, disaster recovery drills, and incident playbooks.",
};

export default function SecurityCommandCenterPage() {
  return <SecurityCommandCenterView />;
}
