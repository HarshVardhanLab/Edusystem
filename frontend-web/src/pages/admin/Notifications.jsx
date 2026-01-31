import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { studentService } from '../../services/studentService';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faPlus, faEnvelope, faEnvelopeOpen, faUsers,
  faExclamationCircle, faInfoCircle, faCalendar, faMoneyBill,
  faBullhorn, faTrash, faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    student: '',
    notification_type: 'ANNOUNCEMENT',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifsData, studentsData] = await Promise.all([
        notificationService.getNotifications(),
        studentService.getStudents()
      ]);
      
      const notifs = Array.isArray(notifsData) ? notifsData : (notifsData.results || []);
      const studs = Array.isArray(studentsData) ? studentsData : (studentsData.results || []);
      
      setNotifications(notifs);
      setStudents(studs);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    
    if (!formData.student || !formData.title || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await notificationService.createNotification(formData);
      toast.success('Notification sent successfully!');
      setShowCreateModal(false);
      setFormData({
        student: '',
        notification_type: 'ANNOUNCEMENT',
        title: '',
        message: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchData();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'SUBSCRIPTION_EXPIRY':
        return faCalendar;
      case 'FEE_DUE':
        return faMoneyBill;
      case 'ANNOUNCEMENT':
        return faBullhorn;
      default:
        return faInfoCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'SUBSCRIPTION_EXPIRY':
        return 'from-orange-500 to-orange-600';
      case 'FEE_DUE':
        return 'from-red-500 to-red-600';
      case 'ANNOUNCEMENT':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    read: notifications.filter(n => n.is_read).length,
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications 🔔</h1>
            <p className="text-purple-100">Send and manage student notifications</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faBell} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total Sent</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.unread}</h3>
          <p className="text-orange-100 text-sm">Unread</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faEnvelopeOpen} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.read}</h3>
          <p className="text-green-100 text-sm">Read</p>
        </div>
      </div>

      {/* Filter Tabs & Actions */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread ({stats.unread})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'read'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Read ({stats.read})
            </button>
          </div>
          
          {stats.unread > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faBell} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'unread' && 'All notifications have been read'}
              {filter === 'read' && 'No read notifications'}
              {filter === 'all' && 'No notifications sent yet'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Send First Notification
            </button>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                !notif.is_read ? 'border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex items-start gap-4 p-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getNotificationColor(notif.notification_type)} flex items-center justify-center flex-shrink-0`}>
                  <FontAwesomeIcon 
                    icon={getNotificationIcon(notif.notification_type)} 
                    className="text-white text-xl"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {notif.title || notif.notification_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        To: {notif.student_name} • {format(new Date(notif.created_at), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notif.is_read ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold whitespace-nowrap">
                          Unread
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Notification Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Send Notification"
      >
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-600" />
              Select Student *
            </label>
            <select
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} ({student.student_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon icon={faBell} className="mr-2 text-purple-600" />
              Notification Type *
            </label>
            <select
              value={formData.notification_type}
              onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="ANNOUNCEMENT">📢 Announcement</option>
              <option value="SUBSCRIPTION_EXPIRY">📅 Subscription Expiry</option>
              <option value="FEE_DUE">💰 Fee Due</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter notification title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              placeholder="Enter notification message"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" />
              Send Notification
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notifications;
