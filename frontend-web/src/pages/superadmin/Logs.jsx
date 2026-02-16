import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, faSearch, faFilter, faDownload, faRefresh,
  faInfoCircle, faExclamationTriangle, faTimesCircle, faCheckCircle,
  faCalendarAlt, faUser, faCog
} from '@fortawesome/free-solid-svg-icons';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('TODAY');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock log data - in real implementation, this would come from your backend
  const mockLogs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'User login successful',
      user: 'admin@novalbs.com',
      ip: '192.168.1.100',
      action: 'LOGIN',
      details: 'Super admin logged in successfully'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'INFO',
      message: 'Library created',
      user: 'superadmin@novalbs.com',
      ip: '192.168.1.100',
      action: 'CREATE_LIBRARY',
      details: 'New library "Central Library" created with ID LIB1025'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'WARNING',
      message: 'License expiring soon',
      user: 'system',
      ip: 'localhost',
      action: 'LICENSE_WARNING',
      details: 'License for library LIB1020 expires in 5 days'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      level: 'ERROR',
      message: 'Failed login attempt',
      user: 'unknown',
      ip: '192.168.1.200',
      action: 'LOGIN_FAILED',
      details: 'Multiple failed login attempts detected'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      level: 'INFO',
      message: 'Student registered',
      user: 'owner@library.com',
      ip: '192.168.1.150',
      action: 'CREATE_STUDENT',
      details: 'New student registered with ID STU00025'
    }
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      // In real implementation, this would be an API call
      // const response = await api.get('/api/v1/superadmin/logs/');
      // setLogs(response.data);
      
      // For now, using mock data
      setLogs(mockLogs);
    } catch (error) {
      toast.error('Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    
    let matchesDate = true;
    const logDate = new Date(log.timestamp);
    const now = new Date();
    
    switch (dateFilter) {
      case 'TODAY':
        matchesDate = logDate.toDateString() === now.toDateString();
        break;
      case 'WEEK':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= weekAgo;
        break;
      case 'MONTH':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= monthAgo;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesLevel && matchesDate;
  });

  const getLevelIcon = (level) => {
    const icons = {
      'INFO': faInfoCircle,
      'WARNING': faExclamationTriangle,
      'ERROR': faTimesCircle,
      'SUCCESS': faCheckCircle
    };
    return icons[level] || faInfoCircle;
  };

  const getLevelColor = (level) => {
    const colors = {
      'INFO': 'text-blue-600 bg-blue-100',
      'WARNING': 'text-orange-600 bg-orange-100',
      'ERROR': 'text-red-600 bg-red-100',
      'SUCCESS': 'text-green-600 bg-green-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'User', 'Action', 'Message', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.user,
        log.action,
        `"${log.message}"`,
        log.ip,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Logs exported successfully');
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and events</p>
        </div>
        <div className="flex space-x-2 animate-slideInRight">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'success' : 'outline'}
            className="hover-lift"
          >
            <FontAwesomeIcon icon={faRefresh} className={`mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={exportLogs} variant="outline" className="hover-lift">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="SUCCESS">Success</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Last Week</option>
              <option value="MONTH">Last Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('ALL');
                setDateFilter('TODAY');
              }}
              variant="outline"
              className="w-full"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-l-4 border-blue-500 hover-lift animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full mr-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Info</p>
              <p className="text-2xl font-bold text-blue-600 animate-countUp">
                {logs.filter(log => log.level === 'INFO').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-orange-50 border-l-4 border-orange-500 hover-lift animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-full mr-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-orange-600 animate-countUp">
                {logs.filter(log => log.level === 'WARNING').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-500 hover-lift animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-full mr-3">
              <FontAwesomeIcon icon={faTimesCircle} className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600 animate-countUp">
                {logs.filter(log => log.level === 'ERROR').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500 hover-lift animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full mr-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success</p>
              <p className="text-2xl font-bold text-green-600 animate-countUp">
                {logs.filter(log => log.level === 'SUCCESS').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      <FontAwesomeIcon icon={getLevelIcon(log.level)} className="mr-1" />
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={log.details}>
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faDatabase} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Logs Found</h3>
            <p className="text-gray-500">No logs match your current filters.</p>
          </div>
        )}
      </Card>

      {/* Results Info */}
      {filteredLogs.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
      )}
    </div>
  );
};

export default Logs;