import { useState } from 'react';
import api from '../../utils/api';
import { getNextDays, generateTimeSlots, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

const TIME_SLOTS = generateTimeSlots(8, 20, 30);

const DoctorSlots = () => {
  const [selectedDate, setSelectedDate]   = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [saving, setSaving]               = useState(false);

  const days = getNextDays(14);

  const toggleSlot = (slot) => {
    setSelectedTimes((prev) =>
      prev.find((s) => s.startTime === slot.startTime)
        ? prev.filter((s) => s.startTime !== slot.startTime)
        : [...prev, slot]
    );
  };

  const handleSave = async () => {
    if (!selectedDate)          { toast.error('Select a date');       return; }
    if (selectedTimes.length === 0) { toast.error('Select at least one time slot'); return; }

    const slots = selectedTimes.map((s) => ({
      date:      selectedDate,
      startTime: s.startTime,
      endTime:   s.endTime,
    }));

    setSaving(true);
    try {
      await api.put('/doctor/me/slots', { slots });
      toast.success(`${slots.length} slot(s) saved for ${formatDate(selectedDate)}`);
      setSelectedTimes([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save slots');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Manage Slots</h1>
        <p className="page-subtitle">Set your availability for appointments</p>
      </div>

      {/* Date selection */}
      <div className="card mb-6">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Select Date</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day) => {
            const d = new Date(day);
            return (
              <button
                key={day}
                onClick={() => { setSelectedDate(day); setSelectedTimes([]); }}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all ${
                  selectedDate === day
                    ? 'bg-primary border-primary text-white shadow-md shadow-teal-500/20'
                    : 'border-slate-200 text-muted hover:border-primary/40 hover:text-dark bg-white'
                }`}
              >
                <span className="text-xs font-medium uppercase">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                <span className="text-xl font-bold mt-0.5">{d.getDate()}</span>
                <span className="text-xs opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slot grid */}
      {selectedDate && (
        <div className="card mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Time Slots · {formatDate(selectedDate)}
            </h3>
            <span className="text-xs font-medium text-primary bg-teal-50 px-2 py-1 rounded-md">{selectedTimes.length} selected</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTimes.find((s) => s.startTime === slot.startTime);
              return (
                <button
                  key={slot.startTime}
                  onClick={() => toggleSlot(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-primary text-primary shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-dark hover:bg-slate-50 bg-white'
                  }`}
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => setSelectedTimes(TIME_SLOTS)}
              className="text-sm font-medium text-primary hover:text-teal-700 transition-colors"
            >
              Select all
            </button>
            <button
              onClick={() => setSelectedTimes([])}
              className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedTimes.length === 0}
              className="btn-primary ml-auto py-2.5 px-6 text-sm"
            >
              {saving ? 'Saving…' : `Save ${selectedTimes.length} Slot(s)`}
            </button>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 flex items-start gap-3">
        <span className="text-xl"></span>
        <p className="text-sm text-slate-600 mt-0.5">
          <span className="text-primary font-medium">Tip:</span> Select a date, choose available time slots, and click Save. Slots already booked by patients will remain protected.
        </p>
      </div>
    </div>
  );
};

export default DoctorSlots;
