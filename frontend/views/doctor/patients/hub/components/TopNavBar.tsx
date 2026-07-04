import React, { useEffect, useState } from 'react';
import { FolderOpen, History, FileText, CreditCard, FileSignature, User, Activity } from 'lucide-react';

interface TopNavBarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ activeSection, setActiveSection }) => {
  const sections = [
    // Global Sections
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'cases', label: 'Clinical History', icon: History },
    { id: 'documents', label: 'Reports & Files', icon: FileText },
    // Case-Specific Sections
    { id: 'clinical_data', label: 'Complaints & Vitals', icon: Activity },
    { id: 'consent', label: 'Consent Forms', icon: FileSignature },
    { id: 'billing', label: 'Billing Records', icon: CreditCard },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset for sticky headers
      
      let currentActive = activeSection;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const absoluteTop = el.getBoundingClientRect().top + window.pageYOffset;
          if (absoluteTop <= scrollPosition) {
            currentActive = section.id;
          }
        }
      }
      
      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, setActiveSection, sections]);

  return (
    <div className="flex justify-center py-4">
      <div className="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm gap-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(section.id);
                if (el) {
                  const yOffset = -140;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
                setActiveSection(section.id);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-[0_4px_12px_rgba(13,98,130,0.35)]'
                  : 'text-slate-500 hover:text-[#0d6282] hover:bg-sky-50'
              }`}
            >
              <section.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopNavBar;
