import { useState, useEffect } from 'react';
import { libraryService } from '../../services/libraryService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPhone, faChair, faMapMarkerAlt, faSun, faMoon, faClock, faCalendarAlt, faCheckCircle, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const Library = () => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    total_seats: '',
    opening_time: '',
    closing_time: '',
  });

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const data = await libraryService.getLibraryDetail();
      setLibrary(data);
      setFormData(data);
    } catch (error) {
      toast.error('Failed to load library details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await libraryService.updateLibrary(formData);
      toast.success('Library updated successfully');
      setEditing(false);
      fetchLibrary();
    } catch (error) {
      toast.error('Failed to update library');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(library);
    setEditing(false);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Library Profile</h2>
            <p className="text-gray-600 mt-2">Manage your library information and settings</p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)} className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPencilAlt} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        /* Edit Mode */
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Library Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter library name"
                  required
                />
              </div>
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
                label="Total Seats"
                name="total_seats"
                type="number"
                value={formData.total_seats}
                onChange={handleChange}
                placeholder="50"
                required
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows="3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b">Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Opening Time"
                name="opening_time"
                type="time"
                value={formData.opening_time}
                onChange={handleChange}
                required
              />
              <Input
                label="Closing Time"
                name="closing_time"
                type="time"
                value={formData.closing_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start">
                <FontAwesomeIcon icon={faLightbulb} className="mr-2 mt-0.5 text-yellow-500" />
                <span><span className="font-semibold">Tip:</span> Set accurate operating hours to help students plan their visits effectively.</span>
              </p>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <div className="flex items-center justify-between mb-6 pb-3 border-b">
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Library Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{library?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-lg text-gray-900 mt-1 flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-600" />
                  {library?.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Seats</label>
                <p className="text-lg text-gray-900 mt-1 flex items-center">
                  <FontAwesomeIcon icon={faChair} className="mr-2 text-purple-600" />
                  {library?.total_seats} seats
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-lg text-gray-900 mt-1 flex items-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 mt-1 text-red-600" />
                  <span>{library?.address}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Operating Hours Card */}
          <Card>
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b">Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl text-blue-600">
                  <FontAwesomeIcon icon={faSun} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Opening Time</label>
                  <p className="text-2xl font-bold text-blue-900">{library?.opening_time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl text-orange-600">
                  <FontAwesomeIcon icon={faMoon} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Closing Time</label>
                  <p className="text-2xl font-bold text-orange-900">{library?.closing_time}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon icon={faClock} className="text-2xl text-gray-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Operating Duration</p>
                  <p className="text-gray-600 mt-1">
                    Your library operates for {calculateDuration(library?.opening_time, library?.closing_time)} hours daily
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Total Capacity</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">{library?.total_seats}</p>
                  </div>
                  <div className="text-4xl text-purple-600">
                    <FontAwesomeIcon icon={faChair} />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Operating Days</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">7 Days</p>
                  </div>
                  <div className="text-4xl text-green-600">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Status</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">Active</p>
                  </div>
                  <div className="text-4xl text-blue-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate duration
const calculateDuration = (opening, closing) => {
  if (!opening || !closing) return 0;
  const [openHour, openMin] = opening.split(':').map(Number);
  const [closeHour, closeMin] = closing.split(':').map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  const duration = (closeMinutes - openMinutes) / 60;
  return duration.toFixed(1);
};

export default Library;
