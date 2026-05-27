import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';

const DOCTOR_LINKS = [
  { to: '/doctor/dashboard',    label: 'Dashboard',   exact: true },
  { to: '/doctor/appointments', label: 'Appointments',  },
  { to: '/doctor/patients',     label: 'My Patients',  },
  { to: '/doctor/slots',        label: 'Manage Slots', },
  { to: '/doctor/profile',      label: 'My Profile',  },
];

const DoctorLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar links={DOCTOR_LINKS} role="doctor" />
    <main className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </main>
  </div>
);

export default DoctorLayout;
