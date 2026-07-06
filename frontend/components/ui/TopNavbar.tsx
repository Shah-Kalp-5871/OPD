'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LogOut, UserCircle, Menu, X, Activity, Maximize, Minimize } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { roleNavigation, NavGroup } from '@/config/navigation';

interface TopNavbarProps {
  role: 'doctor' | 'admin' | 'reception' | 'nursing' | 'medical';
}

// Brutalist / Industrial Role Themes
const roleThemes = {
  doctor: {
    accent: '[#036d92]',
    activeText: 'text-[#036d92]',
    activeBorder: 'border-[#036d92]',
    iconBg: 'bg-[#036d92]',
    iconText: 'text-white',
    lightIconBg: 'bg-[#036d92]/10',
    lightIconText: 'text-[#036d92]'
  },
  admin: {
    accent: 'indigo',
    activeText: 'text-indigo-600',
    activeBorder: 'border-indigo-600',
    iconBg: 'bg-indigo-600',
    iconText: 'text-white',
    lightIconBg: 'bg-indigo-50',
    lightIconText: 'text-indigo-600'
  },
  reception: {
    accent: 'orange',
    activeText: 'text-orange-500',
    activeBorder: 'border-orange-500',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    iconText: 'text-white',
    lightIconBg: 'bg-orange-50',
    lightIconText: 'text-orange-600'
  },
  nursing: {
    accent: 'green',
    activeText: 'text-green-600',
    activeBorder: 'border-green-600',
    iconBg: 'bg-green-600',
    iconText: 'text-white',
    lightIconBg: 'bg-green-50',
    lightIconText: 'text-green-600'
  },
  medical: {
    accent: 'emerald',
    activeText: 'text-emerald-600',
    activeBorder: 'border-emerald-600',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    lightIconBg: 'bg-emerald-50',
    lightIconText: 'text-emerald-600'
  }
};

const TopNavbar = ({ role }: TopNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const theme = roleThemes[role] || roleThemes.reception;
  const navConfig = roleNavigation[role] || { directItems: [], groups: [] };

  // Flatten navigation for desktop (ignoring groups if present)
  const flattenedNav: { label: string; href: string; icon: any }[] = [];
  
  if (navConfig.directItems) {
    navConfig.directItems.forEach((item: any) => {
      flattenedNav.push({ label: item.title, href: item.href, icon: item.icon });
    });
  }

  if (navConfig.groups) {
    navConfig.groups.forEach((group: any) => {
      group.items.forEach((item: any) => {
        flattenedNav.push({ label: item.title, href: item.href, icon: item.icon });
      });
    });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Fullscreen toggle logic
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
    toast.success('Logged out successfully');
  };

  const isReception = role === 'reception';

  return (
    <header className={`sticky top-0 z-50 bg-white ${isReception ? 'shadow-[0_2px_12px_rgba(249,115,22,0.10)] border-b border-orange-100' : 'border-b border-slate-200'}`}>
      <div className="flex h-16 items-center justify-between px-6 w-full max-w-[1920px] mx-auto">
        
        {/* LEFT: BRANDING */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-3 group">
            <div className={`w-8 h-8 ${theme.iconBg} ${theme.iconText} rounded-lg flex items-center justify-center shadow-[2px_2px_0px_rgba(249,115,22,0.25)] transition-transform group-hover:scale-105`}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-[0.15em] leading-none text-slate-900">
                MEDFLOW
              </span>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme.activeText} leading-none mt-0.5`}>
                {role}
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex flex-1 items-center justify-start xl:justify-center gap-1 px-8">
          {flattenedNav.slice(0, 6).map((item) => {
            const cleanPathname = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname || '';
            const cleanHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
            const isDashboard = cleanHref === `/${role}/dashboard` || cleanHref === `/${role}`;
            const isActive = cleanPathname === cleanHref || (!isDashboard && cleanPathname.startsWith(cleanHref));
            
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-2.5 px-3 xl:px-4 h-16 border-b-2 transition-colors shrink-0
                  ${isActive 
                    ? `${theme.activeBorder} ${theme.activeText} ${theme.lightIconBg}` 
                    : `border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300`
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? theme.activeText : 'text-slate-400 group-hover:text-slate-700'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}

          {flattenedNav.length > 6 && (
            <div className="relative group h-16 flex items-center shrink-0">
              <button className="flex items-center gap-1.5 px-3 xl:px-4 h-16 border-b-2 border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest">More</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
              </button>
              
              <div className="absolute top-full right-0 mt-0 w-64 bg-white border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                {flattenedNav.slice(6).map((item) => {
                  const cleanPathname = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname || '';
                  const cleanHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
                  const isDashboard = cleanHref === `/${role}/dashboard` || cleanHref === `/${role}`;
                  const isActive = cleanPathname === cleanHref || (!isDashboard && cleanPathname.startsWith(cleanHref));
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors
                        ${isActive ? `${theme.activeText} ${theme.lightIconBg}` : 'text-slate-600'}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? theme.activeText : 'text-slate-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center justify-end gap-2 lg:gap-4 shrink-0">
          
          {/* FULLSCREEN TOGGLE */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all"
            >
              <div className={`w-8 h-8 rounded-lg ${theme.lightIconBg} ${theme.lightIconText} flex items-center justify-center font-black uppercase tracking-wider text-xs border border-${theme.accent}-100`}>
                {user?.name ? user.name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase() : 'KA'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-black text-slate-900 leading-none">{user?.name || 'Kalp'}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1">{user?.email || 'reception@clinic.com'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl origin-top-right z-50 rounded-xl overflow-hidden">
                <div className={`px-4 py-3 border-b border-slate-100 ${theme.lightIconBg}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Signed in as</p>
                  <p className={`text-xs font-bold ${theme.activeText} mt-0.5 truncate`}>{user?.email || 'reception@clinic.com'}</p>
                </div>
                <div className="p-1">
                  <Link
                    href={`/${role}/settings`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    Account Settings
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-4 space-y-2">
          {flattenedNav.map((item) => {
            const cleanPathname = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname || '';
            const cleanHref = item.href.endsWith('/') ? item.href.slice(0, -1) : item.href;
            const isDashboard = cleanHref === `/${role}/dashboard` || cleanHref === `/${role}`;
            const isActive = cleanPathname === cleanHref || (!isDashboard && cleanPathname.startsWith(cleanHref));

            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive 
                    ? `${theme.iconBg} text-white` 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
