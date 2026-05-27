import { Link } from 'react-router-dom';

const BookingCompleted = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 animate-fade-in bg-slate-50">
      <div className="w-full max-w-md card text-center p-8 animate-slide-up shadow-xl border border-slate-200">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="font-display text-3xl text-dark mb-4">Booking Confirmed!</h1>
        <p className="text-muted mb-8 leading-relaxed">
          Your appointment has been successfully booked. We've just sent you an email with the exact time, details, and <strong>location</strong> of the clinic.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/patient/appointments" className="btn-primary py-3">
            View My Appointments
          </Link>
          <Link to="/" className="btn-secondary py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingCompleted;
