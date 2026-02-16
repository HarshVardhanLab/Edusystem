import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faUserShield, faBuilding, faUserGraduate, faSearch,
  faFilter, faEye, faEdit, faBan, faCheckCircle, faPlus, faCrown
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch different types of users
      const [librariesResponse] = await Promise.all([
        api.get('/api/v1/superadmin/libraries/'),
        // Note: We don't fetch students directly as Super Admin doesn't have access
        // Students are managed by individual library owners
      ]);

      // Combine and format users
      const libraryOwners = librariesResponse.data.results ? librariesResponse.data.results.map(library => ({
        id: `lib_${library.id}`,
        name: library.name,
        email: library.owner,
        role: 'LIBRARY_OWNER',
        status: library.is_active ? 'ACTIVE' : 'INACTIVE',
        library_id: library.library_id,
        created_at: library.created_at,
        last_login: library.last_login,
        type: 'library'
      })) : [];

      // Add system stats for student counts (from dashboard data)
      try {
        const statsResponse = await api.get('/api/v1/superadmin/stats/');
        const totalStudents = statsResponse.data.students?.total || 0;
        const activeStudents = statsResponse.data.students?.active || 0;
        
        // Add a summary entry for students (not individual students)
        if (totalStudents > 0) {
          libraryOwners.push({
            id: 'students_summary',
            name: `${totalStudents} Students Across All Libraries`,
            email: `${activeStudents} Active Students`,
            role: 'STUDENT_SUMMARY',
            status: 'ACTIVE',
            library_id: 'System Wide',
            created_at: new Date().toISOString(),
            last_login: null,
            type: 'summary'
          });
        }
      } catch (statsError) {
        console.warn('Could not fetch student stats:', statsError);
      }

      setUsers(libraryOwners);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserStatus = async (user) => {
    try {
      if (user.type === 'library') {
        const libraryId = user.id.replace('lib_', '');
        await api.post(`/api/v1/superadmin/libraries/${libraryId}/toggle-status/`);
        toast.success(`Library ${user.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleIcon = (role) => {
    const icons = {
      'SUPER_ADMIN': faCrown,
      'LIBRARY_OWNER': faBuilding,
      'STUDENT': faUserGraduate
    };
    return icons[role] || faUsers;
  };

  const getRoleBadge = (role) => {
    const badges = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800',
      'LIBRARY_OWNER': 'bg-blue-100 text-blue-800',
      'STUDENT': 'bg-green-100 text-green-800'
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="animate-slideInLeft">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Users</h1>
          <p className="text-gray-600">Manage all system users and their permissions</p>
        </div>
        <div className="animate-slideInRight">
          <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700 hover-lift">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="animate-slideInUp hover-lift" style={{animationDelay: '0.1s'}}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="LIBRARY_OWNER">Library Owner</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              variant="outline"
              className="w-full hover-lift"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="animate-slideInUp hover-lift" style={{animationDelay: '0.2s'}}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200" style={{animationDelay: `${0.1 * index}s`}}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                          <FontAwesomeIcon icon={getRoleIcon(user.role)} className="text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.library_id && (
                          <div className="text-xs text-gray-400">{user.library_id}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)} transition-all duration-200 hover:scale-105`}>
                      <FontAwesomeIcon icon={getRoleIcon(user.role)} className="mr-1" />
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)} transition-all duration-200 hover:scale-105`}>
                      <FontAwesomeIcon 
                        icon={user.status === 'ACTIVE' ? faCheckCircle : faBan} 
                        className="mr-1" 
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      onClick={() => viewUserDetails(user)}
                      variant="outline"
                      size="sm"
                      className="hover-lift"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => toggleUserStatus(user)}
                      variant={user.status === 'ACTIVE' ? 'danger' : 'success'}
                      size="sm"
                      className="hover-lift"
                    >
                      <FontAwesomeIcon 
                        icon={user.status === 'ACTIVE' ? faBan : faCheckCircle} 
                        className="mr-1" 
                      />
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300 mb-4 animate-pulse-slow" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-500">No users match your current filters.</p>
          </div>
        )}
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center">
                <FontAwesomeIcon icon={getRoleIcon(selectedUser.role)} className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
              </div>
              {selectedUser.library_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Library ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.library_id}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Created Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Login</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={() => toggleUserStatus(selectedUser)}
                variant={selectedUser.status === 'ACTIVE' ? 'danger' : 'success'}
              >
                <FontAwesomeIcon 
                  icon={selectedUser.status === 'ACTIVE' ? faBan : faCheckCircle} 
                  className="mr-2" 
                />
                {selectedUser.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faUserShield} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Creation</h3>
          <p className="text-gray-500 mb-4">
            User creation functionality would be implemented here based on your specific requirements.
          </p>
          <p className="text-sm text-gray-400">
            This could include creating Super Admins, Library Owners, or other system users.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Users;