import React from 'react';
import { Loader2, LayoutGrid } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  rowKey: (item: T) => string;
  rowClassName?: (item: T) => string;
}

export function AdminDataTable<T>({
  columns,
  data,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  emptyIcon = <LayoutGrid className="w-10 h-10 text-slate-200 mx-auto mb-3" />,
  emptyText = 'No records found',
  rowKey,
  rowClassName
}: AdminDataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className={`px-6 py-4 text-${col.align || 'left'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  {emptyIcon}
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{emptyText}</p>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={rowKey(item)} 
                  className={`hover:bg-slate-50/50 transition-colors group ${rowClassName ? rowClassName(item) : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 text-${col.align || 'left'} ${col.className || ''}`}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-white mt-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Page {page} of {totalPages} · {totalItems} total
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(Math.max(1, page - 1))} 
              disabled={page === 1}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider border border-slate-200 rounded-lg disabled:opacity-40 hover:border-indigo-300 transition-colors"
            >
              Prev
            </button>
            <button 
              onClick={() => onPageChange(Math.min(totalPages, page + 1))} 
              disabled={page === totalPages}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider border border-slate-200 rounded-lg disabled:opacity-40 hover:border-indigo-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
