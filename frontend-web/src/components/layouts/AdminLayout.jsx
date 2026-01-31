import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faChair, faCheck, faCreditCard, faBell, faChartBar, faBuilding, faQrcode } from '@fortawesome/free-solid-svg-icons';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FontAwesomeIcon icon={faChartLine} /> },
    { path: '/admin/students', label: 'Students', icon: <FontAwesomeIcon icon={faUsers} /> },
    { path: '/admin/seats', label: 'Seats', icon: <FontAwesomeIcon icon={faChair} /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <FontAwesomeIcon icon={faCheck} /> },
    { path: '/admin/qr-codes', label: 'QR Codes', icon: <FontAwesomeIcon icon={faQrcode} /> },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: <FontAwesomeIcon icon={faCreditCard} /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <FontAwesomeIcon icon={faBell} /> },
    { path: '/admin/reports', label: 'Reports', icon: <FontAwesomeIcon icon={faChartBar} /> },
    { path: '/admin/library', label: 'Library Profile', icon: <FontAwesomeIcon icon={faBuilding} /> },
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

export default AdminLayout;
