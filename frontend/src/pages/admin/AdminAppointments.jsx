import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Avatar, Spinner, EmptyState, Pagination, StatusBadge, ConfirmModal } from '../../components/common/UI';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('all');
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [modal,        setModal]        = useState({ open: false, id: null });

  const load = async (t = tab, p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (t !== 'all') params.status = t;
      const { data } = await api.get('/admin/appointments', { params });
      setAppointments(data.appointments);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab, page]);

  const handleCancel = async () => {
    try {
      await api.put(`/admin/appointments/${modal.id}/cancel`, { reason: 'Cancelled by admin' });
      toast.success('Appointment cancelled');
      setModal({ open: false });
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Monitor all platform appointments</p>
      </div>

      {/* Tabs */}
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
        <EmptyState icon="📅" title="No appointments found" />
      ) : (
        <>
          <div className="card p-0 overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="table-header">Patient</th>
                    <th className="table-header">Doctor</th>
                    <th className="table-header hidden md:table-cell">Date & Time</th>
                    <th className="table-header">Status</th>
                    <th className="table-header hidden sm:table-cell">Payment</th>
                    <th className="table-header hidden sm:table-cell">Amount</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a._id} className="table-row hover:bg-slate-50/50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar src={a.patient?.profileImage} name={a.patient?.name} size="xs" />
                          <span className="truncate max-w-[90px] text-sm text-dark font-medium">{a.patient?.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar src={a.doctor?.user?.profileImage} name={a.doctor?.user?.name} size="xs" />
                          <span className="truncate max-w-[90px] text-sm text-dark font-medium">
                            {a.doctor?.user?.name?.toLowerCase().startsWith('dr.') ? a.doctor?.user?.name : `Dr. ${a.doctor?.user?.name}`}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell hidden md:table-cell text-slate-500 text-xs">
                        {formatDate(a.slotDate)}<br />{a.slotTime}
                      </td>
                      <td className="table-cell"><StatusBadge status={a.status} /></td>
                      <td className="table-cell hidden sm:table-cell"><StatusBadge status={a.payment?.status} /></td>
                      <td className="table-cell hidden sm:table-cell text-primary font-medium">{formatCurrency(a.amount)}</td>
                      <td className="table-cell">
                        {!['completed', 'cancelled'].includes(a.status) && (
                          <button
                            onClick={() => setModal({ open: true, id: a._id })}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        isOpen={modal.open}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        onConfirm={handleCancel}
        onCancel={() => setModal({ open: false })}
        confirmLabel="Cancel Appointment"
        danger
      />
    </div>
  );
};

export default AdminAppointments;
