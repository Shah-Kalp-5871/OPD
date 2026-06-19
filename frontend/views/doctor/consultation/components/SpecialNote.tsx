import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';
import { Badge } from './ClinicalDesignSystem';

export interface NoteItem {
  id: string;
  type: 'drug' | 'appointment' | 'info';
  message: string;
  timestamp: Date;
  isResolved?: boolean;
}

interface SpecialNoteProps {
  notes?: NoteItem[];
}

const SpecialNote: React.FC<SpecialNoteProps> = ({ notes = [] }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!notes || notes.length === 0 || !isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 w-full relative z-40 shadow-inner">
      <div className="flex px-8 py-3 items-start justify-between max-w-[1600px] mx-auto">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-amber-100 p-2 rounded-xl border border-amber-200 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
              Special Notes & Alerts
              <Badge variant="amber" className="text-[9px] px-1.5 py-0 bg-white shadow-sm border-amber-200">
                {notes.filter(n => !n.isResolved).length} Active
              </Badge>
            </h4>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className={`flex items-center gap-2 text-sm font-bold ${note.isResolved ? 'text-amber-600/50 line-through' : 'text-amber-800'}`}>
                  {note.type === 'drug' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                  {note.type === 'appointment' && <Clock className="w-4 h-4 text-amber-500" />}
                  {note.type === 'info' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                  {note.message}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-500 hover:text-amber-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SpecialNote;
