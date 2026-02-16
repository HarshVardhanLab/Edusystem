import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import LoadingSpinner from './common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faPhone, faEnvelope, faCalendar, faMale, faFemale, 
  faMapMarkerAlt, faGraduationCap, faBook, faSchool, faCreditCard,
  faCheckCircle, faChartLine, faHistory, faTimes, faUserShield, 
  faEdit, faSave
} from '@fortawesome/free-solid-svg-icons';

const StudentProfile = ({ studentId, onClose, onUpdate }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      const data = await studentService.getStudent(studentId);
      setStudent(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        email: data.email || '',
        time_slot: data.time_slot || 'MORNING',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || '',
        father_name: data.father_name || '',
        emergency_contact: data.emergency_contact || '',
        preparing_for: data.preparing_for || '',
        qualification: data.qualification || '',
        education_level: data.education_level || '',
        institution_name: data.institution_name || '',
        address: data.address || '',
      });
    } catch (error) {
      toast.error('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Only send fields that have values
      const updateData = {};
      
      if (formData.full_name) updateData.full_name = formData.full_name;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.email) updateData.email = formData.email;
      if (formData.time_slot) updateData.time_slot = formData.time_slot;
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.date_of_birth) updateData.date_of_birth = formData.date_of_birth;
      if (formData.father_name) updateData.father_name = formData.father_name;
      if (formData.emergency_contact) updateData.emergency_contact = formData.emergency_contact;
      if (formData.preparing_for) updateData.preparing_for = formData.preparing_for;
      if (formData.qualification) updateData.qualification = formData.qualification;
      if (formData.education_level) updateData.education_level = formData.education_level;
      if (formData.institution_name) updateData.institution_name = formData.institution_name;
      if (formData.address) updateData.address = formData.address;

      await studentService.updateStudent(studentId, updateData);
      toast.success('Student updated successfully');
      setEditing(false);
      fetchStudentDetail();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.detail || error.response?.data?.error || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: student.full_name || '',
      phone: student.phone || '',
      email: student.email || '',
      time_slot: student.time_slot || 'MORNING',
      gender: student.gender || '',
      date_of_birth: student.date_of_birth || '',
      father_name: student.father_name || '',
      emergency_contact: student.emergency_contact || '',
      preparing_for: student.preparing_for || '',
      qualification: student.qualification || '',
      education_level: student.education_level || '',
      institution_name: student.institution_name || '',
      address: student.address || '',
    });
    setEditing(false);
  };

  const handleResetPassword = async () => {
    if (!confirm('Are you sure you want to reset this student\'s password?')) return;
    
    try {
      const response = await studentService.resetPassword(studentId);
      alert(`New Password: ${response.password}\n\nStudent ID: ${response.student_id}\n\nPlease save this password and share it with the student!`);
      toast.success('Password reset successfully');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!student) return <div>Student not found</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg flex justify-between items-start z-10">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {student.photo ? (
                <img src={student.photo} alt={student.full_name} className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon 
                  icon={student.gender === 'MALE' ? faMale : student.gender === 'FEMALE' ? faFemale : faUser} 
                  className="text-4xl text-blue-600" 
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{editing ? formData.full_name : student.full_name}</h2>
              <p className="text-blue-100 mt-1">Student ID: #{student.student_id || student.id}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  student.is_active ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </span>
                {student.seat_number && (
                  <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-semibold">
                    Seat: {student.seat_number}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!editing && (
              <>
                <button 
                  onClick={handleResetPassword} 
                  className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors"
                  title="Reset Password"
                >
                  <FontAwesomeIcon icon={faUserShield} className="text-xl" />
                </button>
                <button 
                  onClick={() => setEditing(true)} 
                  className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors"
                  title="Edit Profile"
                >
                  <FontAwesomeIcon icon={faEdit} className="text-xl" />
                </button>
              </>
            )}
            <button onClick={onClose} className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors">
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Attendance</p>
                  <p className="text-3xl font-bold text-blue-600">{student.attendance_stats?.total || 0}</p>
                </div>
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-blue-500 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-green-600">{student.attendance_stats?.current_month || 0}</p>
                </div>
                <FontAwesomeIcon icon={faCalendar} className="text-3xl text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Attendance Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{student.attendance_stats?.attendance_percentage || 0}%</p>
                </div>
                <FontAwesomeIcon icon={faChartLine} className="text-3xl text-purple-500 opacity-50" />
              </div>
            </Card>

            <Card className={`bg-gradient-to-br border-l-4 ${
              student.subscription?.fee_status === 'PAID' 
                ? 'from-green-50 to-green-100 border-green-500' 
                : 'from-red-50 to-red-100 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className={`text-2xl font-bold ${
                    student.subscription?.fee_status === 'PAID' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {student.subscription?.fee_status || 'N/A'}
                  </p>
                </div>
                <FontAwesomeIcon icon={faCreditCard} className={`text-3xl opacity-50 ${
                  student.subscription?.fee_status === 'PAID' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </Card>
          </div>

          {editing ? (
            /* Edit Mode */
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-600" />
                  Edit Student Information
                </h3>
                
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Select
                      label="Time Slot"
                      name="time_slot"
                      value={formData.time_slot}
                      onChange={handleChange}
                      options={[
                        { value: 'MORNING', label: 'Morning (6 AM - 12 PM)' },
                        { value: 'AFTERNOON', label: 'Afternoon (12 PM - 6 PM)' },
                        { value: 'EVENING', label: 'Evening (6 PM - 12 AM)' },
                        { value: 'FULL_DAY', label: 'Full Day' },
                      ]}
                    />
                  </div>
                </div>

                {/* Personal Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Personal Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select Gender' },
                        { value: 'MALE', label: 'Male' },
                        { value: 'FEMALE', label: 'Female' },
                        { value: 'OTHER', label: 'Other' },
                      ]}
                    />
                    <Input
                      label="Date of Birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                    <Input
                      label="Father's Name"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                    />
                    <Input
                      label="Emergency Contact"
                      name="emergency_contact"
                      type="tel"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Educational Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Educational Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Preparing For"
                      name="preparing_for"
                      value={formData.preparing_for}
                      onChange={handleChange}
                    />
                    <Input
                      label="Qualification/Class"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                    <Select
                      label="Education Level"
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select Level' },
                        { value: 'SCHOOL', label: 'School' },
                        { value: 'COLLEGE', label: 'College' },
                        { value: 'UNIVERSITY', label: 'University' },
                        { value: 'COMPETITIVE_EXAM', label: 'Competitive Exam' },
                        { value: 'OTHER', label: 'Other' },
                      ]}
                    />
                    <Input
                      label="School/College Name"
                      name="institution_name"
                      value={formData.institution_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faSave} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            /* View Mode */
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <InfoRow icon={faUser} label="Full Name" value={student.full_name} />
                    <InfoRow icon={student.gender === 'MALE' ? faMale : faFemale} label="Gender" value={student.gender || '-'} />
                    <InfoRow icon={faCalendar} label="Date of Birth" value={formatDate(student.date_of_birth)} />
                    {student.age && <InfoRow icon={faCalendar} label="Age" value={`${student.age} years`} />}
                    <InfoRow icon={faUserShield} label="Father's Name" value={student.father_name || '-'} />
                    <InfoRow icon={faPhone} label="Phone" value={student.phone} />
                    <InfoRow icon={faPhone} label="Emergency Contact" value={student.emergency_contact || '-'} />
                    <InfoRow icon={faEnvelope} label="Email" value={student.email || '-'} />
                    <InfoRow icon={faMapMarkerAlt} label="Address" value={student.address || '-'} multiline />
                  </div>
                </Card>

                {/* Educational Information */}
                <Card>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-green-600" />
                    Educational Information
                  </h3>
                  <div className="space-y-3">
                    <InfoRow icon={faBook} label="Preparing For" value={student.preparing_for || '-'} />
                    <InfoRow icon={faGraduationCap} label="Qualification" value={student.qualification || '-'} />
                    <InfoRow icon={faSchool} label="Education Level" value={student.education_level || '-'} />
                    <InfoRow icon={faSchool} label="Institution" value={student.institution_name || '-'} />
                    <InfoRow icon={faCalendar} label="Time Slot" value={student.time_slot} />
                  </div>
                </Card>
              </div>

              {/* Subscription Details */}
              {student.subscription && (
                <Card>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-purple-600" />
                    Active Subscription
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Plan Name</p>
                      <p className="text-lg font-semibold text-blue-600">{student.subscription.plan_name}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Fee Amount</p>
                      <p className="text-lg font-semibold text-green-600">₹{student.subscription.fee_amount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Days Remaining</p>
                      <p className="text-lg font-semibold text-orange-600">{student.subscription.days_remaining} days</p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      student.subscription.fee_status === 'PAID' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className={`text-lg font-semibold ${
                        student.subscription.fee_status === 'PAID' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.subscription.fee_status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-semibold">{formatDate(student.subscription.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-semibold">{formatDate(student.subscription.end_date)}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Recent Attendance */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <FontAwesomeIcon icon={faHistory} className="mr-2 text-orange-600" />
                  Recent Attendance
                </h3>
                {student.attendance_stats?.recent?.length > 0 ? (
                  <div className="space-y-2">
                    {student.attendance_stats.recent.map((att, index) => (
                      <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{formatDate(att.date)}</p>
                            <p className="text-sm text-gray-600">Check-in: {att.check_in_time}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {att.attendance_type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No attendance records yet</p>
                )}
              </Card>

              {/* Payment History */}
              {student.payment_history?.length > 0 && (
                <Card>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-green-600" />
                    Payment History
                  </h3>
                  <div className="space-y-2">
                    {student.payment_history.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{payment.plan_name}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">₹{payment.amount.toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg border-t flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ icon, label, value, multiline = false }) => (
  <div className="flex items-start space-x-3">
    <FontAwesomeIcon icon={icon} className="text-gray-400 mt-1" />
    <div className="flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-semibold text-gray-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default StudentProfile;
