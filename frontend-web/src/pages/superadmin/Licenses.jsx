import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, faPlus, faEdit, faTrash, faCalendarAlt, faBuilding,
  faExclamationTriangle, faCheckCircle, faClock, faBan, faRocket,
  faUsers, faChair
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [formData, setFormData] = useState({
    library: '',
    license_key: '',
    status: 'TRIAL',
    max_students: 100,
    max_seats: 50,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    console.log('Licenses: Component mounted');
    fetchLicenses();
    fetchLibraries();
  }, []);

  const fetchLicenses = async () => {
    try {
      console.log('Licenses: Fetching licenses...');
      const response = await api.get('/api/v1/superadmin/licenses/');
      console.log('Licenses: Data received:', response.data);
      
      // Handle paginated response
      const licensesData = response.data.results || response.data;
      setLicenses(Array.isArray(licensesData) ? licensesData : []);
    } catch (error) {
      console.error('Licenses: Error fetching licenses:', error);
      toast.error('Failed to load licenses');
      // Set empty array to prevent white screen
      setLicenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraries = async () => {
    try {
      const response = await api.get('/api/v1/superadmin/libraries/');
      console.log('Licenses: Libraries data received:', response.data);
      
      // Handle paginated response
      const librariesData = response.data.results || response.data;
      setLibraries(Array.isArray(librariesData) ? librariesData : []);
    } catch (error) {
      console.error('Licenses: Error fetching libraries:', error);
      toast.error('Failed to load libraries');
      setLibraries([]);
    }
  };

  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateLicense = () => {
    console.log('Create license button clicked');
    setFormData({
      library: '',
      license_key: generateLicenseKey(),
      status: 'TRIAL',
      max_students: 100,
      max_seats: 50,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowCreateModal(true);
  };

  const handleEditLicense = (license) => {
    setSelectedLicense(license);
    setFormData({
      library: license.library,
      license_key: license.license_key,
      status: license.status,
      max_students: license.max_students,
      max_seats: license.max_seats,
      start_date: license.start_date.split('T')[0],
      end_date: license.end_date.split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      if (selectedLicense) {
        await api.put(`/api/v1/superadmin/licenses/${selectedLicense.id}/`, payload);
        toast.success('License updated successfully');
      } else {
        await api.post('/api/v1/superadmin/licenses/', payload);
        toast.success('License created successfully');
      }

      setShowCreateModal(false);
      setShowEditModal(false);
      fetchLicenses();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save license');
    }
  };

  const handleDeleteLicense = async (licenseId) => {
    if (!confirm('Are you sure you want to delete this license?')) return;

    try {
      await api.delete(`/api/v1/superadmin/licenses/${licenseId}/`);
      toast.success('License deleted successfully');
      fetchLicenses();
    } catch (error) {
      toast.error('Failed to delete license');
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'ACTIVE': faCheckCircle,
      'TRIAL': faClock,
      'EXPIRED': faExclamationTriangle,
      'SUSPENDED': faBan
    };
    return icons[status] || faKey;
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'text-green-600 bg-green-100',
      'TRIAL': 'text-blue-600 bg-blue-100',
      'EXPIRED': 'text-red-600 bg-red-100',
      'SUSPENDED': 'text-orange-600 bg-orange-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'TRIAL', label: 'Trial' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ];

  console.log('Licenses: Rendering, loading:', loading, 'licenses:', licenses.length);
  console.log('Licenses: handleCreateLicense function exists:', typeof handleCreateLicense === 'function');
  console.log('Licenses: showCreateModal state:', showCreateModal);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Ensure licenses is always an array
  const licensesArray = Array.isArray(licenses) ? licenses : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 sm:p-6 text-white animate-slideInUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faKey} className="text-2xl sm:text-3xl animate-bounce-slow" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">License Management</h1>
              <p className="text-green-100 text-sm sm:text-base">Manage library licenses and permissions</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold animate-countUp">{licensesArray.length}</div>
              <div className="text-xs sm:text-sm text-green-100">Total Licenses</div>
            </div>
            <Button 
              onClick={handleCreateLicense} 
              variant="white"
              className="text-green-600 hover:bg-green-50 font-semibold shadow-lg border-2 border-white transition-all duration-200 hover-lift"
              style={{ minWidth: '140px' }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create License
            </Button>
          </div>
        </div>
        
        {/* Secondary Create Button for mobile - always visible */}
        <div className="mt-4 sm:hidden">
          <button
            onClick={handleCreateLicense}
            className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-3 rounded-lg shadow-lg border-2 border-white transition-all duration-200 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New License
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Licenses</p>
              <p className="text-3xl font-bold text-green-600 animate-countUp">
                {licensesArray.filter(l => l.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Licenses</p>
              <p className="text-3xl font-bold text-blue-600 animate-countUp">
                {licensesArray.filter(l => l.status === 'TRIAL').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FontAwesomeIcon icon={faRocket} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Licenses</p>
              <p className="text-3xl font-bold text-red-600 animate-countUp">
                {licensesArray.filter(l => l.status === 'EXPIRED').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Licenses</p>
              <p className="text-3xl font-bold text-orange-600 animate-countUp">{licensesArray.length}</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <FontAwesomeIcon icon={faKey} className="text-2xl text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Licenses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {licensesArray.map((license, index) => (
          <Card key={license.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInUp" style={{animationDelay: `${0.1 * index}s`}}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FontAwesomeIcon icon={faBuilding} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{license.library_name}</h3>
                    <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {license.license_key}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(license.status)} className="mr-1" />
                  {license.status}
                </span>
              </div>

              {/* License Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                    Max Students:
                  </span>
                  <span className="font-medium">{license.max_students}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faChair} className="mr-2 text-purple-500" />
                    Max Seats:
                  </span>
                  <span className="font-medium">{license.max_seats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-500" />
                    Days Remaining:
                  </span>
                  <span className={`font-medium ${license.days_remaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                    {license.is_expired ? 'Expired' : `${license.days_remaining} days`}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Start Date</span>
                  <span>End Date</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>{new Date(license.start_date).toLocaleDateString()}</span>
                  <span>{new Date(license.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditLicense(license)}
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteLicense(license.id)}
                  variant="danger"
                  size="sm"
                  className="flex-1"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {licensesArray.length === 0 && (
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-4xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Licenses Found</h3>
            <p className="text-gray-500 mb-6">Create your first license to get started with managing library access.</p>
            <Button 
              onClick={handleCreateLicense} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Your First License
            </Button>
          </div>
        </Card>
      )}

      {/* Create/Edit License Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedLicense(null);
        }}
        title={selectedLicense ? 'Edit License' : 'Create New License'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Library</label>
              <select
                value={formData.library}
                onChange={(e) => setFormData({ ...formData, library: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Library</option>
                {Array.isArray(libraries) ? libraries.map((library) => (
                  <option key={library.id} value={library.id}>
                    {library.name} ({library.library_id})
                  </option>
                )) : null}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Key</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.license_key}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono bg-gray-50"
                placeholder="License key will be generated automatically"
              />
              <Button
                type="button"
                onClick={() => setFormData({ ...formData, license_key: generateLicenseKey() })}
                variant="outline"
                className="px-4 py-3"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
              <input
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats</label>
              <input
                type="number"
                value={formData.max_seats}
                onChange={(e) => setFormData({ ...formData, max_seats: parseInt(e.target.value) })}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedLicense(null);
              }}
              className="px-6 py-3"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {selectedLicense ? 'Update License' : 'Create License'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Floating Action Button - Always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleCreateLicense}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Create New License"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Licenses;