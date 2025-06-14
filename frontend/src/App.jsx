import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './pages/PrivateRoute';
import ManageCoordinator from './pages/admin/ManageCoordinator';
import Users from './pages/admin/Users';
import Colleges from './pages/admin/Colleges';
import CollegeDetails from './pages/admin/CollegeDetails';
import ProgramDetail from './pages/admin/ProgramDetail';
import Programs from './pages/admin/Programs';
import Subjects from './pages/admin/Subjects';
import SubjectAllocation from './pages/admin/SubjectAllocation';
import Students from './pages/admin/Students';
import TimeSlot from './pages/admin/TimeSlot';
import Attendance from './pages/admin/Attendance';
import PaymentVoucher from './pages/admin/PaymentVoucher';
import AttendanceReport from './pages/admin/AttendanceReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin/manage-coordinator" element={<ManageCoordinator />} />        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/colleges" element={<Colleges />} />
        <Route path="/admin/colleges/:id" element={<CollegeDetails />} />
        <Route path="/admin/programs/:programId" element={<ProgramDetail />} />
        <Route path="/admin/programs" element={<Programs />} />
        <Route path="/admin/subjects" element={<Subjects />} />
        <Route path="/admin/subject-allocation" element={<SubjectAllocation />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/time-slot" element={<TimeSlot />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/payment-voucher" element={<PaymentVoucher />} />
        <Route path="/admin/attendance-report" element={<AttendanceReport />} />
      </Routes>
    </Router>
  );
}

export default App;
