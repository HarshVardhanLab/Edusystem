import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrown, faBuilding, faKey, faChartLine, faUsers, faCog,
  faSignOutAlt, faBars, faTimes, faHome, faDatabase, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { getUser, getRefreshToken } from '../../utils/auth';
import toast from 'react-hot-toast';

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const navigation = [
    { name: 'Dashboard', href: '/superadmin/dashboard', icon: faHome },
    { name: 'Libraries', href: '/superadmin/libraries', icon: faBuilding },
    { name: 'Licenses', href: '/superadmin/licenses', icon: faKey },
    { name: 'Analytics', href: '/superadmin/analytics', icon: faChartLine },
    { name: 'System Users', href: '/superadmin/users', icon: faUsers },
    { name: 'System Logs', href: '/superadmin/logs', icon: faDatabase },
    { name: 'Settings', href: '/superadmin/settings', icon: faCog },
  ];

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      await authService.logout(refreshToken);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-purple-900 to-blue-900 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      } w-64 relative`}>
        
        {/* Curved edges */}
        <div className="hidden lg:block absolute top-0 right-0 w-8 h-8 bg-gray-100 rounded-bl-3xl"></div>
        <div className="hidden lg:block absolute bottom-0 right-0 w-8 h-8 bg-gray-100 rounded-tl-3xl"></div>
        
        {/* Collapse button in the middle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 border-2 border-purple-600"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FontAwesomeIcon icon={sidebarCollapsed ? faChevronRight : faChevronLeft} size="sm" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 bg-black bg-opacity-20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faCrown} className="text-2xl text-yellow-400" />
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-white font-bold text-lg">Nova LBS</h1>
                <p className="text-purple-200 text-xs">Super Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300 absolute right-4"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-purple-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <FontAwesomeIcon icon={item.icon} className={`text-lg ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="p-4 bg-black bg-opacity-20 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCrown} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.full_name || user?.email || 'Super Admin'}
                </p>
                <p className="text-purple-200 text-xs">System Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-4'} py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors`}
            title={sidebarCollapsed ? 'Sign Out' : ''}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className={`text-lg ${sidebarCollapsed ? '' : 'mr-3'}`} />
            {!sidebarCollapsed && 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user?.full_name || 'Super Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <FontAwesomeIcon icon={faCrown} className="text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Super Admin</span>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {location.pathname.split('/').pop() || 'Dashboard'}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;