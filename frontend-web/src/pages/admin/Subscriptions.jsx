import { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
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
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    plan_name: '',
    start_date: '',
    end_date: '',
    fee_amount: '',
    fee_status: 'DUE',
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchStudents();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionService.getSubscriptions();
      console.log('Subscriptions data:', data);
      setSubscriptions(data.results || data);
    } catch (error) {
      console.error('Subscriptions fetch error:', error);
      toast.error('Failed to load subscriptions');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscriptionService.createSubscription(formData);
      toast.success('Subscription created successfully');
      setShowModal(false);
      fetchSubscriptions();
      setFormData({
        student: '',
        plan_name: '',
        start_date: '',
        end_date: '',
        fee_amount: '',
        fee_status: 'DUE',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create subscription');
    }
  };

  const handleUpdatePayment = async (id, status) => {
    try {
      await subscriptionService.updatePaymentStatus(id, status);
      toast.success('Payment status updated');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const columns = [
    { key: 'student_name', label: 'Student' },
    { key: 'plan_name', label: 'Plan' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'fee_amount', label: 'Amount' },
    { 
      key: 'fee_status', 
      label: 'Payment Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.fee_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.fee_status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        row.fee_status === 'DUE' && (
          <Button 
            variant="success" 
            onClick={() => handleUpdatePayment(row.id, 'PAID')} 
            className="text-xs"
          >
            Mark Paid
          </Button>
        )
      ),
    },
  ];

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <Button onClick={() => setShowModal(true)}>Create Subscription</Button>
      </div>

      <Card>
        {subscriptions.length === 0 ? (
          <EmptyState message="No subscriptions found" icon={<FontAwesomeIcon icon={faCreditCard} />} />
        ) : (
          <Table columns={columns} data={subscriptions} />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Subscription">
        <form onSubmit={handleSubmit}>
          <Select
            label="Student"
            name="student"
            value={formData.student}
            onChange={handleChange}
            options={students.map(s => ({ 
              value: s.id, 
              label: `${s.full_name}${!s.is_active ? ' (Inactive)' : ''}`
            }))}
            required
          />
          <Input
            label="Plan Name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
          <Input
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
          <Input
            label="Fee Amount"
            type="number"
            name="fee_amount"
            value={formData.fee_amount}
            onChange={handleChange}
            required
          />
          <Select
            label="Payment Status"
            name="fee_status"
            value={formData.fee_status}
            onChange={handleChange}
            options={[
              { value: 'DUE', label: 'Due' },
              { value: 'PAID', label: 'Paid' },
            ]}
            required
          />
          <Button type="submit" className="w-full">Create Subscription</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Subscriptions;
