import SettingsView from '@/views/admin/reports/page'; // WAIT - I just noticed a mistake in my thought. I should import from '@/views/admin/settings/page'
// Actually I just wrote to '@/views/admin/settings/page.tsx' so I should import that.

import SettingsModule from '@/views/admin/settings/page';

export const metadata = {
  title: 'System Settings | MedFlow Admin',
  description: 'Global clinic configuration, prescription templates, security device controls, and integration settings.',
};

export default function SettingsPage() {
  return <SettingsModule />;
}
