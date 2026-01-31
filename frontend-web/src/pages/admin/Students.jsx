import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StudentProfile from '../../components/StudentProfile';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faSearch, faFilter, faMale, faFemale, faPhone, faEnvelope, faEye, faUpload, faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    time_slot: 'MORNING',
    gender: '',
    date_of_birth: '',
    father_name: '',
    emergency_contact: '',
    preparing_for: '',
    qualification: '',
    education_level: '',
    institution_name: '',
    address: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterStatus]);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data.results || data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => 
        filterStatus === 'active' ? s.is_active : !s.is_active
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm) ||
        (s.father_name && s.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('phone', formData.phone);
    data.append('time_slot', formData.time_slot);
    
    // Personal details
    if (formData.email) data.append('email', formData.email);
    if (formData.gender) data.append('gender', formData.gender);
    if (formData.date_of_birth) data.append('date_of_birth', formData.date_of_birth);
    if (formData.father_name) data.append('father_name', formData.father_name);
    if (formData.emergency_contact) data.append('emergency_contact', formData.emergency_contact);
    
    // Educational details
    if (formData.preparing_for) data.append('preparing_for', formData.preparing_for);
    if (formData.qualification) data.append('qualification', formData.qualification);
    if (formData.education_level) data.append('education_level', formData.education_level);
    if (formData.institution_name) data.append('institution_name', formData.institution_name);
    if (formData.address) data.append('address', formData.address);
    
    // Documents
    if (photoFile) data.append('photo', photoFile);
    if (idProofFile) data.append('id_proof', idProofFile);

    try {
      await studentService.createStudent(data);
      toast.success('Student created successfully');
      setShowModal(false);
      fetchStudents();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create student');
    }
  };

  const resetForm = () => {
    setFormData({ 
      full_name: '', 
      phone: '', 
      email: '',
      time_slot: 'MORNING',
      gender: '',
      date_of_birth: '',
      father_name: '',
      emergency_contact: '',
      preparing_for: '',
      qualification: '',
      education_level: '',
      institution_name: '',
      address: '',
    });
    setPhotoFile(null);
    setIdProofFile(null);
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this student?')) return;
    
    try {
      await studentService.deactivateStudent(id);
      toast.success('Student deactivated');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to deactivate student');
    }
  };

  const handleActivate = async (id) => {
    try {
      await studentService.activateStudent(id);
      toast.success('Student activated');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to activate student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this student? This action cannot be undone.')) return;
    
    try {
      await studentService.deleteStudent(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleViewProfile = (id) => {
    setSelectedStudentId(id);
    setShowProfile(true);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setUploading(true);
    try {
      const result = await studentService.bulkUploadStudents(csvFile);
      toast.success(result.message);
      
      if (result.errors && result.errors.length > 0) {
        console.error('Upload errors:', result.errors);
        toast.error(`${result.errors.length} rows had errors. Check console for details.`);
      }
      
      setShowBulkUploadModal(false);
      setCsvFile(null);
      fetchStudents();
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload CSV');
    } finally {
      setUploading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = [
      'full_name',
      'phone',
      'email',
      'time_slot',
      'gender',
      'date_of_birth',
      'father_name',
      'emergency_contact',
      'preparing_for',
      'qualification',
      'education_level',
      'institution_name',
      'address'
    ];

    const sampleData = [
      'John Doe',
      '9876543210',
      'john@example.com',
      'MORNING',
      'MALE',
      '2000-01-15',
      'Robert Doe',
      '9876543211',
      'UPSC',
      '12th Grade',
      'SCHOOL',
      'ABC School',
      '123 Main St, City'
    ];

    let csvContent = headers.join(',') + '\n';
    csvContent += sampleData.map(cell => `"${cell}"`).join(',') + '\n';

    // Add instructions
    csvContent += '\n# Instructions:\n';
    csvContent += '# - full_name and phone are required\n';
    csvContent += '# - time_slot: MORNING, AFTERNOON, EVENING, or FULL_DAY\n';
    csvContent += '# - gender: MALE, FEMALE, or OTHER\n';
    csvContent += '# - date_of_birth: YYYY-MM-DD or DD/MM/YYYY format\n';
    csvContent += '# - education_level: SCHOOL, COLLEGE, UNIVERSITY, COMPETITIVE_EXAM, or OTHER\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template downloaded!');
  };

  const columns = [
    { 
      key: 'full_name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
            row.gender === 'MALE' ? 'bg-blue-500' : row.gender === 'FEMALE' ? 'bg-pink-500' : 'bg-gray-500'
          }`}>
            {row.gender === 'MALE' ? <FontAwesomeIcon icon={faMale} /> : 
             row.gender === 'FEMALE' ? <FontAwesomeIcon icon={faFemale} /> : 
             row.full_name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{row.full_name}</p>
            {row.father_name && <p className="text-xs text-gray-500">S/O: {row.father_name}</p>}
          </div>
        </div>
      )
    },
    { 
      key: 'contact', 
      label: 'Contact',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
            <span>{row.phone}</span>
          </div>
          {row.email && (
            <div className="flex items-center space-x-1 text-gray-600">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs" />
              <span className="text-xs">{row.email}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'age', 
      label: 'Age',
      render: (row) => row.age ? `${row.age} yrs` : '-'
    },
    { 
      key: 'preparing_for', 
      label: 'Preparing For',
      render: (row) => row.preparing_for || '-'
    },
    { 
      key: 'qualification', 
      label: 'Qualification',
      render: (row) => row.qualification || '-'
    },
    { 
      key: 'time_slot', 
      label: 'Time Slot',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {row.time_slot}
        </span>
      )
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="primary" onClick={() => handleViewProfile(row.id)} className="text-xs">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            View
          </Button>
          {row.is_active ? (
            <Button variant="danger" onClick={() => handleDeactivate(row.id)} className="text-xs">
              Deactivate
            </Button>
          ) : (
            <Button variant="success" onClick={() => handleActivate(row.id)} className="text-xs">
              Activate
            </Button>
          )}
          <Button variant="danger" onClick={() => handleDelete(row.id)} className="text-xs">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Students Management</h2>
          <p className="text-gray-600 mt-1">Manage student information and records</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowBulkUploadModal(true)} 
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Bulk Upload</span>
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total Students</p>
          <p className="text-3xl font-bold text-blue-600">{students.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Active</p>
          <p className="text-3xl font-bold text-green-600">
            {students.filter(s => s.is_active).length}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">Inactive</p>
          <p className="text-3xl font-bold text-red-600">
            {students.filter(s => !s.is_active).length}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Male/Female</p>
          <p className="text-xl font-bold text-purple-600">
            {students.filter(s => s.gender === 'MALE').length} / {students.filter(s => s.gender === 'FEMALE').length}
          </p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or father's name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        {filteredStudents.length === 0 ? (
          <EmptyState 
            message={searchTerm || filterStatus !== 'all' ? "No students match your filters" : "No students found"} 
            icon={<FontAwesomeIcon icon={faUsers} />} 
          />
        ) : (
          <Table columns={columns} data={filteredStudents} />
        )}
      </Card>

      {/* Add Student Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Add New Student" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
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
                required
              />
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Details</h3>
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
                placeholder="Enter father's name"
              />
              <Input
                label="Emergency Contact"
                name="emergency_contact"
                type="tel"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          {/* Educational Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Educational Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preparing For"
                name="preparing_for"
                value={formData.preparing_for}
                onChange={handleChange}
                placeholder="e.g., UPSC, JEE, NEET"
              />
              <Input
                label="Qualification/Class"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., 12th Grade, B.Tech"
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
                placeholder="Institution name"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload student photo (optional)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof</label>
                <input
                  type="file"
                  onChange={(e) => setIdProofFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload ID proof document (optional)</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Create Student</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Profile Modal */}
      {showProfile && selectedStudentId && (
        <StudentProfile 
          studentId={selectedStudentId} 
          onClose={() => {
            setShowProfile(false);
            setSelectedStudentId(null);
          }}
          onUpdate={fetchStudents}
        />
      )}

      {/* Bulk Upload Modal */}
      <Modal 
        isOpen={showBulkUploadModal} 
        onClose={() => { 
          setShowBulkUploadModal(false); 
          setCsvFile(null); 
        }} 
        title="Bulk Upload Students"
      >
        <form onSubmit={handleBulkUpload} className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileExcel} />
              CSV Upload Instructions
            </h3>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>• Download the template CSV file below</li>
              <li>• Fill in student details (full_name and phone are required)</li>
              <li>• Upload the completed CSV file</li>
              <li>• All students will be created with active status</li>
            </ul>
          </div>

          {/* Download Template Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={downloadCSVTemplate}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              Download CSV Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUpload} className="mr-2 text-blue-600" />
              Select CSV File *
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 hover:border-blue-400 transition-colors"
              required
            />
            {csvFile && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileExcel} />
                Selected: {csvFile.name}
              </p>
            )}
          </div>

          {/* CSV Format Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Required Fields:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>full_name</strong> - Student's full name</li>
              <li>• <strong>phone</strong> - Contact number (10 digits)</li>
            </ul>
            <h4 className="font-semibold text-gray-800 mt-3 mb-2">Optional Fields:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• email, time_slot, gender, date_of_birth</li>
              <li>• father_name, emergency_contact</li>
              <li>• preparing_for, qualification, education_level</li>
              <li>• institution_name, address</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { 
                setShowBulkUploadModal(false); 
                setCsvFile(null); 
              }}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !csvFile}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <FontAwesomeIcon icon={faUpload} className="animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} />
                  Upload Students
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
