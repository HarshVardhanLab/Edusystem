import { useState, useEffect } from 'react';
import { getUser } from '../../utils/auth';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faIdCard, faCalendar, 
  faGraduationCap, faMapMarkerAlt, faUserCircle, faMale,
  faFemale, faBook, faSchool, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: 0,
    studyHours: 0,
    activeDays: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get user data from localStorage
      const userData = getUser();
      setProfile(userData);
      
      // TODO: Fetch additional stats from API
      setStats({
        attendance: 85,
        studyHours: 120,
        activeDays: 45,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender) => {
    if (gender === 'MALE') return faMale;
    if (gender === 'FEMALE') return faFemale;
    return faUser;
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">My Profile 👤</h1>
        <p className="text-indigo-100">View and manage your information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserCircle} className="text-white text-6xl" />
                </div>
              </div>
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-gray-800">{profile?.full_name}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faIdCard} />
                  {profile?.student_id}
                </p>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all mb-2">
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">{stats.attendance}%</h3>
              <p className="text-green-100 text-sm">Attendance Rate</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">{stats.studyHours}h</h3>
              <p className="text-blue-100 text-sm">Study Hours</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-3xl font-bold">{stats.activeDays}</h3>
              <p className="text-purple-100 text-sm">Active Days</p>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{profile?.email || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={getGenderIcon(profile?.gender)} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800">{profile?.gender || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-semibold text-gray-800">
                      {profile?.date_of_birth 
                        ? format(new Date(profile.date_of_birth), 'MMM dd, yyyy')
                        : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-gray-800">{profile?.address || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational & Library Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-purple-600" />
                Educational Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faBook} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Preparing For</p>
                    <p className="font-semibold text-gray-800">{profile?.preparing_for || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Education Level</p>
                    <p className="font-semibold text-gray-800">{profile?.education_level || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faSchool} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-semibold text-gray-800">{profile?.institution_name || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faBook} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="font-semibold text-gray-800">{profile?.qualification || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4 mt-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faSchool} className="text-green-600" />
                Library Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faSchool} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Library Name</p>
                    <p className="font-semibold text-gray-800">{profile?.library_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faIdCard} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Library ID</p>
                    <p className="font-semibold text-gray-800">{profile?.library_id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faIdCard} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-semibold text-gray-800">{profile?.student_id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-semibold text-gray-800">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Profile Tips</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Keep your contact information up to date</li>
          <li>• Contact library admin to update your profile details</li>
          <li>• Your student ID is unique and cannot be changed</li>
          <li>• Profile information helps us serve you better</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentProfile;
