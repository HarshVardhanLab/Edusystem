import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle, faBuilding, faIdCard } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'owner'; // 'owner' or 'student'
  const [email, setEmail] = useState('');
  const [libraryId, setLibraryId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      // await authService.forgotPassword(email, libraryId, studentId, userType);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${
          userType === 'owner' 
            ? 'from-blue-600 to-blue-700' 
            : 'from-purple-600 to-purple-700'
        } text-white p-6 text-center`}>
          <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
          <p className="text-sm opacity-90">
            {userType === 'owner' ? 'Library Owner' : 'Student'} Password Reset
          </p>
        </div>

        <div className="p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600 text-sm mb-6">
                Enter your details below and we'll send you instructions to reset your password.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faBuilding} className={`mr-2 ${
                    userType === 'owner' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                  Library ID
                </label>
                <input
                  type="text"
                  value={libraryId}
                  onChange={(e) => setLibraryId(e.target.value)}
                  placeholder="e.g., LIB000001"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    userType === 'owner' ? 'focus:ring-blue-500' : 'focus:ring-purple-500'
                  } transition-all`}
                />
              </div>

              {userType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FontAwesomeIcon icon={faIdCard} className="mr-2 text-purple-600" />
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g., STU000001-0001"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className={`mr-2 ${
                    userType === 'owner' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    userType === 'owner' ? 'focus:ring-blue-500' : 'focus:ring-purple-500'
                  } transition-all`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${
                  userType === 'owner'
                    ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                } text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>

              <Link
                to="/login"
                className={`flex items-center justify-center text-sm ${
                  userType === 'owner' ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'
                } font-medium mt-4`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Login
              </Link>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                userType === 'owner' ? 'bg-blue-100' : 'bg-purple-100'
              } mb-4`}>
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className={`text-3xl ${userType === 'owner' ? 'text-blue-600' : 'text-purple-600'}`} 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link
                to="/login"
                className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${
                  userType === 'owner'
                    ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                } text-white rounded-lg font-semibold transition-all transform hover:scale-105`}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Login
              </Link>
            </div>
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

export default ForgotPassword;
