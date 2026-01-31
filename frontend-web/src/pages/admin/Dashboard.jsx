import { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserCheck, faUserTimes, faCreditCard, faExclamationTriangle, faMoneyBillWave, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await reportService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} />;

  // Format date for graph
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare earnings data for bar chart
  const earningsData = [
    { name: 'Total Earnings', amount: stats?.total_earnings || 0, fill: '#10b981' },
    { name: 'Monthly Earnings', amount: stats?.monthly_earnings || 0, fill: '#3b82f6' },
    { name: 'Total Dues', amount: stats?.total_dues || 0, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.total_students || 0}</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{stats?.present_today || 0}</p>
            </div>
            <FontAwesomeIcon icon={faUserCheck} className="text-4xl text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Absent Today</p>
              <p className="text-3xl font-bold text-red-600">{stats?.absent_today || 0}</p>
            </div>
            <FontAwesomeIcon icon={faUserTimes} className="text-4xl text-red-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.active_subscriptions || 0}</p>
            </div>
            <FontAwesomeIcon icon={faCreditCard} className="text-4xl text-yellow-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              <p className="text-4xl font-bold">₹{stats?.total_earnings?.toLocaleString() || 0}</p>
              <p className="text-green-100 text-xs mt-2">All time revenue</p>
            </div>
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-5xl text-white opacity-30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Monthly Earnings</p>
              <p className="text-4xl font-bold">₹{stats?.monthly_earnings?.toLocaleString() || 0}</p>
              <p className="text-blue-100 text-xs mt-2">This month's revenue</p>
            </div>
            <FontAwesomeIcon icon={faChartLine} className="text-5xl text-white opacity-30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Dues</p>
              <p className="text-4xl font-bold">₹{stats?.total_dues?.toLocaleString() || 0}</p>
              <p className="text-red-100 text-xs mt-2">{stats?.fee_due_count || 0} pending payments</p>
            </div>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-white opacity-30" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Graph */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-600" />
            Attendance Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.attendance_graph || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
              />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value) => [`${value} students`, 'Present']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Earnings Bar Chart */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />
            Financial Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {earningsData.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="amount" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Unpaid Students & Attendance Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Students */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-red-600" />
            Unpaid Students
          </h3>
          {stats?.unpaid_students?.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.unpaid_students.map((student, index) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                      <p className="text-xs text-gray-500">{student.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">₹{student.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(student.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faUserCheck} className="text-5xl mb-3 text-green-500" />
              <p>All payments are up to date!</p>
            </div>
          )}
        </Card>

        {/* Attendance Leaderboard */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="mr-2 text-yellow-600" />
            Attendance Leaderboard (This Month)
          </h3>
          {stats?.attendance_leaderboard?.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.attendance_leaderboard.map((student, index) => (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    index === 0 ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' :
                    index === 1 ? 'bg-gray-50 border-gray-300 hover:bg-gray-100' :
                    index === 2 ? 'bg-orange-50 border-orange-300 hover:bg-orange-100' :
                    'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">Seat: {student.seat_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{student.attendance_days}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faTrophy} className="text-5xl mb-3 text-gray-400" />
              <p>No attendance data yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm font-medium">Expiring in 7 Days</p>
          <p className="text-3xl font-bold text-orange-600">{stats?.expiring_in_7_days || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Subscriptions need renewal</p>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Available Seats</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.available_seats || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Out of {stats?.total_seats || 0} total seats</p>
        </Card>

        <Card className="bg-pink-50 border-l-4 border-pink-500">
          <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
          <p className="text-3xl font-bold text-pink-600">
            {stats?.total_students > 0 
              ? Math.round((stats.present_today / stats.total_students) * 100) 
              : 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Today's attendance</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
