import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, faSave, faDatabase, faShield, faBell, faGlobe,
  faEnvelope, faServer, faKey, faUsers, faChartLine
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState({
    general: {
      system_name: 'Nova LBS',
      system_version: '1.0.0',
      maintenance_mode: false,
      max_libraries: 1000,
      default_trial_days: 30,
      support_email: 'support@novalbs.com'
    },
    security: {
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_lowercase: true,
      password_require_numbers: true,
      password_require_symbols: false,
      session_timeout: 24,
      max_login_attempts: 5,
      lockout_duration: 30
    },
    notifications: {
      email_notifications: true,
      license_expiry_alerts: true,
      system_alerts: true,
      maintenance_notifications: true,
      alert_days_before_expiry: 30
    },
    database: {
      backup_enabled: true,
      backup_frequency: 'daily',
      retention_days: 30,
      auto_cleanup: true
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: faCog },
    { id: 'security', name: 'Security', icon: faShield },
    { id: 'notifications', name: 'Notifications', icon: faBell },
    { id: 'database', name: 'Database', icon: faDatabase }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In real implementation, this would be an API call
      // await api.put('/api/v1/superadmin/settings/', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
          <input
            type="text"
            value={settings.general.system_name}
            onChange={(e) => handleSettingChange('general', 'system_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">System Version</label>
          <input
            type="text"
            value={settings.general.system_version}
            onChange={(e) => handleSettingChange('general', 'system_version', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
          <input
            type="email"
            value={settings.general.support_email}
            onChange={(e) => handleSettingChange('general', 'support_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Libraries</label>
          <input
            type="number"
            value={settings.general.max_libraries}
            onChange={(e) => handleSettingChange('general', 'max_libraries', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Trial Days</label>
          <input
            type="number"
            value={settings.general.default_trial_days}
            onChange={(e) => handleSettingChange('general', 'default_trial_days', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenance_mode"
          checked={settings.general.maintenance_mode}
          onChange={(e) => handleSettingChange('general', 'maintenance_mode', e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings.security.password_min_length}
            onChange={(e) => handleSettingChange('security', 'password_min_length', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
          <input
            type="number"
            min="1"
            max="168"
            value={settings.security.session_timeout}
            onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.security.max_login_attempts}
            onChange={(e) => handleSettingChange('security', 'max_login_attempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
          <input
            type="number"
            min="5"
            max="120"
            value={settings.security.lockout_duration}
            onChange={(e) => handleSettingChange('security', 'lockout_duration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Password Requirements</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_uppercase"
              checked={settings.security.password_require_uppercase}
              onChange={(e) => handleSettingChange('security', 'password_require_uppercase', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="require_uppercase" className="ml-2 block text-sm text-gray-900">
              Require uppercase letters
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_lowercase"
              checked={settings.security.password_require_lowercase}
              onChange={(e) => handleSettingChange('security', 'password_require_lowercase', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="require_lowercase" className="ml-2 block text-sm text-gray-900">
              Require lowercase letters
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_numbers"
              checked={settings.security.password_require_numbers}
              onChange={(e) => handleSettingChange('security', 'password_require_numbers', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="require_numbers" className="ml-2 block text-sm text-gray-900">
              Require numbers
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_symbols"
              checked={settings.security.password_require_symbols}
              onChange={(e) => handleSettingChange('security', 'password_require_symbols', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="require_symbols" className="ml-2 block text-sm text-gray-900">
              Require special symbols
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alert Days Before License Expiry</label>
          <input
            type="number"
            min="1"
            max="90"
            value={settings.notifications.alert_days_before_expiry}
            onChange={(e) => handleSettingChange('notifications', 'alert_days_before_expiry', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Notification Types</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email_notifications"
              checked={settings.notifications.email_notifications}
              onChange={(e) => handleSettingChange('notifications', 'email_notifications', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">
              Enable email notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="license_expiry_alerts"
              checked={settings.notifications.license_expiry_alerts}
              onChange={(e) => handleSettingChange('notifications', 'license_expiry_alerts', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="license_expiry_alerts" className="ml-2 block text-sm text-gray-900">
              License expiry alerts
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="system_alerts"
              checked={settings.notifications.system_alerts}
              onChange={(e) => handleSettingChange('notifications', 'system_alerts', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="system_alerts" className="ml-2 block text-sm text-gray-900">
              System alerts
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance_notifications"
              checked={settings.notifications.maintenance_notifications}
              onChange={(e) => handleSettingChange('notifications', 'maintenance_notifications', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenance_notifications" className="ml-2 block text-sm text-gray-900">
              Maintenance notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.database.backup_frequency}
            onChange={(e) => handleSettingChange('database', 'backup_frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
          <input
            type="number"
            min="7"
            max="365"
            value={settings.database.retention_days}
            onChange={(e) => handleSettingChange('database', 'retention_days', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="backup_enabled"
            checked={settings.database.backup_enabled}
            onChange={(e) => handleSettingChange('database', 'backup_enabled', e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="backup_enabled" className="ml-2 block text-sm text-gray-900">
            Enable automatic backups
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto_cleanup"
            checked={settings.database.auto_cleanup}
            onChange={(e) => handleSettingChange('database', 'auto_cleanup', e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="auto_cleanup" className="ml-2 block text-sm text-gray-900">
            Enable automatic cleanup of old data
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <FontAwesomeIcon icon={faDatabase} className="text-yellow-600 mr-3 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Database Maintenance</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Regular database maintenance helps ensure optimal performance. Consider scheduling maintenance during low-usage periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <div className="animate-slideInRight">
          <Button 
            onClick={handleSaveSettings} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 hover-lift"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <FontAwesomeIcon icon={faSave} className="mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg animate-slideInUp" style={{animationDelay: '0.1s'}}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover-lift ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{animationDelay: `${0.1 * index}s`}}
          >
            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <Card className="animate-slideInUp hover-lift" style={{animationDelay: '0.2s'}}>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'database' && renderDatabaseSettings()}
      </Card>
    </div>
  );
};

export default Settings;