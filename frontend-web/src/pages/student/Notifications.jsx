import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faEnvelope, faEnvelopeOpen, faCheck, faCheckDouble,
  faExclamationCircle, faInfoCircle, faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      const notifs = Array.isArray(data) ? data : (data.results || []);
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      toast.success('Marked as read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUBSCRIPTION':
        return faCalendar;
      case 'ATTENDANCE':
        return faCheck;
      case 'ALERT':
        return faExclamationCircle;
      default:
        return faInfoCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUBSCRIPTION':
        return 'from-purple-500 to-purple-600';
      case 'ATTENDANCE':
        return 'from-green-500 to-green-600';
      case 'ALERT':
        return 'from-red-500 to-red-600';
      default:
        return 'from-blue-500 to-blue-600';
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Notifications 🔔</h1>
        <p className="text-blue-100">Stay updated with important messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faBell} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
          <p className="text-blue-100 text-sm">Total</p>
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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
            <p className="text-gray-600">
              {filter === 'unread' && 'You have no unread notifications'}
              {filter === 'read' && 'You have no read notifications'}
              {filter === 'all' && 'You have no notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                !notif.is_read ? 'border-l-4 border-blue-500' : ''
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
                        {format(new Date(notif.created_at), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap">
                        New
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {notif.message}
                  </p>

                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
