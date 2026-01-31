import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUserGraduate, faEnvelope, faLock, faIdCard, faKey } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('owner'); // 'owner' or 'student'
  const [loading, setLoading] = useState(false);
  
  // Library Owner form data
  const [ownerData, setOwnerData] = useState({
    library_id: '',
    email: '',
    password: ''
  });
  
  // Student form data
  const [studentData, setStudentData] = useState({
    library_id: '',
    student_id: '',
    email: '',
    password: ''
  });

  const handleOwnerChange = (e) => {
    setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await authService.loginOwner(
        ownerData.library_id,
        ownerData.email,
        ownerData.password
      );
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await authService.loginStudent(
        studentData.library_id,
        studentData.student_id,
        studentData.email,
        studentData.password
      );
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Library Management System</h1>
          <p className="text-blue-100">Sign in to continue</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('owner')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'owner'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Library Owner
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'student'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FontAwesomeIcon icon={faUserGraduate} className="mr-2" />
            Student
          </button>
        </div>

        {/* Forms */}
        <div className="p-8">
          {activeTab === 'owner' ? (
            /* Library Owner Login Form */
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-600" />
                  Library ID
                </label>
                <input
                  type="text"
                  name="library_id"
                  value={ownerData.library_id}
                  onChange={handleOwnerChange}
                  placeholder="e.g., LIB000001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={ownerData.email}
                  onChange={handleOwnerChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-600" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={ownerData.password}
                  onChange={handleOwnerChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password?type=owner" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In as Owner'
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </div>
            </form>
          ) : (
            /* Student Login Form */
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-purple-600" />
                  Library ID
                </label>
                <input
                  type="text"
                  name="library_id"
                  value={studentData.library_id}
                  onChange={handleStudentChange}
                  placeholder="e.g., LIB000001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faIdCard} className="mr-2 text-purple-600" />
                  Student ID
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={studentData.student_id}
                  onChange={handleStudentChange}
                  placeholder="e.g., STU000001-0001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-600" />
                  Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={studentData.email}
                  onChange={handleStudentChange}
                  placeholder="your@email.com (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faLock} className="mr-2 text-purple-600" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={studentData.password}
                  onChange={handleStudentChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password?type=student" className="text-purple-600 hover:text-purple-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In as Student'
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <p className="text-xs text-gray-500">
                  <FontAwesomeIcon icon={faKey} className="mr-1" />
                  Contact your library admin for login credentials
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600 border-t">
          <p>© 2026 Library Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
