import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, faCalendar, faChartLine, faClock, faFire
} from '@fortawesome/free-solid-svg-icons';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    percentage: 0,
    streak: 0
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await attendanceService.getAttendance();
      const records = Array.isArray(data) ? data : (data.results || []);
      setAttendance(records);
      
      // Calculate stats
      const total = records.length;
      const today = new Date();
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      const thisMonth = records.filter(r => {
        const date = new Date(r.date);
        return date >= monthStart && date <= monthEnd;
      }).length;
      
      // Simple percentage calculation (assuming 30 days in month)
      const percentage = Math.round((thisMonth / 30) * 100);
      
      setStats({
        total,
        thisMonth,
        percentage: Math.min(percentage, 100),
        streak: 3 // TODO: Calculate actual streak
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data (last 7 days)
  const chartData = attendance.length > 0 
    ? attendance.slice(0, 7).reverse().map(record => {
        try {
          return {
            date: format(new Date(record.date), 'MMM dd'),
            present: 1 // If record exists, student was present
          };
        } catch (error) {
          console.error('Error formatting date:', error, record);
          return {
            date: 'Invalid',
            present: 0
          };
        }
      })
    : [];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Attendance History 📅</h1>
        <p className="text-green-100">Track your attendance record</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCalendar} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Days</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faCheck} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.thisMonth}</h3>
          <p className="text-green-100 text-sm">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.percentage}%</h3>
          <p className="text-purple-100 text-sm">Attendance Rate</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faFire} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.streak}</h3>
          <p className="text-orange-100 text-sm">Day Streak</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="present" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Records</h2>
        
        {attendance.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faCalendar} className="text-5xl mb-3 opacity-50" />
            <p>No attendance records</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendance.map((record, index) => {
              try {
                return (
                  <div
                    key={record.id || index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                        <FontAwesomeIcon 
                          icon={faCheck} 
                          className="text-green-600"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {format(new Date(record.date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FontAwesomeIcon icon={faClock} />
                          {record.check_in_time 
                            ? format(new Date(`2000-01-01T${record.check_in_time}`), 'hh:mm a')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-full font-semibold bg-green-100 text-green-700">
                      {record.attendance_type === 'QR_CODE' ? '📱 QR Code' : '✍️ Manual'}
                    </span>
                  </div>
                );
              } catch (error) {
                console.error('Error rendering attendance record:', error, record);
                return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
