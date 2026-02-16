import { useState } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import ImageUpload from './common/ImageUpload';
import { studentService } from '../services/studentService';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faCalendarAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const StudentFormModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  student = null, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    full_name: student?.full_name || '',
    phone: student?.phone || '',
    email: student?.email || '',
    time_slot: student?.time_slot || 'MORNING',
    gender: student?.gender || '',
    date_of_birth: student?.date_of_birth || '',
    father_name: student?.father_name || '',
    emergency_contact: student?.emergency_contact || '',
    preparing_for: student?.preparing_for || '',
    qualification: student?.qualification || '',
    education_level: student?.education_level || '',
    institution_name: student?.institution_name || '',
    address: student?.address || '',
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const timeSlotOptions = [
    { value: 'MORNING', label: 'Morning (6 AM - 12 PM)' },
    { value: 'AFTERNOON', label: 'Afternoon (12 PM - 6 PM)' },
    { value: 'EVENING', label: 'Evening (6 PM - 12 AM)' },
    { value: 'FULL_DAY', label: 'Full Day' },
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  const educationLevelOptions = [
    { value: 'SCHOOL', label: 'School' },
    { value: 'COLLEGE', label: 'College' },
    { value: 'UNIVERSITY', label: 'University' },
    { value: 'COMPETITIVE_EXAM', label: 'Competitive Exam' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isEdit) {
        result = await studentService.updateStudent(student.id, formData);
      } else {
        result = await studentService.createStudent(formData);
      }

      toast.success(`Student ${isEdit ? 'updated' : 'created'} successfully!`);
      onSuccess(result);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} student`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadSuccess = (data) => {
    toast.success('Image uploaded successfully!');
    // Optionally refresh student data or update local state
  };

  const handleImageDeleteSuccess = () => {
    toast.success('Image deleted successfully!');
    // Optionally refresh student data or update local state
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: faUser },
    { id: 'personal', name: 'Personal Details', icon: faCalendarAlt },
    { id: 'education', name: 'Education', icon: faGraduationCap },
  ];

  // Only show images tab for existing students
  if (isEdit && student) {
    tabs.push({ id: 'images', name: 'Images', icon: faUser });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  icon={faUser}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  icon={faPhone}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={faEnvelope}
                />
                <Select
                  label="Time Slot"
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleChange}
                  options={timeSlotOptions}
                  required
                />
              </div>

              <Input
                label="Emergency Contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                icon={faPhone}
                placeholder="Emergency contact number"
              />
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                />
                <Input
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Father's Name"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Education Level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  options={educationLevelOptions}
                />
                <Input
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., 12th, B.Tech, etc."
                />
              </div>

              <Input
                label="Institution Name"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="School/College name"
              />

              <Input
                label="Preparing For"
                name="preparing_for"
                value={formData.preparing_for}
                onChange={handleChange}
                placeholder="e.g., JEE, NEET, UPSC, etc."
              />
            </div>
          )}

          {activeTab === 'images' && isEdit && student && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Photo</h3>
                  <ImageUpload
                    studentId={student.id}
                    type="photo"
                    currentImageUrl={student.photo_url}
                    onUploadSuccess={handleImageUploadSuccess}
                    onDeleteSuccess={handleImageDeleteSuccess}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ID Proof</h3>
                  <ImageUpload
                    studentId={student.id}
                    type="id_proof"
                    currentImageUrl={student.id_proof_url}
                    onUploadSuccess={handleImageUploadSuccess}
                    onDeleteSuccess={handleImageDeleteSuccess}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Image Guidelines</h4>
                    <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                      <li>Photos should be clear and well-lit</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Supported formats: JPG, PNG, GIF</li>
                      <li>ID proof can also be PDF format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {isEdit ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentFormModal;