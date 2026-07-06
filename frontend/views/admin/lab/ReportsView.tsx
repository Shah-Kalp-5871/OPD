
'use client';
import AdminLayout from '@/views/layouts/AdminLayout';

export default function ReportsView() {
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="mb-4 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Static Placeholder
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Lab Reports Management</h1>
                <p className="text-sm text-slate-500 max-w-md">
                    This page is a placeholder for future lab report management features. 
                    It is currently static as requested.
                </p>
            </div>
        </AdminLayout>
    );
}
