import { useState } from 'react';
import { reportService } from '../../services/reportService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, faDownload, faCalendar, faUsers, faChartBar,
  faCheckCircle, faTimesCircle, faFileExcel, faTable
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getMonthlyAttendanceReport(month, year);
      setReportData(data);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData || !reportData.report) {
      toast.error('No data to download');
      return;
    }

    // Prepare CSV content
    const headers = ['Student Name', 'Seat Number', 'Attendance Days', 'Subscription Status'];
    const rows = reportData.report.map(row => [
      row.student_name,
      row.seat_number || 'N/A',
      row.attendance_days,
      row.subscription_status
    ]);

    // Create CSV string
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Add summary at the end
    csvContent += '\n';
    csvContent += `Report Generated: ${format(new Date(), 'MMM dd, yyyy hh:mm a')}\n`;
    csvContent += `Month: ${getMonthName(reportData.month)} ${reportData.year}\n`;
    csvContent += `Total Students: ${reportData.total_students}\n`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${reportData.month}_${reportData.year}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV downloaded successfully!');
  };

  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || monthNum;
  };

  const getStatusColor = (status) => {
    if (status === 'PAID') return 'bg-green-100 text-green-700';
    if (status === 'DUE') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'PAID') return faCheckCircle;
    if (status === 'DUE') return faTimesCircle;
    return faCalendar;
  };

  const calculateStats = () => {
    if (!reportData || !reportData.report) return null;

    const totalDays = reportData.report.reduce((sum, row) => sum + row.attendance_days, 0);
    const avgAttendance = totalDays / reportData.report.length;
    const paidCount = reportData.report.filter(r => r.subscription_status === 'PAID').length;
    const dueCount = reportData.report.filter(r => r.subscription_status === 'DUE').length;

    return {
      totalDays,
      avgAttendance: avgAttendance.toFixed(1),
      paidCount,
      dueCount,
      paidPercentage: ((paidCount / reportData.total_students) * 100).toFixed(1),
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Reports 📊</h1>
        <p className="text-indigo-100">Generate and download attendance reports</p>
      </div>

      {/* Report Generator Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-indigo-600" />
          Monthly Attendance Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-indigo-600" />
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-indigo-600" />
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="2024"
              min="2020"
              max="2030"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchMonthlyReport}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faChartBar} className="mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Report Results */}
      {!loading && reportData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FontAwesomeIcon icon={faUsers} className="text-3xl opacity-80" />
              </div>
              <h3 className="text-3xl font-bold">{reportData.total_students}</h3>
              <p className="text-blue-100 text-sm">Total Students</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FontAwesomeIcon icon={faChartBar} className="text-3xl opacity-80" />
              </div>
              <h3 className="text-3xl font-bold">{stats?.avgAttendance}</h3>
              <p className="text-purple-100 text-sm">Avg Attendance Days</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl opacity-80" />
              </div>
              <h3 className="text-3xl font-bold">{stats?.paidCount}</h3>
              <p className="text-green-100 text-sm">Paid Subscriptions</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FontAwesomeIcon icon={faTimesCircle} className="text-3xl opacity-80" />
              </div>
              <h3 className="text-3xl font-bold">{stats?.dueCount}</h3>
              <p className="text-red-100 text-sm">Due Payments</p>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTable} className="text-indigo-600" />
                  Attendance Report - {getMonthName(reportData.month)} {reportData.year}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated on {format(new Date(), 'MMM dd, yyyy hh:mm a')}
                </p>
              </div>
              <button
                onClick={downloadCSV}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Seat Number
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Attendance Days
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subscription Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.report.map((row, index) => (
                    <tr key={row.student_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{row.student_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {row.seat_number || (
                            <span className="text-gray-400 italic">No seat</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {row.attendance_days} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(row.subscription_status)}`}>
                          <FontAwesomeIcon 
                            icon={getStatusIcon(row.subscription_status)} 
                            className="mr-2"
                          />
                          {row.subscription_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {reportData.report.length} students</span>
                <span>Total Attendance Days: {stats?.totalDays}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !reportData && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FontAwesomeIcon icon={faFileAlt} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Report Generated</h3>
          <p className="text-gray-600 mb-4">
            Select a month and year, then click "Generate Report" to view attendance data
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
