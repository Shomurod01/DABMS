import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';

const PATIENT_LINKS = [
  { to: '/patient/dashboard',     label: 'Dashboard',     exact: true },
  { to: '/patient/appointments',  label: 'Appointments' },
  { to: '/profile',               label: 'My Profile' },
  { to: '/doctors',               label: 'Find Doctors' },
];

const PatientLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar links={PATIENT_LINKS} role="patient" />
    <main className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </main>
  </div>
);

export default PatientLayout;
