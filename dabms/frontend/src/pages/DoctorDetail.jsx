import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Avatar, Spinner } from '../components/common/UI';
import { formatCurrency, getNextDays, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const DoctorDetail = () => {
  const { id }                    = useParams();
  const { isAuthenticated, isPatient } = useAuth();
  const navigate                  = useNavigate();
  const [doctor,     setDoctor]   = useState(null);
  const [loading,    setLoading]  = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking,    setBooking]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/doctor/${id}`);
        setDoctor(data.doctor);
        const days = getNextDays(7);
        setSelectedDate(days[0]);
      } catch {
        toast.error('Doctor not found');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const availableSlotsForDate = doctor?.slots?.filter(
    (s) => s.date === selectedDate && !s.isBooked
  ) || [];

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!isPatient)        { toast.error('Only patients can book appointments'); return; }
    if (!selectedSlot)     { toast.error('Please select a time slot'); return; }

    setBooking(true);
    try {
      await api.post('/appointments/book', {
        doctorId: id,
        slotDate: selectedDate,
        slotTime: selectedSlot.startTime,
      });
      toast.success('Appointment booked!');
      navigate(`/booking-completed`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!doctor) return null;

  const { user, speciality, degree, experience, about, fees, available } = doctor;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Doctor Profile Card */}
      <div className="card mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar src={user?.profileImage} name={user?.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-display text-3xl text-dark">
                  {user?.name?.toLowerCase().startsWith('dr.') ? user?.name : `Dr. ${user?.name}`}
                </h1>
                <p className="text-primary mt-1 font-medium">{speciality} · {degree}</p>
              </div>
              <span className={`badge ${available ? 'badge-completed' : 'bg-slate-100 text-slate-400'}`}>
                {available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="flex flex-wrap gap-8 mt-4">
              <div>
                <p className="text-2xl font-bold text-dark">{experience}</p>
                <p className="text-muted text-xs">Years Exp.</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(fees)}</p>
                <p className="text-muted text-xs">Fee / Visit</p>
              </div>
            </div>

            {about && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">About</h3>
                <p className="text-muted text-sm leading-relaxed">{about}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Section */}
      {available && (
        <div className="card animate-slide-up">
          <h2 className="font-display text-2xl text-dark mb-6">Book Appointment</h2>

          {/* Date Picker */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Select Date</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {getNextDays(7).map((day) => {
                const d = new Date(day);
                const hasSlots = doctor.slots?.some((s) => s.date === day && !s.isBooked);
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                    disabled={!hasSlots}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all ${
                      selectedDate === day
                        ? 'bg-primary border-primary text-white'
                        : hasSlots
                          ? 'border-slate-200 text-muted hover:border-primary/50 hover:text-dark bg-white'
                          : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
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

          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Available Times · {formatDate(selectedDate)}
              </h3>
              {availableSlotsForDate.length === 0 ? (
                <p className="text-muted text-sm py-4">No available slots for this date.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {availableSlotsForDate.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        selectedSlot?._id === slot._id
                          ? 'bg-primary border-primary text-white'
                          : 'border-slate-200 text-muted hover:border-primary/50 hover:text-dark bg-white'
                      }`}
                    >
                      {slot.startTime} – {slot.endTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fee Summary */}
          {selectedSlot && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 mb-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-dark font-medium">
                    {user?.name?.toLowerCase().startsWith('dr.') ? user?.name : `Dr. ${user?.name}`}
                  </p>
                  <p className="text-muted text-sm">{formatDate(selectedDate)} · {selectedSlot.startTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted text-xs">Consultation Fee</p>
                  <p className="text-primary text-xl font-bold">{formatCurrency(fees)}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!selectedSlot || booking}
            className="btn-primary w-full py-4 text-base"
          >
            {booking ? 'Booking…' : isAuthenticated ? 'Confirm Booking →' : 'Login to Book →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorDetail;
