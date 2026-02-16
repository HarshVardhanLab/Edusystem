import { useState, useEffect } from 'react';
import { seatService } from '../../services/seatService';
import { studentService } from '../../services/studentService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';

const Seats = () => {
  const [seats, setSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formData, setFormData] = useState({
    seat_number: '',
    seat_type: 'FIXED',
  });
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchSeats();
    fetchStudents();
  }, []);

  const fetchSeats = async () => {
    try {
      const data = await seatService.getSeats();
      // Transform the data to match frontend expectations
      const transformedSeats = (data.results || data).map(seat => ({
        ...seat,
        is_occupied: !seat.is_available,
        student_name: seat.assigned_to
      }));
      setSeats(transformedSeats);
    } catch (error) {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data.results || data);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSeat = async (e) => {
    e.preventDefault();
    try {
      await seatService.createSeat(formData);
      toast.success('Seat created successfully');
      setShowCreateModal(false);
      fetchSeats();
      setFormData({ seat_number: '', seat_type: 'FIXED' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create seat');
    }
  };

  const handleAssignSeat = async (e) => {
    e.preventDefault();
    try {
      await seatService.assignSeat(selectedSeat.id, selectedStudent);
      toast.success('Seat assigned successfully');
      setShowAssignModal(false);
      setSelectedStudent('');
      fetchSeats(); // Refresh seat data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign seat');
    }
  };

  const handleFreeSeat = async (id) => {
    if (!confirm('Are you sure you want to free this seat?')) return;
    
    try {
      await seatService.freeSeat(id);
      toast.success('Seat freed successfully');
      fetchSeats(); // Refresh seat data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to free seat');
    }
  };

  const handleDeleteSeat = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this seat?')) return;
    
    try {
      await seatService.deleteSeat(id);
      toast.success('Seat deleted successfully');
      fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete seat');
    }
  };

  const openAssignModal = (seat) => {
    setSelectedSeat(seat);
    setShowAssignModal(true);
  };

  const columns = [
    { key: 'seat_number', label: 'Seat Number' },
    { key: 'seat_type', label: 'Type' },
    { 
      key: 'is_occupied', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.is_occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {row.is_occupied ? 'Occupied' : 'Available'}
        </span>
      )
    },
    { 
      key: 'student_name', 
      label: 'Assigned To',
      render: (row) => row.student_name || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          {!row.is_occupied ? (
            <>
              <Button onClick={() => openAssignModal(row)} className="text-xs">
                Assign
              </Button>
              <Button variant="danger" onClick={() => handleDeleteSeat(row.id)} className="text-xs">
                Delete
              </Button>
            </>
          ) : (
            <Button variant="danger" onClick={() => handleFreeSeat(row.id)} className="text-xs">
              Free
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Seats</h2>
        <Button onClick={() => setShowCreateModal(true)}>Create Seat</Button>
      </div>

      <Card>
        {seats.length === 0 ? (
          <EmptyState message="No seats found" icon={<FontAwesomeIcon icon={faChair} />} />
        ) : (
          <Table columns={columns} data={seats} />
        )}
      </Card>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Seat">
        <form onSubmit={handleCreateSeat}>
          <Input
            label="Seat Number"
            name="seat_number"
            value={formData.seat_number}
            onChange={handleChange}
            required
          />
          <Select
            label="Seat Type"
            name="seat_type"
            value={formData.seat_type}
            onChange={handleChange}
            options={[
              { value: 'FIXED', label: 'Fixed' },
              { value: 'FLEXIBLE', label: 'Flexible' },
            ]}
            required
          />
          <Button type="submit" className="w-full">Create Seat</Button>
        </form>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Seat">
        <form onSubmit={handleAssignSeat}>
          <Select
            label="Select Student"
            name="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={students
              .filter(s => s.is_active && !s.seat) // Only show active students without seats
              .map(s => ({ 
                value: s.id, 
                label: s.full_name
              }))}
            required
          />
          <Button type="submit" className="w-full mt-4">Assign Seat</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Seats;
