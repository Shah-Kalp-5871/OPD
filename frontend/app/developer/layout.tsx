import { DeveloperShell } from '@/components/developer/DeveloperShell';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <DeveloperShell>{children}</DeveloperShell>;
}
