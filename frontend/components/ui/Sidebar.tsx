'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, UserCircle, Activity, ChevronRight, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { roleNavigation } from '@/config/navigation';

interface SidebarProps {
  role: 'doctor' | 'admin' | 'reception' | 'nursing' | 'medical';
}

const roleThemes = {
  admin: {
    accent: 'indigo',
    activeText: 'text-indigo-600',
    activeBg: 'bg-indigo-50',
    activeBorder: 'border-indigo-600',
    iconBg: 'bg-indigo-600',
    iconText: 'text-white',
    lightIconBg: 'bg-indigo-50',
    lightIconText: 'text-indigo-600'
  },
  // Add others if Sidebar is ever used for other roles
};

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const theme = roleThemes[role as keyof typeof roleThemes] || roleThemes.admin;
  const navConfig = roleNavigation[role] || { directItems: [], groups: [] };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
    toast.success('Logged out successfully');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
      {/* BRANDING */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-3 group">
          <div className={`w-8 h-8 ${theme.iconBg} ${theme.iconText} rounded-lg flex items-center justify-center shadow-[2px_2px_0px_rgba(99,102,241,0.25)] transition-transform group-hover:scale-105`}>
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black tracking-[0.15em] text-slate-900 leading-none">MEDFLOW</span>
            <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{role} PANEL</span>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
        {/* Direct Items */}
        {navConfig.directItems && navConfig.directItems.length > 0 && (
          <div className="space-y-1">
            {navConfig.directItems.map((item: any) => {
              const cleanPathname = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname || '';
              const cleanHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
              const isActive = cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${isActive ? `${theme.activeBg} ${theme.activeText}` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? theme.activeText : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{item.title}</span>
                  {isActive && <ChevronRight className={`w-3 h-3 ml-auto ${theme.activeText}`} />}
                </Link>
              );
            })}
          </div>
        )}

        {/* Groups */}
        {navConfig.groups && navConfig.groups.map((group: any, idx: number) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {group.title}
            </p>
            {group.items.map((item: any) => {
              const cleanPathname = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname || '';
              const cleanHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
              const isActive = cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref);
              const Icon = item.icon;

              if (item.subItems) {
                const isExpanded = expandedMenus[item.title] !== undefined ? expandedMenus[item.title] : isActive;
                return (
                  <div key={item.title} className="space-y-1">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); toggleMenu(item.title); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group ${isActive ? `${theme.activeBg} ${theme.activeText}` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? theme.activeText : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="text-[11px] font-bold tracking-wider">{item.title}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${isActive ? theme.activeText : 'text-slate-400'}`} />
                    </button>
                    {isExpanded && (
                      <div className="pl-9 pr-3 space-y-1 mt-1">
                        {item.subItems.map((sub: any) => {
                          const subCleanHref = sub.href.endsWith('/') ? sub.href.slice(0, -1) : sub.href;
                          const isSubActive = cleanPathname === subCleanHref || cleanPathname.startsWith(subCleanHref);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isSubActive ? `${theme.activeText} bg-slate-50 font-bold` : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'} text-[10px] tracking-wide`}
                            >
                              {sub.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${isActive ? `${theme.activeBg} ${theme.activeText}` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? theme.activeText : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="text-[11px] font-bold tracking-wider">{item.title}</span>
                  {isActive && <ChevronRight className={`w-3 h-3 ml-auto ${theme.activeText}`} />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* USER PROFILE & LOGOUT */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${theme.lightIconBg} ${theme.lightIconText} flex items-center justify-center font-black uppercase tracking-wider text-sm border border-${theme.accent}-100 shrink-0`}>
            {user?.name ? user.name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase() : 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-slate-500 truncate">{user?.email || 'admin@clinic.com'}</p>
          </div>
        </div>
        <div className="space-y-1">
          <Link
            href={`/${role}/settings`}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors w-full"
          >
            <UserCircle className="w-4 h-4" />
            Account Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </div>

      {/* MOBILE TOPBAR (Only visible on small screens when Sidebar is used) */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${theme.iconBg} ${theme.iconText} rounded-lg flex items-center justify-center`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-black tracking-[0.15em] text-slate-900">MEDFLOW</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] h-full bg-white flex flex-col shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
