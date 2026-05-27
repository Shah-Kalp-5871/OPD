'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LogOut, UserCircle, Menu, X, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { roleNavigation, NavGroup, NavItem } from '@/config/navigation';

interface TopNavbarProps {
  role: 'doctor' | 'admin' | 'reception' | 'nursing' | 'medical';
}

const DropdownMenu = ({ group, isActive }: { group: NavGroup, isActive: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const hasActiveItem = group.items.some(item => pathname === item.href || pathname === `${item.href}/`);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
          hasActiveItem || isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        {group.title}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          {group.items.map((item) => {
            const isItemActive = pathname === item.href || pathname === `${item.href}/`;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isItemActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isItemActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TopNavbar: React.FC<TopNavbarProps> = ({ role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const navConfig = roleNavigation[role];

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const getProfileLink = () => {
    switch(role) {
      case 'admin': return ROUTES.admin.profile;
      case 'doctor': return ROUTES.doctor.profile;
      case 'reception': return ROUTES.reception.myProfile;
      case 'nursing': return ROUTES.nursing.profile;
      case 'medical': return ROUTES.medical.profile;
      default: return '#';
    }
  };

  if (!navConfig) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tighter leading-none uppercase">MedFlow</h1>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1 block">
              {role} Panel
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-2 px-8">
          {navConfig.directItems.map(item => {
            const isActive = pathname === item.href || pathname === `${item.href}/`;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.title}
              </Link>
            );
          })}
          
          {navConfig.groups.map(group => (
            <DropdownMenu key={group.title} group={group} isActive={false} />
          ))}
        </nav>

        {/* Right Section: Profile & Actions */}
        <div className="hidden lg:flex items-center gap-4 min-w-max">
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
            <Link href={getProfileLink()} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                {user?.name?.substring(0, 2) || role.substring(0, 2)}
              </div>
              <div className="hidden xl:block text-left mr-2">
                <p className="text-[11px] font-bold text-slate-800 leading-none">{user?.name || `${role.charAt(0).toUpperCase() + role.slice(1)}`}</p>
                <p className="text-[9px] font-semibold text-slate-500 truncate mt-0.5 max-w-[120px]">{user?.email || 'user@medflow.com'}</p>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4 space-y-4">
            <div className="space-y-1">
              {navConfig.directItems.map(item => {
                const isActive = pathname === item.href || pathname === `${item.href}/`;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.title}
                  </Link>
                );
              })}
            </div>

            {navConfig.groups.map(group => (
              <div key={group.title} className="space-y-1">
                <h3 className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">{group.title}</h3>
                {group.items.map(item => {
                  const isItemActive = pathname === item.href || pathname === `${item.href}/`;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                        isItemActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isItemActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href={getProfileLink()} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <UserCircle className="w-5 h-5 text-slate-400" />
                My Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
