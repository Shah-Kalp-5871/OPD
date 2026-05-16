'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FlaskConical, 
  TestTube2, 
  History, 
  Settings,
  Bell,
  LogOut,
  User,
  Search,
  Beaker
} from 'lucide-react';

interface LaboratoryLayoutProps {
  children: React.ReactNode;
}

const LaboratoryLayout: React.FC<LaboratoryLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/laboratory/dashboard', icon: LayoutDashboard },
    { name: 'Pending Tests', href: '/laboratory/pending', icon: TestTube2 },
    { name: 'Test Catalog', href: '/laboratory/catalog', icon: FlaskConical },
    { name: 'Results History', href: '/laboratory/history', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Beaker className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">MedFlow</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Laboratory Module</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center font-black text-slate-900 shadow-sm">
              LT
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-900">Lab Technician</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Wing</p>
            </div>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by test ID, patient name, or parameter..."
              className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 ml-10">
            <button className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center relative hover:bg-slate-100 transition-all">
              <Bell className="w-6 h-6 text-slate-600" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white hover:shadow-xl hover:shadow-slate-200 transition-all">
              <User className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scrollbar-stable">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LaboratoryLayout;
