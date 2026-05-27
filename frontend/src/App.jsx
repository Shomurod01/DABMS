import { Routes, Route } from 'react-router-dom';
  import Navbar  from './components/common/Navbar';
     import Footer  from './components/common/Footer';
  import { ProtectedRoute, RoleRoute } from './components/common/ProtectedRoute';


import Home         from './pages/Home';
  import Doctors      from './pages/Doctors';
   import DoctorDetail from './pages/DoctorDetail';
    import Login        from './pages/Login';
      import Register     from './pages/Register';
    import Profile      from './pages/Profile';
  import BookingCompleted from './pages/BookingCompleted';
  import NotFound     from './pages/NotFound';
    import { About, Contact }           from './pages/AboutContact';
      import { ForgotPassword, ResetPassword } from './pages/PasswordPages';


import PatientLayout      from './pages/patient/PatientLayout';
  import PatientDashboard   from './pages/patient/PatientDashboard';
 import PatientAppointments from './pages/patient/PatientAppointments';


import DoctorLayout       from './pages/doctor/DoctorLayout';
  import DoctorDashboard    from './pages/doctor/DoctorDashboard';
        import DoctorAppointments from './pages/doctor/DoctorAppointments';
    import DoctorSlots        from './pages/doctor/DoctorSlots';
 import DoctorProfile      from './pages/doctor/DoctorProfile';
import DoctorPatients     from './pages/doctor/DoctorPatients';


import AdminLayout        from './pages/admin/AdminLayout';
   import AdminDashboard     from './pages/admin/AdminDashboard';
     import AdminDoctors       from './pages/admin/AdminDoctors';
  import AdminAddDoctor     from './pages/admin/AdminAddDoctor';
 import AdminAppointments  from './pages/admin/AdminAppointments';
import AdminUsers         from './pages/admin/AdminUsers';


const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => {
  return (
    <Routes>

      {}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
       <Route path="/doctors" element={<PublicLayout><Doctors /></PublicLayout>} />
        <Route path="/doctors/:id" element={<PublicLayout><DoctorDetail /></PublicLayout>} />
         <Route path="/about"   element={<PublicLayout><About /></PublicLayout>} />
       <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login"   element={<PublicLayout><Login /></PublicLayout>} />
         <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
           <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
           <Route path="/reset-password/:token" element={<PublicLayout><ResetPassword /></PublicLayout>} />

      {}
      <Route path="/profile" element={
        <ProtectedRoute>
          <PublicLayout><Profile /></PublicLayout>
        </ProtectedRoute>
      } />

      <Route path="/booking-completed" element={
        <RoleRoute roles={['patient']}>
          <PublicLayout><BookingCompleted /></PublicLayout>
        </RoleRoute>
      } />

      {}
      <Route path="/patient" element={
        <RoleRoute roles={['patient']}>
          <PatientLayout />
        </RoleRoute>
      }>
        <Route path="dashboard"    element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
      </Route>

      {}
      <Route path="/doctor" element={
        <RoleRoute roles={['doctor']}>
          <DoctorLayout />
        </RoleRoute>
      }>
           <Route path="dashboard"    element={<DoctorDashboard />} />
               <Route path="appointments" element={<DoctorAppointments />} />
           <Route path="patients"     element={<DoctorPatients />} />
          <Route path="slots"        element={<DoctorSlots />} />
        <Route path="profile"      element={<DoctorProfile />} />
      </Route>

      {}
      <Route path="/admin" element={
        <RoleRoute roles={['admin']}>
          <AdminLayout />
        </RoleRoute>
      }>
        <Route path="dashboard"    element={<AdminDashboard />} />
           <Route path="doctors"      element={<AdminDoctors />} />
             <Route path="add-doctor"   element={<AdminAddDoctor />} />
           <Route path="appointments" element={<AdminAppointments />} />
        <Route path="users"        element={<AdminUsers />} />
      </Route>

      {}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />

    </Routes>
  );
};

export default App;
