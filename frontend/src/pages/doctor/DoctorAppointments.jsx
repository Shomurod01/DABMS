import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Spinner, EmptyState, Pagination } from '../../components/common/UI';
import AppointmentCard from '../../components/common/AppointmentCard';
import { toast } from 'react-toastify';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('all');
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);

  const load = async (t = tab, p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (t !== 'all') params.status = t;
      const { data } = await api.get('/doctor/me/appointments', { params });
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab, page]);

  const handleComplete = async (id) => {
    if (!window.confirm('Mark as completed?')) return;
    try {
      await api.put(`/doctor/me/appointment/${id}/complete`);
      toast.success('Marked as completed');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Cancellation reason (optional):') ?? '';
    try {
      await api.put(`/doctor/me/appointment/${id}/cancel`, { reason });
      toast.success('Appointment cancelled');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleConfirm = async (id) => {
    try {
      await api.put(`/appointments/${id}/confirm`);
      toast.success('Appointment confirmed');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Manage patient appointments</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {STATUS_TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-dark'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : appointments.length === 0 ? (
        <EmptyState icon="📅" title="No appointments" description="No appointments in this category." />
      ) : (
        <>
          <div className="space-y-3">
            {appointments.map((a) => (
              <AppointmentCard key={a._id} appointment={a} role="doctor"
                onComplete={handleComplete} onCancel={handleCancel} onConfirm={handleConfirm} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default DoctorAppointments;
