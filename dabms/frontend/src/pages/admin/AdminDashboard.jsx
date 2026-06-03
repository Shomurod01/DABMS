import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { StatsCard, Spinner, Avatar, StatusBadge } from '../../components/common/UI';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: d } = await api.get('/admin/dashboard');
        setData(d);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  const { stats, recentAppointments, monthlyRevenue } = data || {};

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <StatsCard label="Total Doctors"   value={stats?.totalDoctors    || 0} color="bg-teal-50 text-teal-600" />
        <StatsCard label="Total Patients"  value={stats?.totalPatients   || 0} color="bg-blue-50 text-blue-600" />
        <StatsCard label="Appointments"    value={stats?.totalAppointments || 0} color="bg-yellow-50 text-yellow-600" />
        <StatsCard label="Total Revenue"   value={formatCurrency(stats?.totalRevenue || 0)} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Pending Verification Banner */}
      {stats?.pendingVerification > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <span className="text-2xl"></span>
          <div className="flex-1">
            <p className="text-amber-800 font-medium text-sm">{stats.pendingVerification} doctor(s) pending verification</p>
            <p className="text-amber-600/80 text-xs">Review and verify new doctor accounts</p>
          </div>
          <a href="/admin/doctors?verified=false" className="text-xs text-amber-600 hover:text-amber-700 font-medium">Review →</a>
        </div>
      )}

      {/* Monthly Revenue Chart (simple bar) */}
      {monthlyRevenue?.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-dark mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-2 h-32">
            {monthlyRevenue.map((m) => {
              const maxVal = Math.max(...monthlyRevenue.map((r) => r.total));
              const height = maxVal > 0 ? (m.total / maxVal) * 100 : 0;
              const monthName = new Date(m._id.year, m._id.month - 1).toLocaleString('en', { month: 'short' });
              return (
                <div key={`${m._id.year}-${m._id.month}`} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-teal-100 rounded-t-lg group-hover:bg-primary transition-all"
                      style={{ height: `${Math.max(height, 4)}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted">{monthName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Appointments Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-dark mb-6">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">Patient</th>
                <th className="table-header">Doctor</th>
                <th className="table-header hidden md:table-cell">Date</th>
                <th className="table-header">Status</th>
                <th className="table-header hidden sm:table-cell">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments?.map((a) => (
                <tr key={a._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar src={a.patient?.profileImage} name={a.patient?.name} size="xs" />
                      <span className="truncate max-w-[100px] text-dark font-medium">{a.patient?.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar src={a.doctor?.user?.profileImage} name={a.doctor?.user?.name} size="xs" />
                      <span className="truncate max-w-[100px] text-dark font-medium">
                        {a.doctor?.user?.name?.toLowerCase().startsWith('dr.') ? a.doctor?.user?.name : `Dr. ${a.doctor?.user?.name}`}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell text-muted">{a.slotDate} {a.slotTime}</td>
                  <td className="table-cell"><StatusBadge status={a.status} /></td>
                  <td className="table-cell hidden sm:table-cell text-primary font-medium">{formatCurrency(a.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
