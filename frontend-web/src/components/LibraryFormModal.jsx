import { useState, useEffect } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faUser, faEnvelope, faPhone, faMapMarkerAlt,
  faChair, faClock, faKey, faSpinner, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

const LibraryFormModal = ({ 
  isOpen, 
  onClose, 
  library = null, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_email: '',
    owner_password: '',
    address: '',
    phone: '',
    total_seats: '',
    opening_time: '09:00',
    closing_time: '21:00'
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!library;

  useEffect(() => {
    if (library) {
      setFormData({
        name: library.name || '',
        owner_email: library.owner || '',
        owner_password: '', // Don't populate password for editing
        address: library.address || '',
        phone: library.phone || '',
        total_seats: library.total_seats || '',
        opening_time: library.opening_time || '09:00',
        closing_time: library.closing_time || '21:00'
      });
    } else {
      // Reset form for new library
      setFormData({
        name: '',
        owner_email: '',
        owner_password: '',
        address: '',
        phone: '',
        total_seats: '',
        opening_time: '09:00',
        closing_time: '21:00'
      });
    }
    setErrors({});
  }, [library, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Library name is required';
    }

    if (!formData.owner_email.trim()) {
      newErrors.owner_email = 'Owner email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.owner_email)) {
      newErrors.owner_email = 'Please enter a valid email address';
    }

    if (!isEditing && !formData.owner_password.trim()) {
      newErrors.owner_password = 'Password is required for new libraries';
    } else if (!isEditing && formData.owner_password.length < 6) {
      newErrors.owner_password = 'Password must be at least 6 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.total_seats || formData.total_seats < 1) {
      newErrors.total_seats = 'Total seats must be at least 1';
    }

    if (!formData.opening_time) {
      newErrors.opening_time = 'Opening time is required';
    }

    if (!formData.closing_time) {
      newErrors.closing_time = 'Closing time is required';
    }

    // Check if closing time is after opening time
    if (formData.opening_time && formData.closing_time) {
      if (formData.opening_time >= formData.closing_time) {
        newErrors.closing_time = 'Closing time must be after opening time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      let response;
      const submitData = { ...formData };
      
      console.log('Submitting library data:', submitData);
      
      // Don't send empty password for editing
      if (isEditing && !submitData.owner_password) {
        delete submitData.owner_password;
      }

      if (isEditing) {
        response = await api.put(`/api/v1/superadmin/libraries/${library.id}/`, submitData);
        toast.success('Library updated successfully!');
      } else {
        response = await api.post('/api/v1/superadmin/libraries/', submitData);
        toast.success('Library created successfully!');
      }

      onSuccess && onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Library form error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'object' && !errorData.error) {
          // Handle field-specific errors
          setErrors(errorData);
        } else {
          toast.error(errorData.error || errorData.message || 'Failed to save library');
        }
      } else {
        toast.error('Failed to save library. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FontAwesomeIcon icon={faBuilding} className="text-white" />
          </div>
          <span>{isEditing ? 'Edit Library' : 'Create New Library'}</span>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Library Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600" />
            Library Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Library Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter library name"
                required
                icon={faBuilding}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                placeholder="Enter complete address"
                required
                icon={faMapMarkerAlt}
                multiline
                rows={3}
              />
            </div>
            
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              required
              icon={faPhone}
            />
            
            <Input
              label="Total Seats"
              name="total_seats"
              type="number"
              value={formData.total_seats}
              onChange={handleInputChange}
              error={errors.total_seats}
              placeholder="Enter number of seats"
              required
              min="1"
              icon={faChair}
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-green-600" />
            Operating Hours
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Opening Time"
              name="opening_time"
              type="time"
              value={formData.opening_time}
              onChange={handleInputChange}
              error={errors.opening_time}
              required
              icon={faClock}
            />
            
            <Input
              label="Closing Time"
              name="closing_time"
              type="time"
              value={formData.closing_time}
              onChange={handleInputChange}
              error={errors.closing_time}
              required
              icon={faClock}
            />
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
            Owner Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Owner Email"
                name="owner_email"
                type="email"
                value={formData.owner_email}
                onChange={handleInputChange}
                error={errors.owner_email}
                placeholder="owner@example.com"
                required
                icon={faEnvelope}
              />
            </div>
            
            {!isEditing && (
              <div className="md:col-span-2">
                <Input
                  label="Owner Password"
                  name="owner_password"
                  type="password"
                  value={formData.owner_password}
                  onChange={handleInputChange}
                  error={errors.owner_password}
                  placeholder="Enter password for library owner"
                  required={!isEditing}
                  icon={faKey}
                  help="This will be the login password for the library owner"
                />
              </div>
            )}
            
            {isEditing && (
              <div className="md:col-span-2">
                <Input
                  label="New Password (Optional)"
                  name="owner_password"
                  type="password"
                  value={formData.owner_password}
                  onChange={handleInputChange}
                  error={errors.owner_password}
                  placeholder="Leave empty to keep current password"
                  icon={faKey}
                  help="Only enter if you want to change the owner's password"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isEditing ? 'Update Library' : 'Create Library'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LibraryFormModal;