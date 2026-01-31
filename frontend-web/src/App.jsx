import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLayout from './components/layouts/AdminLayout';
import StudentLayout from './components/layouts/StudentLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import Seats from './pages/admin/Seats';
import Attendance from './pages/admin/Attendance';
import QRCodeManagement from './pages/admin/QRCodeManagement';
import Subscriptions from './pages/admin/Subscriptions';
import AdminNotifications from './pages/admin/Notifications';
import Reports from './pages/admin/Reports';
import Library from './pages/admin/Library';
import StudentDashboard from './pages/student/Dashboard';
import StudyTimer from './pages/student/StudyTimer';
import Notes from './pages/student/Notes';
import Tasks from './pages/student/Tasks';
import QRAttendance from './pages/student/QRAttendance';
import Goals from './pages/student/Goals';
import StudentAttendance from './pages/student/Attendance';
import StudentSubscription from './pages/student/Subscription';
import StudentNotifications from './pages/student/Notifications';
import StudentProfile from './pages/student/Profile';
import { isAuthenticated, getUserRole } from './utils/auth';

function App() {
  console.log('App: Rendering');
  const getDefaultRoute = () => {
    if (!isAuthenticated()) return '/login';
    const role = getUserRole();
    return role === 'LIBRARY_OWNER' ? '/admin/dashboard' : '/student/dashboard';
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="LIBRARY_OWNER">
              <AdminLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="seats" element={<Seats />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="qr-codes" element={<QRCodeManagement />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reports" element={<Reports />} />
          <Route path="library" element={<Library />} />
        </Route>

        <Route path="/student" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="STUDENT">
              <StudentLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="timer" element={<StudyTimer />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="qr-attendance" element={<QRAttendance />} />
          <Route path="goals" element={<Goals />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="subscription" element={<StudentSubscription />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
