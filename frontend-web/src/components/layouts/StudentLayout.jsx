import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faCheck, faCreditCard, faBell, faUser, faClock,
  faStickyNote, faListCheck, faQrcode, faTrophy
} from '@fortawesome/free-solid-svg-icons';

const StudentLayout = () => {
  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <FontAwesomeIcon icon={faChartLine} /> },
    { path: '/student/timer', label: 'Study Timer', icon: <FontAwesomeIcon icon={faClock} /> },
    { path: '/student/notes', label: 'My Notes', icon: <FontAwesomeIcon icon={faStickyNote} /> },
    { path: '/student/tasks', label: 'Tasks', icon: <FontAwesomeIcon icon={faListCheck} /> },
    { path: '/student/qr-attendance', label: 'QR Attendance', icon: <FontAwesomeIcon icon={faQrcode} /> },
    { path: '/student/goals', label: 'Study Goals', icon: <FontAwesomeIcon icon={faTrophy} /> },
    { path: '/student/attendance', label: 'Attendance History', icon: <FontAwesomeIcon icon={faCheck} /> },
    { path: '/student/subscription', label: 'Subscription', icon: <FontAwesomeIcon icon={faCreditCard} /> },
    { path: '/student/notifications', label: 'Notifications', icon: <FontAwesomeIcon icon={faBell} /> },
    { path: '/student/profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
