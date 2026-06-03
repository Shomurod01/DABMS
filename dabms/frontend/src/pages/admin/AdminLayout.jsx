import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';

const ADMIN_LINKS = [
  { to: '/admin/dashboard',    label: 'Dashboard',  exact: true },
  { to: '/admin/doctors',      label: 'Doctors', },
  { to: '/admin/appointments', label: 'Appointments', },
  { to: '/admin/users',        label: 'Users',   },
  { to: '/admin/add-doctor',   label: 'Add Doctor',  },
];

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar links={ADMIN_LINKS} role="admin" />
    <main className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </main>
  </div>
);

export default AdminLayout;
