import { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard, faCalendar, faCheckCircle, faExclamationCircle, 
  faMoneyBill, faClock, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { format, differenceInDays } from 'date-fns';

const StudentSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionService.getSubscriptions();
      const subs = data.results || data || [];
      setSubscriptions(subs);
      
      // Find active subscription
      const active = subs.find(s => s.is_active);
      setActiveSubscription(active);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };



  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">My Subscription 💳</h1>
        <p className="text-purple-100">Manage your library subscription</p>
      </div>

      {/* Active Subscription */}
      {activeSubscription ? (
        <div className={`bg-gradient-to-br ${
          activeSubscription.fee_status === 'PAID' 
            ? 'from-green-500 to-green-600' 
            : 'from-red-500 to-red-600'
        } rounded-xl shadow-lg p-8 text-white`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Active Subscription</h2>
              <p className="text-white/80">Your current plan details</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCreditCard} className="text-3xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faMoneyBill} className="text-2xl" />
                <span className="text-sm opacity-80">Amount</span>
              </div>
              <p className="text-3xl font-bold">₹{activeSubscription.fee_amount}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faClock} className="text-2xl" />
                <span className="text-sm opacity-80">Days Remaining</span>
              </div>
              <p className="text-3xl font-bold">{getDaysRemaining(activeSubscription.end_date)} days</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-2xl" />
                <span className="text-sm opacity-80">Start Date</span>
              </div>
              <p className="text-xl font-semibold">
                {format(new Date(activeSubscription.start_date), 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-2xl" />
                <span className="text-sm opacity-80">End Date</span>
              </div>
              <p className="text-xl font-semibold">
                {format(new Date(activeSubscription.end_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className={`px-6 py-3 rounded-full font-bold text-lg ${
              activeSubscription.fee_status === 'PAID' 
                ? 'bg-white text-green-600' 
                : 'bg-white text-red-600'
            }`}>
              <FontAwesomeIcon icon={
                activeSubscription.fee_status === 'PAID' ? faCheckCircle : faExclamationCircle
              } className="mr-2" />
              {activeSubscription.fee_status === 'PAID' ? 'Paid' : 'Payment Due'}
            </span>
            
            {getDaysRemaining(activeSubscription.end_date) <= 7 && (
              <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-semibold">
                ⚠️ Expiring Soon
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FontAwesomeIcon icon={faCreditCard} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">You don't have an active subscription</p>
          <p className="text-sm text-gray-500">Contact your library admin to subscribe</p>
        </div>
      )}

      {/* Subscription History */}
      {subscriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-purple-600" />
            Subscription History
          </h2>
          
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`p-4 rounded-lg border-2 ${
                  sub.is_active 
                    ? 'border-purple-200 bg-purple-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      sub.fee_status === 'PAID' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <FontAwesomeIcon 
                        icon={sub.fee_status === 'PAID' ? faCheckCircle : faExclamationCircle}
                        className={sub.fee_status === 'PAID' ? 'text-green-600' : 'text-red-600'}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">₹{sub.fee_amount}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(sub.start_date), 'MMM dd')} - {format(new Date(sub.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      sub.fee_status === 'PAID' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.fee_status}
                    </span>
                    {sub.is_active && (
                      <p className="text-xs text-purple-600 font-semibold mt-1">Active</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Need Help?</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Contact library admin for subscription renewal</li>
          <li>• Payment can be made at the library counter</li>
          <li>• Keep your subscription active to access library facilities</li>
          <li>• You'll receive notifications before subscription expires</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentSubscription;
