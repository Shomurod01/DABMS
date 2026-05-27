import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { StatsCard, Spinner, EmptyState } from '../../components/common/UI';
import AppointmentCard from '../../components/common/AppointmentCard';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { user }                          = useAuth();
  const [data,    setData]                = useState(null);
  const [loading, setLoading]             = useState(true);

  const load = async () => {
    try {
      const { data: d } = await api.get('/doctor/me/dashboard');
      setData(d);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    try {
      await api.put(`/doctor/me/appointment/${id}/complete`);
      toast.success('Appointment completed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Reason for cancellation (optional):') ?? '';
    try {
      await api.put(`/doctor/me/appointment/${id}/cancel`, { reason });
      toast.success('Appointment cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await api.put(`/appointments/${id}/confirm`);
      toast.success('Appointment confirmed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  const { stats, recentAppointments } = data || {};

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="page-subtitle">Welcome back, Dr. {user?.name?.replace(/^Dr\.?\s*/i, '').split(' ')[0]}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <StatsCard icon="⏳" label="Pending"   value={stats?.pending   || 0} color="bg-amber-50 text-amber-600" />
        <StatsCard icon="✅" label="Confirmed" value={stats?.confirmed || 0} color="bg-blue-50 text-blue-600" />
        <StatsCard icon="🎉" label="Completed" value={stats?.completed || 0} color="bg-teal-50 text-teal-600" />
        <StatsCard icon="💰" label="Earnings"  value={formatCurrency(stats?.earnings || 0)} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Recent Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-dark mb-4">Recent Appointments</h2>
        {!recentAppointments?.length ? (
          <EmptyState icon="📅" title="No appointments yet" description="Your upcoming appointments will appear here." />
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((a) => (
              <AppointmentCard
                key={a._id} appointment={a} role="doctor"
                onComplete={handleComplete}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
