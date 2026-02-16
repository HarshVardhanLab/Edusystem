import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faUsers, faChair, faKey, 
  faExclamationTriangle, faChartLine, faCrown 
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SuperAdminDashboard: Component mounted');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('SuperAdminDashboard: Starting data fetch...');
      
      // Try to fetch dashboard data
      try {
        const dashboardResponse = await api.get('/api/v1/superadmin/dashboard/');
        console.log('SuperAdminDashboard: Dashboard data received:', dashboardResponse.data);
        setDashboardData(dashboardResponse.data);
      } catch (dashboardError) {
        console.error('SuperAdminDashboard: Dashboard data error:', dashboardError);
        // Set default dashboard data
        setDashboardData({
          total_libraries: 0,
          active_libraries: 0,
          total_students: 0,
          total_seats: 0,
          licenses_expiring_soon: 0,
          recent_registrations: [],
          license_status_breakdown: {}
        });
      }

      // Try to fetch system stats
      try {
        const statsResponse = await api.get('/api/v1/superadmin/stats/');
        console.log('SuperAdminDashboard: System stats received:', statsResponse.data);
        setSystemStats(statsResponse.data);
      } catch (statsError) {
        console.error('SuperAdminDashboard: System stats error:', statsError);
        // Set default system stats
        setSystemStats({
          libraries: { total: 0, active: 0, inactive: 0 },
          students: { total: 0, active: 0, inactive: 0 },
          seats: { total: 0, occupied: 0, available: 0 },
          licenses: { active: 0, trial: 0, expired: 0, suspended: 0 }
        });
      }

    } catch (error) {
      console.error('SuperAdminDashboard: General error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      console.log('SuperAdminDashboard: Setting loading to false');
      setLoading(false);
    }
  };

  console.log('SuperAdminDashboard: Rendering, loading:', loading, 'dashboardData:', dashboardData, 'systemStats:', systemStats);

  if (loading) {
    console.log('SuperAdminDashboard: Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white animate-slideInUp">
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faCrown} className="text-3xl animate-bounce-slow" />
          <div>
            <h1 className="text-3xl font-bold">Nova LBS Super Admin</h1>
            <p className="text-purple-100">System-wide management and analytics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Libraries</p>
              <p className="text-3xl font-bold text-blue-600 animate-countUp">
                {dashboardData?.total_libraries || 0}
              </p>
              <p className="text-xs text-green-600">
                {dashboardData?.active_libraries || 0} active
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FontAwesomeIcon icon={faBuilding} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-green-600 animate-countUp">
                {dashboardData?.total_students || 0}
              </p>
              <p className="text-xs text-gray-500">Across all libraries</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-3xl font-bold text-purple-600 animate-countUp">
                {dashboardData?.total_seats || 0}
              </p>
              <p className="text-xs text-gray-500">System capacity</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <FontAwesomeIcon icon={faChair} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-3xl font-bold text-orange-600 animate-countUp">
                {dashboardData?.licenses_expiring_soon || 0}
              </p>
              <p className="text-xs text-gray-500">Licenses (30 days)</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* System Statistics */}
      {systemStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Libraries Breakdown */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Libraries Overview</h3>
              <div className="p-2 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Active Libraries</span>
                <span className="font-bold text-green-600 text-lg">
                  {systemStats.libraries?.active || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-medium">Inactive Libraries</span>
                <span className="font-bold text-red-600 text-lg">
                  {systemStats.libraries?.inactive || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Libraries</span>
                <span className="font-bold text-blue-600 text-lg">
                  {systemStats.libraries?.total || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* License Status */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">License Status</h3>
              <div className="p-2 bg-purple-100 rounded-full">
                <FontAwesomeIcon icon={faKey} className="text-purple-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Active Licenses</span>
                <span className="font-bold text-green-600 text-lg">
                  {systemStats.licenses?.active || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Trial Licenses</span>
                <span className="font-bold text-blue-600 text-lg">
                  {systemStats.licenses?.trial || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-medium">Expired Licenses</span>
                <span className="font-bold text-red-600 text-lg">
                  {systemStats.licenses?.expired || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">Suspended Licenses</span>
                <span className="font-bold text-orange-600 text-lg">
                  {systemStats.licenses?.suspended || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/superadmin/libraries')}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-500 rounded-full mb-3">
                <FontAwesomeIcon icon={faBuilding} className="text-2xl text-white" />
              </div>
              <p className="font-semibold text-blue-800 mb-1">Manage Libraries</p>
              <p className="text-xs text-blue-600">View and manage all libraries</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/superadmin/licenses')}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-500 rounded-full mb-3">
                <FontAwesomeIcon icon={faKey} className="text-2xl text-white" />
              </div>
              <p className="font-semibold text-green-800 mb-1">License Management</p>
              <p className="text-xs text-green-600">Create and manage licenses</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/superadmin/analytics')}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-500 rounded-full mb-3">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-white" />
              </div>
              <p className="font-semibold text-purple-800 mb-1">System Analytics</p>
              <p className="text-xs text-purple-600">View detailed reports</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Recent Registrations */}
      {dashboardData?.recent_registrations?.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Library Registrations</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <FontAwesomeIcon icon={faBuilding} className="text-green-600" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Library Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Library ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recent_registrations.map((library, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-sm" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{library.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {library.library_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(library.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SuperAdminDashboard;