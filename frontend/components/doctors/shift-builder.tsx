import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Clock, Calendar, Eye, EyeOff } from 'lucide-react';

interface Shift {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

interface ShiftBuilderProps {
  shifts: Shift[];
  onChange: (shifts: Shift[]) => void;
}

export default function ShiftBuilder({ shifts, onChange }: ShiftBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);

  const daysMap = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const addShift = () => {
    onChange([
      ...shifts,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 15 },
    ]);
  };

  const removeShift = (index: number) => {
    const newShifts = [...shifts];
    newShifts.splice(index, 1);
    onChange(newShifts);
  };

  const updateShift = (index: number, field: keyof Shift, value: any) => {
    const newShifts = [...shifts];
    newShifts[index] = { ...newShifts[index], [field]: value };
    onChange(newShifts);
  };

  const preview = useMemo(() => {
    if (!showPreview) return null;
    
    const result: Record<number, { time: string, minutes: number }[]> = {};
    daysMap.forEach(day => result[day.value] = []);

    shifts.forEach(shift => {
      if (!shift.startTime || !shift.endTime || !shift.slotDuration) return;

      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      
      if (isNaN(startHour) || isNaN(endHour) || shift.slotDuration <= 0) return;

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      let currentMinutes = startMinutes;
      while (currentMinutes + shift.slotDuration <= endMinutes) {
        const ampm = Math.floor(currentMinutes / 60) >= 12 ? 'PM' : 'AM';
        const displayH = Math.floor(currentMinutes / 60) % 12 || 12;
        const m = (currentMinutes % 60).toString().padStart(2, '0');
        const displayTime = `${displayH.toString().padStart(2, '0')}:${m} ${ampm}`;

        result[shift.dayOfWeek].push({ time: displayTime, minutes: currentMinutes });
        currentMinutes += shift.slotDuration;
      }
    });

    Object.keys(result).forEach(key => {
      const numKey = parseInt(key);
      result[numKey].sort((a, b) => a.minutes - b.minutes);
      // Remove duplicates if overlapping shifts exist
      result[numKey] = result[numKey].filter((slot, index, self) =>
        index === self.findIndex((s) => s.minutes === slot.minutes)
      );
    });

    return result;
  }, [shifts, showPreview]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Shift Management
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border ${
              showPreview 
                ? 'bg-slate-800 text-white border-slate-900 hover:bg-slate-900' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showPreview ? 'Hide Preview' : 'Preview Slots'}
          </button>
          <button
            type="button"
            onClick={addShift}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Plus className="w-3 h-3" /> Add Shift
          </button>
        </div>
      </div>

      {shifts.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">No Shifts Configured</p>
          <p className="text-[10px] text-slate-400">Add a shift to define doctor availability.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shifts.map((shift, index) => (
            <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <select
                value={shift.dayOfWeek}
                onChange={(e) => updateShift(index, 'dayOfWeek', parseInt(e.target.value))}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs font-bold min-w-[120px]"
              >
                {daysMap.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>

              <input
                type="time"
                value={shift.startTime}
                onChange={(e) => updateShift(index, 'startTime', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs font-bold flex-1 min-w-[100px]"
              />

              <span className="text-xs font-bold text-slate-400">to</span>

              <input
                type="time"
                value={shift.endTime}
                onChange={(e) => updateShift(index, 'endTime', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs font-bold flex-1 min-w-[100px]"
              />

              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <input
                  type="number"
                  value={shift.slotDuration}
                  onChange={(e) => updateShift(index, 'slotDuration', parseInt(e.target.value))}
                  placeholder="Mins"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs font-bold w-full"
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mins</span>
              </div>

              <button
                type="button"
                onClick={() => removeShift(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Remove Shift"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showPreview && preview && (
        <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Generated Slots Preview</h4>
          </div>
          <div className="space-y-4">
            {daysMap.map(day => {
              const daySlots = preview[day.value];
              if (!daySlots || daySlots.length === 0) return null;

              return (
                <div key={day.value} className="space-y-2">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{day.label}</h5>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
                        {slot.time}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {Object.values(preview).every(slots => slots.length === 0) && (
              <p className="text-[10px] text-slate-400 italic">No valid slots generated. Check your shift times and durations.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
