import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBuilding, faUsers, faChair, faKey,
  faCalendarAlt, faArrowUp, faArrowDown, faMinus,
  faEye, faDownload, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const [dashboardResponse, statsResponse] = await Promise.all([
        api.get('/api/v1/superadmin/dashboard/'),
        api.get('/api/v1/superadmin/stats/')
      ]);
      
      setAnalytics({
        dashboard: dashboardResponse.data,
        stats: statsResponse.data
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: faArrowUp, color: 'text-green-600' };
    if (trend < 0) return { icon: faArrowDown, color: 'text-red-600' };
    return { icon: faMinus, color: 'text-gray-600' };
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const { dashboard, stats } = analytics || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
          <p className="text-gray-600">Comprehensive system performance and usage analytics</p>
        </div>
        <div className="flex space-x-3 animate-slideInRight">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Libraries</p>
              <p className="text-3xl font-bold text-blue-600 animate-countUp">{dashboard?.total_libraries || 0}</p>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={getTrendIcon(5).icon} className={`text-xs mr-1 ${getTrendIcon(5).color}`} />
                <span className="text-xs text-gray-500">+5% from last month</span>
              </div>
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
              <p className="text-3xl font-bold text-green-600 animate-countUp">{dashboard?.total_students || 0}</p>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={getTrendIcon(12).icon} className={`text-xs mr-1 ${getTrendIcon(12).color}`} />
                <span className="text-xs text-gray-500">+12% from last month</span>
              </div>
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
              <p className="text-3xl font-bold text-purple-600 animate-countUp">{dashboard?.total_seats || 0}</p>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={getTrendIcon(8).icon} className={`text-xs mr-1 ${getTrendIcon(8).color}`} />
                <span className="text-xs text-gray-500">+8% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <FontAwesomeIcon icon={faChair} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Licenses</p>
              <p className="text-3xl font-bold text-orange-600 animate-countUp">{stats?.licenses?.active || 0}</p>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={getTrendIcon(3).icon} className={`text-xs mr-1 ${getTrendIcon(3).color}`} />
                <span className="text-xs text-gray-500">+3% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <FontAwesomeIcon icon={faKey} className="text-2xl text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Growth Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Library Growth Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <FontAwesomeIcon icon={faChartLine} className="text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </Card>

        {/* Student Registration Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Registration Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <FontAwesomeIcon icon={faChartLine} className="text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Library Statistics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Library Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Libraries</span>
              <span className="font-semibold text-green-600">{stats?.libraries?.active || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inactive Libraries</span>
              <span className="font-semibold text-red-600">{stats?.libraries?.inactive || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Students per Library</span>
              <span className="font-semibold text-blue-600">
                {stats?.libraries?.total > 0 ? Math.round((dashboard?.total_students || 0) / stats.libraries.total) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Seats per Library</span>
              <span className="font-semibold text-purple-600">
                {stats?.libraries?.total > 0 ? Math.round((dashboard?.total_seats || 0) / stats.libraries.total) : 0}
              </span>
            </div>
          </div>
        </Card>

        {/* License Statistics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">License Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Licenses</span>
              <span className="font-semibold text-green-600">{stats?.licenses?.active || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trial Licenses</span>
              <span className="font-semibold text-blue-600">{stats?.licenses?.trial || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expired Licenses</span>
              <span className="font-semibold text-red-600">{stats?.licenses?.expired || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Suspended Licenses</span>
              <span className="font-semibold text-orange-600">{stats?.licenses?.suspended || 0}</span>
            </div>
          </div>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Students</span>
              <span className="font-semibold text-blue-600">{stats?.students?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Students</span>
              <span className="font-semibold text-green-600">{stats?.students?.active || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Seat Utilization</span>
              <span className="font-semibold text-purple-600">
                {stats?.seats?.total > 0 ? Math.round((stats.seats.occupied / stats.seats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Licenses Expiring Soon</span>
              <span className="font-semibold text-orange-600">{dashboard?.licenses_expiring_soon || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      {dashboard?.recent_registrations?.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Library Registrations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                {dashboard.recent_registrations.map((library, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {library.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {library.library_id}
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

export default Analytics;