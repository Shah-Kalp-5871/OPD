'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import Link from 'next/link';
import { 
  ClipboardList, 
  FlaskConical, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  CheckCircle2, 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2,
  ZoomIn,
  Crop,
  RotateCw,
  Trash2,
  Edit3,
  Columns,
  FolderOpen,
  Calendar,
  Info,
  Save,
  CheckCircle,
  LayoutGrid,
  History
} from 'lucide-react';

const ImagesView = () => {
  const [selectedFolder, setSelectedFolder] = useState('Hair Removal – Diode');
  const [compareMode, setCompareMode] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50);

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, completed: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, completed: true, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, completed: true, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, active: true, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const folders = [
    { name: 'Hair Removal – Diode', sessions: 4, images: 8 },
    { name: 'Chemical Peel', sessions: 3, images: 6 },
    { name: 'PRP Therapy', sessions: 2, images: 4 },
  ];

  const galleryImages = [
    { date: '25/03/2026', type: 'Before', status: 'Verified' },
    { date: '25/03/2026', type: 'After', status: 'Verified' },
    { date: '13/04/2026', type: 'Before', status: 'Verified' },
    { date: '(Pending)', type: 'After', status: 'Awaiting' },
  ];

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🔷 TOP CONSULTATION WORKFLOW TABS */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex overflow-x-auto scrollbar-hide gap-1">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href || '#'}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                 : tab.completed 
                 ? 'text-emerald-600 bg-emerald-50' 
                 : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
               }`}
             >
                <div className="relative">
                  <tab.icon className={`w-4 h-4 ${tab.active ? 'text-blue-400' : tab.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                  {tab.completed && <CheckCircle2 className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white rounded-full text-emerald-600" />}
                </div>
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* 🔷 LEFT: PROCEDURE IMAGE FOLDERS */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-5 bg-slate-900 flex items-center gap-3">
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Procedure Folders</h3>
                 </div>
                 <div className="p-4 space-y-3">
                    {folders.map((folder) => (
                       <button 
                         key={folder.name}
                         onClick={() => setSelectedFolder(folder.name)}
                         className={`w-full text-left p-5 rounded-2xl border transition-all ${
                           selectedFolder === folder.name 
                           ? 'bg-blue-50 border-blue-100 shadow-sm' 
                           : 'bg-white border-slate-100 hover:border-slate-300'
                         }`}
                       >
                          <h4 className={`text-[11px] font-black uppercase tracking-widest ${selectedFolder === folder.name ? 'text-blue-600' : 'text-slate-800'}`}>
                             {folder.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>{folder.sessions} sessions</span>
                             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                             <span>{folder.images} images</span>
                          </div>
                       </button>
                    ))}
                    <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:text-blue-400 transition-all">
                       <Plus className="w-4 h-4" />
                       Create Folder
                    </button>
                 </div>
              </div>
           </div>

           {/* 🔷 RIGHT: IMAGE GRID & CONTROLS */}
           <div className="lg:col-span-9 space-y-8">
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400 shadow-lg">
                          <History className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">{selectedFolder}</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Session Progression Gallery</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add Image
                       </button>
                       <button 
                         onClick={() => setCompareMode(!compareMode)}
                         className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                           compareMode 
                           ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                           : 'bg-slate-900 text-white hover:bg-black'
                         }`}
                       >
                          <Columns className="w-4 h-4" />
                          Compare
                       </button>
                    </div>
                 </div>

                 <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {galleryImages.map((img, idx) => (
                       <div key={idx} className="group relative">
                          <div className="aspect-[4/5] bg-slate-100 rounded-2xl border-2 border-slate-50 overflow-hidden relative flex items-center justify-center transition-all group-hover:border-blue-200 group-hover:shadow-lg">
                             <div className="flex flex-col items-center gap-2 text-slate-300">
                                <ImageIcon className="w-10 h-10" />
                                <span className="text-[9px] font-black uppercase tracking-widest">[ IMAGE ]</span>
                             </div>
                             
                             <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-600">
                                {img.type}
                             </div>
                             
                             <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="p-3 bg-white rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                                   <Maximize2 className="w-4 h-4 text-slate-900" />
                                </button>
                             </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between px-1">
                             <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-slate-300" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{img.date}</span>
                             </div>
                             {img.status === 'Verified' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                       Auto date+time stamp on each uploaded image. Admin can edit stamp.
                    </p>
                 </div>
              </div>

              {/* 🔷 IMAGE TOOLBAR */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mr-4">Image Tools</h4>
                    <div className="flex items-center bg-slate-800 p-1.5 rounded-xl gap-1">
                       <button className="p-3 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all flex flex-col items-center gap-1">
                          <ZoomIn className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase">Zoom</span>
                       </button>
                       <button className="p-3 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all flex flex-col items-center gap-1">
                          <Crop className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase">Crop</span>
                       </button>
                       <button className="p-3 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all flex flex-col items-center gap-1">
                          <RotateCw className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase">Rotate</span>
                       </button>
                       <button className="p-3 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all flex flex-col items-center gap-1">
                          <Edit3 className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase">Mark</span>
                       </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <button className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center gap-2 px-5">
                       <Trash2 className="w-4 h-4" />
                       <span className="text-[9px] font-black uppercase">Delete</span>
                    </button>
                    <button className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex items-center gap-2 px-5">
                       <Maximize2 className="w-4 h-4" />
                       <span className="text-[9px] font-black uppercase">Full Screen</span>
                    </button>
                 </div>
              </div>

           </div>
        </div>

        {/* 🔷 COMPARE VIEW SECTION */}
        {compareMode && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-8 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                      <Columns className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Compare View Preview</h3>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Before vs. After Analysis</p>
                   </div>
                </div>
                <button onClick={() => setCompareMode(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                   <Plus className="rotate-45 w-6 h-6" />
                </button>
             </div>

             <div className="p-10">
                <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200">
                   
                   {/* BEFORE IMAGE AREA */}
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                         <ImageIcon className="w-20 h-20 text-slate-400" />
                         <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">[ BEFORE IMAGE ]</span>
                      </div>
                      <div className="absolute bottom-10 left-10 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-xl">
                         Baseline: 25/03/2026
                      </div>
                   </div>

                   {/* AFTER IMAGE AREA (Clipped by divider) */}
                   <div 
                     className="absolute inset-0 flex items-center justify-center bg-blue-50 z-10"
                     style={{ clipPath: `inset(0 0 0 ${dividerPosition}%)` }}
                   >
                      <div className="flex flex-col items-center gap-4 opacity-60">
                         <ImageIcon className="w-20 h-20 text-blue-200" />
                         <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">[ AFTER IMAGE ]</span>
                      </div>
                      <div className="absolute bottom-10 right-10 px-6 py-3 bg-blue-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-blue-200">
                         Post-Op: 13/04/2026
                      </div>
                   </div>

                   {/* DRAGGABLE DIVIDER */}
                   <div 
                     className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                     style={{ left: `calc(${dividerPosition}% - 2px)` }}
                   >
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={dividerPosition}
                        onChange={(e) => setDividerPosition(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                      />
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border border-slate-100">
                         <div className="flex gap-1">
                            <ChevronLeft className="w-3 h-3 text-blue-600" />
                            <ChevronRight className="w-3 h-3 text-blue-600" />
                         </div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 whitespace-nowrap uppercase tracking-tighter">
                         ← Drag divider →
                      </div>
                   </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4 max-w-xl mx-auto">
                   <Info className="w-6 h-6 text-blue-500" />
                   <p className="text-[11px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed italic">
                      Compare view with high-precision light divider. Both sides support independent zoom levels during active analysis mode.
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* 🔷 ACTION BUTTONS (STICKY BAR) */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-between gap-4 z-40">
           <Link 
             href="/doctor/consultation/procedure"
             className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <ChevronLeft className="w-4 h-4" />
              Back to Procedure
           </Link>
           
           <div className="flex gap-4">
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Images
              </button>
              <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group">
                 Next → Diagnosis + F/U
                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default ImagesView;
