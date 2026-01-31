import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAttendance();
    fetchStudents();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const data = await attendanceService.getDailyAttendance(selectedDate);
      setAttendance(data.attendance || data.results || data);
    } catch (error) {
      console.error('Attendance fetch error:', error);
      toast.error('Failed to load attendance');
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

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.markAttendance({
        student: selectedStudent,
        date: selectedDate,
        attendance_type: 'MANUAL',
      });
      toast.success('Attendance marked successfully');
      setShowModal(false);
      fetchAttendance();
      setSelectedStudent('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  const columns = [
    { key: 'student_name', label: 'Student' },
    { key: 'date', label: 'Date' },
    { 
      key: 'check_in_time', 
      label: 'Check-in Time',
      render: (row) => new Date(row.check_in_time).toLocaleTimeString()
    },
    { key: 'attendance_type', label: 'Type' },
  ];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Attendance</h2>
        <div className="flex space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <Button onClick={() => setShowModal(true)}>Mark Attendance</Button>
        </div>
      </div>

      <Card>
        {attendance.length === 0 ? (
          <EmptyState message="No attendance records for this date" icon={<FontAwesomeIcon icon={faCheck} />} />
        ) : (
          <Table columns={columns} data={attendance} />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
        <form onSubmit={handleMarkAttendance}>
          <Select
            label="Select Student"
            name="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={students.map(s => ({ 
              value: s.id, 
              label: `${s.full_name}${!s.is_active ? ' (Inactive)' : ''}`
            }))}
            required
          />
          <Button type="submit" className="w-full mt-4">Mark Present</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
