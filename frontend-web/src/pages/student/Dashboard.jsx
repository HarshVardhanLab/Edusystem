import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import { studySessionService } from '../../services/studySessionService';
import { quoteService } from '../../services/quoteService';
import { attendanceService } from '../../services/attendanceService';
import { subscriptionService } from '../../services/subscriptionService';
import { noteService } from '../../services/noteService';
import { taskService } from '../../services/taskService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, faCheck, faCreditCard, faFire, faStickyNote, faListCheck,
  faPlay, faPlus, faQrcode, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);
  const [stats, setStats] = useState({
    studyHours: 0,
    attendanceRate: 0,
    notesCount: 0,
    pendingTasks: 0,
    streak: 0,
    subscriptionStatus: 'N/A'
  });
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userData = getUser();
      setProfile(userData);

      // Fetch quote
      try {
        const quoteRes = await quoteService.getDailyQuote();
        setQuote(quoteRes.data);
      } catch (error) {
        console.log('Quote service not available:', error);
      }

      // Fetch study stats
      try {
        const studyStatsRes = await studySessionService.getStats('week');
        const studyHours = studyStatsRes?.data?.total_hours || 0;
        setStats(prev => ({ ...prev, studyHours }));
        
        if (studyStatsRes?.data?.daily_breakdown) {
          setStudyData(studyStatsRes.data.daily_breakdown);
        }
      } catch (error) {
        console.log('Study stats not available:', error);
      }

      // Fetch attendance
      try {
        const attendanceRes = await attendanceService.getAttendance();
        const attendanceData = attendanceRes.data.results || attendanceRes.data || [];
        const attendanceRate = attendanceData.length > 0 ? 85 : 0;
        setStats(prev => ({ ...prev, attendanceRate }));
      } catch (error) {
        console.log('Attendance not available:', error);
      }

      // Fetch subscriptions
      try {
        const subscriptionsRes = await subscriptionService.getSubscriptions();
        const subscriptions = subscriptionsRes.data.results || subscriptionsRes.data || [];
        const activeSubscription = subscriptions.find(s => s.is_active);
        const subscriptionStatus = activeSubscription ? activeSubscription.fee_status : 'N/A';
        setStats(prev => ({ ...prev, subscriptionStatus }));
      } catch (error) {
        console.log('Subscriptions not available:', error);
      }

      // Fetch notes
      try {
        const notesRes = await noteService.getNotes();
        const notesCount = notesRes.data.results?.length || notesRes.data.length || 0;
        setStats(prev => ({ ...prev, notesCount }));
      } catch (error) {
        console.log('Notes not available:', error);
      }

      // Fetch tasks
      try {
        const tasksRes = await taskService.getTasks({ is_completed: false });
        const pendingTasks = tasksRes.data.results?.length || tasksRes.data.length || 0;
        setStats(prev => ({ ...prev, pendingTasks }));
      } catch (error) {
        console.log('Tasks not available:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Some dashboard data could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Welcome Section with Quote */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name}! 👋</h1>
        <p className="text-purple-100 mb-4">Student ID: {profile?.student_id} • {profile?.library_name}</p>
        
        {quote && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4 border border-white/20">
            <p className="text-lg italic mb-2">"{quote.quote}"</p>
            <p className="text-sm text-purple-200">— {quote.author}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Hours */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faClock} className="text-3xl opacity-80" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">This Week</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.studyHours}h</h3>
          <p className="text-blue-100 text-sm">Study Time</p>
        </div>

        {/* Attendance */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCheck} className="text-3xl opacity-80" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Rate</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.attendanceRate}%</h3>
          <p className="text-green-100 text-sm">Attendance</p>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faFire} className="text-3xl opacity-80" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Days</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.streak}</h3>
          <p className="text-orange-100 text-sm">Current Streak</p>
        </div>

        {/* Subscription */}
        <div className={`bg-gradient-to-br ${stats.subscriptionStatus === 'PAID' ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform`}>
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCreditCard} className="text-3xl opacity-80" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Status</span>
          </div>
          <h3 className="text-2xl font-bold">{stats.subscriptionStatus}</h3>
          <p className="text-purple-100 text-sm">Subscription</p>
        </div>
      </div>

      {/* Study Time Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-600" />
            Study Time Trend
          </h2>
          <span className="text-sm text-gray-500">Last 7 Days</span>
        </div>
        
        {studyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faChartLine} className="text-5xl mb-3 opacity-50" />
            <p>No study data yet. Start your first session!</p>
          </div>
        )}
      </div>

      {/* Quick Actions & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/student/timer" className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faPlay} className="text-white" />
                </div>
                <span className="font-semibold text-gray-800">Start Study Timer</span>
              </div>
              <span className="text-blue-600">→</span>
            </Link>

            <Link to="/student/qr-attendance" className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faQrcode} className="text-white" />
                </div>
                <span className="font-semibold text-gray-800">Mark Attendance</span>
              </div>
              <span className="text-green-600">→</span>
            </Link>

            <Link to="/student/notes" className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faPlus} className="text-white" />
                </div>
                <span className="font-semibold text-gray-800">Add New Note</span>
              </div>
              <span className="text-purple-600">→</span>
            </Link>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faStickyNote} className="text-yellow-500 text-xl mr-3" />
                <span className="text-gray-700">Notes Created</span>
              </div>
              <span className="font-bold text-gray-900">{stats.notesCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faListCheck} className="text-blue-500 text-xl mr-3" />
                <span className="text-gray-700">Pending Tasks</span>
              </div>
              <span className="font-bold text-gray-900">{stats.pendingTasks}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="text-purple-500 text-xl mr-3" />
                <span className="text-gray-700">Avg. Session</span>
              </div>
              <span className="font-bold text-gray-900">50 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
