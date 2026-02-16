import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LibraryFormModal from '../../components/LibraryFormModal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faUsers, faChair, faToggleOn, faToggleOff,
  faEye, faKey, faCalendarAlt, faExclamationTriangle,
  faCheckCircle, faMapMarkerAlt, faEnvelope, faPhone,
  faPlus, faEdit, faTrash, faSearch
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const Libraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libraryToDelete, setLibraryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    console.log('Libraries: Component mounted');
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      console.log('Libraries: Fetching libraries...');
      const response = await api.get('/api/v1/superadmin/libraries/');
      console.log('Libraries: Data received:', response.data);
      
      // Handle paginated response
      const librariesData = response.data.results || response.data;
      setLibraries(Array.isArray(librariesData) ? librariesData : []);
    } catch (error) {
      console.error('Libraries: Error fetching libraries:', error);
      toast.error('Failed to load libraries');
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLibraryStatus = async (libraryId) => {
    try {
      const response = await api.post(`/api/v1/superadmin/libraries/${libraryId}/toggle-status/`);
      toast.success(response.data.message);
      fetchLibraries(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update library status');
    }
  };

  const viewLibraryDetails = (library) => {
    setSelectedLibrary(library);
    setShowDetailsModal(true);
  };

  const handleCreateLibrary = () => {
    console.log('Create library button clicked');
    setEditingLibrary(null);
    setShowFormModal(true);
  };

  const handleEditLibrary = (library) => {
    setEditingLibrary(library);
    setShowFormModal(true);
  };

  const handleDeleteLibrary = (library) => {
    setLibraryToDelete(library);
    setShowDeleteModal(true);
  };

  const confirmDeleteLibrary = async () => {
    if (!libraryToDelete) return;

    try {
      await api.delete(`/api/v1/superadmin/libraries/${libraryToDelete.id}/`);
      toast.success('Library deleted successfully');
      fetchLibraries();
      setShowDeleteModal(false);
      setLibraryToDelete(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete library';
      toast.error(errorMessage);
    }
  };

  const handleFormSuccess = () => {
    fetchLibraries();
    setShowFormModal(false);
    setEditingLibrary(null);
  };

  // Filter libraries based on search and status
  const filteredLibraries = libraries.filter(library => {
    const matchesSearch = library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         library.library_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         library.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && library.is_active) ||
                         (statusFilter === 'INACTIVE' && !library.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        <FontAwesomeIcon 
          icon={isActive ? faCheckCircle : faExclamationTriangle} 
          className="mr-1" 
        />
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getLicenseStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800', icon: faKey },
      'TRIAL': { bg: 'bg-blue-100', text: 'text-blue-800', icon: faCalendarAlt },
      'EXPIRED': { bg: 'bg-red-100', text: 'text-red-800', icon: faExclamationTriangle },
      'SUSPENDED': { bg: 'bg-orange-100', text: 'text-orange-800', icon: faExclamationTriangle },
      'NO_LICENSE': { bg: 'bg-gray-100', text: 'text-gray-800', icon: faExclamationTriangle }
    };

    const config = statusConfig[status] || statusConfig['NO_LICENSE'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1" />
        {status === 'NO_LICENSE' ? 'No License' : status}
      </span>
    );
  };

  console.log('Libraries: Rendering, loading:', loading, 'libraries:', libraries.length);
  console.log('Libraries: handleCreateLibrary function exists:', typeof handleCreateLibrary === 'function');
  console.log('Libraries: showFormModal state:', showFormModal);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Ensure libraries is always an array
  const librariesArray = Array.isArray(filteredLibraries) ? filteredLibraries : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white animate-slideInUp">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faBuilding} className="text-2xl sm:text-3xl animate-bounce-slow" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Library Management</h1>
              <p className="text-blue-100 text-sm sm:text-base">Manage all registered libraries and their settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold animate-countUp">{libraries.length}</div>
              <div className="text-xs sm:text-sm text-blue-100">Total Libraries</div>
            </div>
            {/* Primary Add Button */}
            <Button
              onClick={handleCreateLibrary}
              variant="white"
              className="text-blue-600 hover:bg-blue-50 hover-lift font-semibold shadow-lg border-2 border-white transition-all duration-200"
              style={{ minWidth: '120px' }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Add Library</span>
            </Button>
          </div>
        </div>
        
        {/* Secondary Add Button for mobile - always visible */}
        <div className="mt-4 sm:hidden">
          <button
            onClick={handleCreateLibrary}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-3 rounded-lg shadow-lg border-2 border-white transition-all duration-200 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Library
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="animate-slideInUp hover-lift" style={{animationDelay: '0.1s'}}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Libraries</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="ALL">All Libraries</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Libraries</p>
              <p className="text-3xl font-bold text-green-600 animate-countUp">
                {libraries.filter(l => l.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Libraries</p>
              <p className="text-3xl font-bold text-red-600 animate-countUp">
                {libraries.filter(l => !l.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 animate-countUp">
                {libraries.reduce((sum, lib) => sum + (lib.total_students || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-3xl font-bold text-purple-600 animate-countUp">
                {libraries.reduce((sum, lib) => sum + (lib.total_seats || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <FontAwesomeIcon icon={faChair} className="text-2xl text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Libraries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {librariesArray.map((library, index) => (
          <Card key={library.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInUp" style={{animationDelay: `${0.1 * index}s`}}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <FontAwesomeIcon icon={faBuilding} className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{library.name}</h3>
                    <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
                      {library.library_id}
                    </p>
                  </div>
                </div>
                {getStatusBadge(library.is_active)}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-500" />
                  <span className="truncate">{library.owner}</span>
                </div>
                {library.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-500" />
                    <span>{library.phone}</span>
                  </div>
                )}
                {library.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                    <span className="truncate">{library.address}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600 mb-1" />
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-lg font-bold text-blue-600">
                    {library.active_students || 0}/{library.total_students || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <FontAwesomeIcon icon={faChair} className="text-2xl text-purple-600 mb-1" />
                  <p className="text-sm font-medium text-gray-600">Seats</p>
                  <p className="text-lg font-bold text-purple-600">
                    {library.occupied_seats || 0}/{library.total_seats || 0}
                  </p>
                </div>
              </div>

              {/* License Status */}
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">License:</span>
                {getLicenseStatusBadge(library.license_status)}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => viewLibraryDetails(library)}
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1" />
                  View
                </Button>
                <Button
                  onClick={() => handleEditLibrary(library)}
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-green-50 hover:border-green-300"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => toggleLibraryStatus(library.id)}
                  variant={library.is_active ? "danger" : "success"}
                  size="sm"
                  className="flex-1"
                >
                  <FontAwesomeIcon 
                    icon={library.is_active ? faToggleOff : faToggleOn} 
                    className="mr-1" 
                  />
                  {library.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex justify-center">
                <Button
                  onClick={() => handleDeleteLibrary(library)}
                  variant="danger"
                  size="sm"
                  className="hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Delete Library
                </Button>
              </div>

              {/* Registration Date */}
              <div className="text-xs text-gray-500 border-t pt-3">
                <div className="flex justify-between">
                  <span>Registered: {new Date(library.created_at).toLocaleDateString()}</span>
                  {library.last_login && (
                    <span>Last Login: {new Date(library.last_login).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {librariesArray.length === 0 && (
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Libraries Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'No libraries match your current filters.' 
                : 'No libraries have been registered yet.'
              }
            </p>
            {(!searchTerm && statusFilter === 'ALL') && (
              <Button
                onClick={handleCreateLibrary}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create First Library
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Library Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Library Details"
        size="lg"
      >
        {selectedLibrary && (
          <div className="space-y-6">
            {/* Library Header */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <FontAwesomeIcon icon={faBuilding} className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedLibrary.name}</h3>
                <p className="text-gray-600 font-mono bg-white px-2 py-1 rounded">{selectedLibrary.library_id}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusBadge(selectedLibrary.is_active)}
                  {getLicenseStatusBadge(selectedLibrary.license_status)}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Owner Email</p>
                      <p className="font-medium">{selectedLibrary.owner}</p>
                    </div>
                  </div>
                  {selectedLibrary.phone && (
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedLibrary.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedLibrary.address && (
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{selectedLibrary.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Activity</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Registration Date</p>
                    <p className="font-medium">{new Date(selectedLibrary.created_at).toLocaleString()}</p>
                  </div>
                  {selectedLibrary.last_login && (
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium">{new Date(selectedLibrary.last_login).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="font-semibold text-gray-900 border-b pb-2 mb-4">Library Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedLibrary.total_students || 0}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedLibrary.active_students || 0}</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedLibrary.total_seats || 0}</p>
                  <p className="text-sm text-gray-600">Total Seats</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{selectedLibrary.occupied_seats || 0}</p>
                  <p className="text-sm text-gray-600">Occupied Seats</p>
                </div>
              </div>
            </div>

            {/* License Information */}
            {selectedLibrary.license_expires && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">License Information</h4>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  {getLicenseStatusBadge(selectedLibrary.license_status)}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Expires:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(selectedLibrary.license_expires).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={() => toggleLibraryStatus(selectedLibrary.id)}
                variant={selectedLibrary.is_active ? 'danger' : 'success'}
                className="px-6 py-2"
              >
                <FontAwesomeIcon 
                  icon={selectedLibrary.is_active ? faToggleOff : faToggleOn} 
                  className="mr-2" 
                />
                {selectedLibrary.is_active ? 'Deactivate Library' : 'Activate Library'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Library Form Modal */}
      <LibraryFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingLibrary(null);
        }}
        library={editingLibrary}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Library"
        size="md"
      >
        {libraryToDelete && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <div className="p-2 bg-red-100 rounded-full">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Confirm Library Deletion</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                You are about to delete the following library:
              </p>
              <div className="font-medium text-gray-900">
                {libraryToDelete.name} ({libraryToDelete.library_id})
              </div>
              <div className="text-sm text-gray-600">
                Owner: {libraryToDelete.owner}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Warning:</p>
                  <p>This will deactivate the library instead of permanently deleting it. The library can be reactivated later if needed.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteLibrary}
                variant="danger"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Library
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Floating Action Button - Always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleCreateLibrary}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Add New Library"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Libraries;