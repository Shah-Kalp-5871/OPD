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
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Patient Mgmt', icon: Users, href: '/admin/patients' },
  { label: 'Appointment Mgmt', icon: Calendar, href: '/admin/appointments' },
  { label: 'Doctor Mgmt', icon: UserRound, href: '/admin/doctors' },
  { label: 'Staff Mgmt', icon: BriefcaseMedical, href: '/admin/staff' },
  { label: 'Billing', icon: ReceiptIndianRupee, href: '/admin/billing' },
  { label: 'Drug Master', icon: Pill, href: '/admin/drugs' },
  { label: 'Lab Master', icon: FlaskConical, href: '/admin/lab' },
  { label: 'Procedure Master', icon: Stethoscope, href: '/admin/procedures' },
  { label: 'Discounts', icon: Percent, href: '/admin/discounts' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
  { label: 'Support', icon: LifeBuoy, href: '/admin/support' },
  { label: 'My Profile', icon: UserCircle, href: '/admin/profile' },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
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
            const isActive = pathname === item.href;
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
