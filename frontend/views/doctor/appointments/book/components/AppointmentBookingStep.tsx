'use client';

import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Sunrise,
  Sun,
  Sunset,
  ArrowLeft,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  startOfMonth,
  endOfMonth,
  getDay,
} from 'date-fns';

interface AppointmentBookingStepProps {
  selectedPatient: any;
  doctors: any[];
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  availableSlots: any[];
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  remarks: string;
  setRemarks: (remarks: string) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  handleBook: () => void;
  onPrevStep: () => void;
}

// Helper: slot pill style
const slotClass = (slot: any, selectedSlot: string | null) => {
  if (slot.status === 'booked')
    return 'bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed line-through';
  if (selectedSlot === slot.time)
    return 'bg-[#0d6282] border border-[#0d6282] text-white shadow-sm';
  return 'bg-white border border-slate-200 text-slate-600 hover:border-sky-400 hover:text-[#0d6282] hover:bg-sky-50/30';
};

const SlotGroup = ({
  label,
  icon,
  slots,
  selectedSlot,
  onSelect,
  isSubmitting,
}: {
  label: string;
  icon: React.ReactNode;
  slots: any[];
  selectedSlot: string | null;
  onSelect: (t: string) => void;
  isSubmitting: boolean;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[8px] font-bold text-slate-300 ml-auto">{slots.length} slots</span>
    </div>
    {slots.length === 0 ? (
      <p className="text-[10px] text-slate-300 italic pl-1">None available</p>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {slots.map((slot, i) => (
          <button
            key={i}
            disabled={slot.status === 'booked' || isSubmitting}
            onClick={() => onSelect(slot.time)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-150 ${slotClass(slot, selectedSlot)}`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    )}
  </div>
);

export const AppointmentBookingStep: React.FC<AppointmentBookingStepProps> = ({
  selectedPatient,
  doctors,
  selectedDoctorId,
  setSelectedDoctorId,
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  availableSlots,
  selectedSlot,
  setSelectedSlot,
  purpose,
  setPurpose,
  remarks,
  setRemarks,
  isSubmitting,
  isLoading,
  handleBook,
  onPrevStep,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentMonth) });

  // Weekday offset so calendar grid aligns correctly (Mon = 0)
  const startOffset = (getDay(monthStart) + 6) % 7;

  const morningSlots   = availableSlots.filter(s => parseInt(s.time, 10) < 12);
  const afternoonSlots = availableSlots.filter(s => { const h = parseInt(s.time, 10); return h >= 12 && h < 16; });
  const eveningSlots   = availableSlots.filter(s => parseInt(s.time, 10) >= 16);

  const canBook = !!selectedSlot && !!selectedPatient && !isSubmitting;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* ─── PATIENT CONTEXT STRIP ─── */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 border-b-slate-100 rounded-t-3xl">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
            <User className="w-4 h-4 text-[#0d6282]" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
              {selectedPatient?.firstName} {selectedPatient?.lastName}
            </p>
            <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
              {selectedPatient?.mrdNumber} &nbsp;·&nbsp; {selectedPatient?.gender} &nbsp;·&nbsp; {selectedPatient?.mobile}
            </p>
          </div>
        </div>
        <button
          onClick={onPrevStep}
          className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0d6282] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Change Patient
        </button>
      </div>

      {/* ─── MAIN 3-COLUMN CARD ─── */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl overflow-hidden shadow-sm">

        {/* === COLUMN LAYOUT === */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

          {/* ── LEFT: Doctor, Purpose, Remarks ── */}
          <div className="p-5 space-y-4">

            {/* Section label */}
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Clinical Details</h3>
            </div>



            {/* Purpose */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose of Visit *</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:border-[#107ca3] focus:bg-white transition-all placeholder:text-slate-300"
                placeholder="e.g. Follow-up, Chest Pain…"
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Remarks</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:border-[#107ca3] focus:bg-white transition-all resize-none placeholder:text-slate-300"
                placeholder="Any special notes for the doctor…"
              />
            </div>

            {/* Booking summary chip */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <CalendarIcon className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="text-[11px] font-bold text-slate-500">{format(selectedDate, 'dd MMM yyyy')}</span>
              <div className="w-px h-3 bg-slate-200" />
              <Clock className="w-4 h-4 text-slate-300 shrink-0" />
              <span className={`text-[11px] font-black ${selectedSlot ? 'text-[#0d6282]' : 'text-slate-300'}`}>
                {selectedSlot || 'No slot selected'}
              </span>
            </div>
          </div>

          {/* ── CENTER DIVIDER (visible on lg) ── */}
          <div className="hidden lg:block w-px" />

          {/* ── RIGHT: Calendar + Slots ── */}
          <div className="p-5 space-y-4">

            {/* Section label + month nav */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[9px] font-black text-slate-300 py-1 uppercase">{d}</div>
              ))}

              {/* Empty offset cells */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}

              {daysInMonth.map((day, idx) => {
                const isPast = isBefore(day, startOfDay(new Date()));
                const isSelected = isSameDay(selectedDate, day);
                const isTd = isToday(day);
                return (
                  <button
                    key={idx}
                    disabled={isPast}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all
                      ${isPast ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-sky-50 hover:text-[#0d6282]'}
                      ${isSelected ? 'bg-slate-900 text-white shadow-sm font-black scale-105' : ''}
                      ${isTd && !isSelected ? 'text-[#0d6282] font-black ring-1 ring-sky-200' : ''}
                      ${!isPast && !isSelected && !isTd ? 'text-slate-600' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Available Slots
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#0d6282]">
                  {availableSlots.length} total
                </span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#107ca3]/20 border-t-[#107ca3] rounded-full animate-spin" />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No slots on this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <SlotGroup
                    label="Morning"
                    icon={<Sunrise className="w-3.5 h-3.5 text-amber-400" />}
                    slots={morningSlots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                    isSubmitting={isSubmitting}
                  />
                  <SlotGroup
                    label="Afternoon"
                    icon={<Sun className="w-3.5 h-3.5 text-sky-400" />}
                    slots={afternoonSlots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                    isSubmitting={isSubmitting}
                  />
                  <SlotGroup
                    label="Evening"
                    icon={<Sunset className="w-3.5 h-3.5 text-indigo-400" />}
                    slots={eveningSlots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── CONFIRM FOOTER ─── */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">

          <p className="text-[9px] font-medium text-slate-400 flex items-center gap-1.5 shrink-0">
            <Info className="w-3 h-3 text-slate-300" />
            SMS confirmation sent on booking
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onPrevStep}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 hover:text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={!canBook}
              className="flex items-center gap-2.5 px-7 py-2.5 rounded-xl bg-[#0d6282] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0a4b63] transition-all shadow-sm shadow-sky-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CalendarCheck className="w-4 h-4" />
              )}
              {isSubmitting ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
