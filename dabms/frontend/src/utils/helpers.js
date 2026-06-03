import { format, parseISO, isValid } from 'date-fns';

// Format date string "YYYY-MM-DD" → "Jan 15, 2025"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'MMM dd, yyyy') : dateStr;
  } catch {
    return dateStr;
  }
};

// Format ISO datetime → "Jan 15, 2025 at 3:00 PM"
export const formatDateTime = (isoStr) => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return format(d, 'MMM dd, yyyy \'at\' h:mm a');
  } catch {
    return isoStr;
  }
};

// Currency formatter
export const formatCurrency = (amount, currency = 'PLN') => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount || 0);
};

// Get initials from full name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Get avatar placeholder color from name
export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-rose-500',  'bg-amber-500',  'bg-cyan-500',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

// Status badge map
export const statusConfig = {
  pending:   { label: 'Pending',   className: 'badge-pending' },
  confirmed: { label: 'Confirmed', className: 'badge-confirmed' },
  completed: { label: 'Completed', className: 'badge-completed' },
  cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
  paid:      { label: 'Paid',      className: 'badge-paid' },
};

// Speciality icons map
export const specialityIcons = {
  'General physician':  '',
  'Gynecologist':       '',
  'Dermatologist':      '',
  'Pediatricians':      '',
  'Neurologist':        '',
  'Gastroenterologist': '',
  'Cardiologist':       '',
  'Orthopedic':         '',
  'Ophthalmologist':    '',
  'Psychiatrist':       '',
  'ENT Specialist':     '',
  'Dentist':            '',
};

// Generate time slots for a day
export const generateTimeSlots = (startHour = 9, endHour = 18, intervalMin = 30) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMin) {
      const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const endMin    = m + intervalMin;
      const endH      = endMin >= 60 ? h + 1 : h;
      const endM      = endMin >= 60 ? endMin - 60 : endMin;
      const endTime   = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      slots.push({ startTime, endTime });
    }
  }
  return slots;
};

// Get next 7 days as array of "YYYY-MM-DD"
export const getNextDays = (count = 7) => {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// Truncate text
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max) + '…' : str;
