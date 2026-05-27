import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Avatar, Spinner, EmptyState, Pagination, ConfirmModal } from '../../components/common/UI';
import { formatDateTime } from '../../utils/helpers';
import { toast } from 'react-toastify';

const ROLE_TABS = ['all', 'patient', 'doctor', 'admin'];

const AdminUsers = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('all');
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal,      setModal]      = useState({ open: false, userId: null, isActive: false });

  const load = async (t = tab, p = page, s = search) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (t !== 'all') params.role = t;
      if (s)           params.search = s;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab, page]);

  const handleToggle = async () => {
    try {
      await api.put(`/admin/users/${modal.userId}/toggle-status`);
      toast.success(`User ${modal.isActive ? 'deactivated' : 'activated'}`);
      setModal({ open: false });
      load();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(tab, 1, search);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Manage all platform users</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Search</button>
        </form>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {ROLE_TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-dark'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users found" />
      ) : (
        <>
          <div className="card p-0 overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="table-header">User</th>
                    <th className="table-header">Role</th>
                    <th className="table-header hidden md:table-cell">Phone</th>
                    <th className="table-header hidden lg:table-cell">Joined</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="table-row hover:bg-slate-50/50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.profileImage} name={u.name} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-dark truncate text-sm">{u.name}</p>
                            <p className="text-muted text-xs truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge capitalize ${
                          u.role === 'admin'   ? 'bg-violet-100 text-violet-700' :
                          u.role === 'doctor'  ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="table-cell hidden md:table-cell text-slate-500">{u.phone || '—'}</td>
                      <td className="table-cell hidden lg:table-cell text-slate-500 text-xs">{formatDateTime(u.createdAt)}</td>
                      <td className="table-cell">
                        <span className={`badge ${u.isActive ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => setModal({ open: true, userId: u._id, isActive: u.isActive })}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium ${
                            u.isActive
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100'
                          }`}
                        >
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
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
        title={modal.isActive ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${modal.isActive ? 'deactivate' : 'activate'} this user?`}
        onConfirm={handleToggle}
        onCancel={() => setModal({ open: false })}
        confirmLabel="Confirm"
        danger={modal.isActive}
      />
    </div>
  );
};

export default AdminUsers;
