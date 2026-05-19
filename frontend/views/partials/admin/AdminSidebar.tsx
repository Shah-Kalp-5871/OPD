'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserRound, 
  BriefcaseMedical, 
  ReceiptIndianRupee, 
  Pill, 
  FlaskConical, 
  Stethoscope, 
  Percent, 
  Bell, 
  BarChart3, 
  Settings, 
  LifeBuoy, 
  UserCircle,
  LogOut,
  BrainCircuit,
  Building2,
  HardHat,
  BadgeDollarSign,
  PackageSearch,
  TestTube2,
  Cpu,
  Code2,
  Presentation,
  LineChart,
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { ROUTES, buildAppUrl } from '@/constants/routes';
import { toast } from 'sonner';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD },
  { label: 'Patient Mgmt', icon: Users, href: ROUTES.ADMIN_PATIENTS },
  { label: 'Appointment Mgmt', icon: Calendar, href: ROUTES.ADMIN_APPOINTMENTS },
  { label: 'Doctor Mgmt', icon: UserRound, href: ROUTES.ADMIN_DOCTORS },
  { label: 'Staff Mgmt', icon: BriefcaseMedical, href: ROUTES.ADMIN_STAFF },
  { label: 'Billing', icon: ReceiptIndianRupee, href: ROUTES.ADMIN_BILLING },
  { label: 'Drug Master', icon: Pill, href: ROUTES.ADMIN_DRUGS },
  { label: 'Lab Master', icon: FlaskConical, href: ROUTES.ADMIN_LAB },
  { label: 'Procedure Master', icon: Stethoscope, href: ROUTES.ADMIN_PROCEDURES },
  { label: 'Discounts', icon: Percent, href: ROUTES.ADMIN_DISCOUNTS },
  { label: 'Notifications', icon: Bell, href: ROUTES.ADMIN_NOTIFICATIONS },
  { label: 'Financial Reports', icon: ReceiptIndianRupee, href: ROUTES.GLOBAL.FINANCIAL_REPORTS },
  { label: 'Inventory Intelligence', icon: BarChart3, href: ROUTES.GLOBAL.INVENTORY_INTELLIGENCE },
  { label: 'Settings', icon: Settings, href: ROUTES.ADMIN_SETTINGS },
  { label: 'Support', icon: LifeBuoy, href: ROUTES.ADMIN_SUPPORT },
  { label: 'My Profile', icon: UserCircle, href: ROUTES.ADMIN_PROFILE },
  { label: 'Enterprise ERP', icon: BrainCircuit, href: ROUTES.GLOBAL.ERP_INTELLIGENCE },
  { label: 'HRMS', icon: Building2, href: ROUTES.GLOBAL.HRMS },
  { label: 'Workforce', icon: HardHat, href: ROUTES.GLOBAL.WORKFORCE },
  { label: 'Payroll', icon: BadgeDollarSign, href: ROUTES.GLOBAL.PAYROLL },
  { label: 'Procurement', icon: PackageSearch, href: ROUTES.GLOBAL.PROCUREMENT },
  { label: 'Pharmacy AI', icon: TestTube2, href: ROUTES.GLOBAL.PHARMACY_INTELLIGENCE },
  { label: 'Biomedical Ops', icon: Cpu, href: ROUTES.GLOBAL.BIOMEDICAL },
  { label: 'Facility Ops', icon: Building2, href: ROUTES.GLOBAL.FACILITY_OPS },
  { label: 'Developer Portal', icon: Code2, href: ROUTES.GLOBAL.DEVELOPER },
  { label: 'Exec Command Center', icon: Presentation, href: ROUTES.GLOBAL.EXECUTIVE },
  { label: 'Analytics Studio', icon: LineChart, href: ROUTES.GLOBAL.ANALYTICS_STUDIO },
  { label: 'BI Observability', icon: Activity, href: ROUTES.GLOBAL.OBSERVABILITY_ANALYTICS },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-50 flex flex-col">
      {/* Sidebar Top: Logo & Title */}
      <div className="p-6 border-bottom border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block font-bold text-slate-800 tracking-tight leading-none text-lg">MedFlow</span>
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-1">ADMIN PANEL</span>
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname === `${item.href}/`;
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
            {user?.name?.substring(0, 2) || 'AD'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@medflow.com'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
