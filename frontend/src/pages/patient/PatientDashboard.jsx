import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { StatsCard, Spinner, EmptyState } from '../../components/common/UI';
import AppointmentCard from '../../components/common/AppointmentCard';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const { user }                          = useAuth();
  const [stats,        setStats]          = useState(null);
  const [appointments, setAppointments]   = useState([]);
  const [loading,      setLoading]        = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/patient/dashboard');
      setStats(data.stats);
      setAppointments(data.recentAppointments);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/patient/appointment/${id}/cancel`);
      toast.success('Appointment cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="animate-fade-in">
      {}
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's your health overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <StatsCard icon="📋" label="Total"     value={stats?.total     || 0} color="bg-blue-50 text-blue-600" />
        <StatsCard icon="⏳" label="Pending"   value={stats?.pending   || 0} color="bg-amber-50 text-amber-600" />
        <StatsCard icon="✅" label="Completed" value={stats?.completed || 0} color="bg-teal-50 text-teal-600" />
        <StatsCard icon="❌" label="Cancelled" value={stats?.cancelled || 0} color="bg-rose-50 text-rose-600" />
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/doctors" className="card flex items-center gap-4 hover:border-teal-200 group border border-slate-200 shadow-sm transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔍</div>
          <div>
            <p className="font-semibold text-dark">Find a Doctor</p>
            <p className="text-muted text-sm">Browse verified specialists</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-primary transition-colors">→</span>
        </Link>
        <Link to="/patient/appointments" className="card flex items-center gap-4 hover:border-blue-200 group border border-slate-200 shadow-sm transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📅</div>
          <div>
            <p className="font-semibold text-dark">My Appointments</p>
            <p className="text-muted text-sm">View all appointments</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors">→</span>
        </Link>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark">Recent Appointments</h2>
          <Link to="/patient/appointments" className="text-sm font-medium text-primary hover:text-teal-700 transition-colors">View all →</Link>
        </div>
        {appointments.length === 0 ? (
          <EmptyState icon="📅" title="No appointments yet" description="Book your first appointment with a verified doctor." action={<Link to="/doctors" className="btn-primary px-6 py-2.5 text-sm">Find Doctors</Link>} />
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <AppointmentCard key={a._id} appointment={a} role="patient" onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
