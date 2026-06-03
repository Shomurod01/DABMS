import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Avatar, Spinner, EmptyState, Pagination, ConfirmModal } from '../../components/common/UI';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';

const AdminDoctors = () => {
  const [doctors,    setDoctors]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter,     setFilter]     = useState('all'); 
  const [modal,      setModal]      = useState({ open: false, doctorId: null, action: null });

  const load = async (p = page, f = filter) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (f === 'verified')   params.verified = true;
      if (f === 'unverified') params.verified = false;
      const { data } = await api.get('/admin/doctors', { params });
      setDoctors(data.doctors);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filter]);

  const handleVerify = async () => {
    try {
      await api.put(`/admin/doctors/${modal.doctorId}/verify`);
      toast.success('Doctor verification status updated');
      setModal({ open: false });
      load();
    } catch {
      toast.error('Failed to update verification');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success('User status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">Manage and verify doctor accounts</p>
        </div>
        <Link to="/admin/add-doctor" className="btn-primary py-2.5 px-5 text-sm">+ Add Doctor</Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl inline-flex">
        {['all', 'verified', 'unverified'].map((f) => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-dark'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : doctors.length === 0 ? (
        <EmptyState title="No doctors found" />
      ) : (
        <>
          <div className="card p-0 overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="table-header">Doctor</th>
                    <th className="table-header hidden md:table-cell">Speciality</th>
                    <th className="table-header hidden lg:table-cell">Experience</th>
                    <th className="table-header hidden sm:table-cell">Fee</th>
                    <th className="table-header">Verified</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((doc) => (
                    <tr key={doc._id} className="table-row hover:bg-slate-50/50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar src={doc.user?.profileImage} name={doc.user?.name} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-dark truncate">
                              {doc.user?.name?.toLowerCase().startsWith('dr.') ? doc.user?.name : `Dr. ${doc.user?.name}`}
                            </p>
                            <p className="text-muted text-xs truncate">{doc.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden md:table-cell text-slate-600">{doc.speciality}</td>
                      <td className="table-cell hidden lg:table-cell text-slate-600">{doc.experience} yrs</td>
                      <td className="table-cell hidden sm:table-cell text-primary font-medium">{formatCurrency(doc.fees)}</td>
                      <td className="table-cell">
                        <span className={`badge ${doc.isVerified ? 'badge-completed' : 'bg-amber-100 text-amber-700'}`}>
                          {doc.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${doc.user?.isActive ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>
                          {doc.user?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal({ open: true, doctorId: doc._id, action: 'verify' })}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
                          >
                            {doc.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(doc.user?._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors font-medium"
                          >
                            {doc.user?.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </div>
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
        title="Update Verification"
        message="Are you sure you want to change this doctor's verification status?"
        onConfirm={handleVerify}
        onCancel={() => setModal({ open: false })}
        confirmLabel="Confirm"
      />
    </div>
  );
};

export default AdminDoctors;
