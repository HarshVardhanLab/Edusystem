import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLayout from './components/layouts/AdminLayout';
import StudentLayout from './components/layouts/StudentLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import TestDashboard from './pages/superadmin/TestDashboard';
import Libraries from './pages/superadmin/Libraries';
import Licenses from './pages/superadmin/Licenses';
import Analytics from './pages/superadmin/Analytics';
import Users from './pages/superadmin/Users';
import Logs from './pages/superadmin/Logs';
import Settings from './pages/superadmin/Settings';
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
import AIAssistantPage from './pages/student/AIAssistantPage';
import { isAuthenticated, getUserRole } from './utils/auth';

function App() {
  console.log('App: Rendering');
  const getDefaultRoute = () => {
    const authenticated = isAuthenticated();
    const role = getUserRole();
    console.log('App: getDefaultRoute - authenticated:', authenticated, 'role:', role);
    
    if (!authenticated) return '/login';
    if (role === 'SUPER_ADMIN') return '/superadmin/dashboard';
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
          <Route path="ai-assistant" element={<AIAssistantPage />} />
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
          <Route path="ai-assistant" element={<AIAssistantPage />} />
        </Route>

        <Route path="/superadmin" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="SUPER_ADMIN">
              <SuperAdminLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="libraries" element={<Libraries />} />
          <Route path="licenses" element={<Licenses />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
