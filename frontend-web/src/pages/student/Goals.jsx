import { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTrophy, faFire, faTrash, faTimes, faChartLine, faCalendar
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    goal_type: 'WEEKLY',
    target_hours: 10
  });

  const goalTypes = [
    { value: 'DAILY', label: 'Daily Goal', icon: '📅', duration: 1, unit: 'day' },
    { value: 'WEEKLY', label: 'Weekly Goal', icon: '📆', duration: 7, unit: 'week' },
    { value: 'MONTHLY', label: 'Monthly Goal', icon: '🗓️', duration: 30, unit: 'month' }
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalService.getGoals();
      setGoals(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      const today = new Date();
      let endDate;
      
      if (formData.goal_type === 'DAILY') {
        endDate = addDays(today, 1);
      } else if (formData.goal_type === 'WEEKLY') {
        endDate = addWeeks(today, 1);
      } else {
        endDate = addMonths(today, 1);
      }

      const data = {
        student: user.id,
        goal_type: formData.goal_type,
        target_hours: parseInt(formData.target_hours),
        start_date: format(today, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd')
      };
      
      await goalService.createGoal(data);
      toast.success('Goal created! 🎯');
      setShowModal(false);
      resetForm();
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this goal?')) {
      try {
        await goalService.deleteGoal(id);
        toast.success('Goal deleted');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      goal_type: 'WEEKLY',
      target_hours: 10
    });
  };

  const getGoalIcon = (type) => {
    const goal = goalTypes.find(g => g.value === type);
    return goal ? goal.icon : '🎯';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'green';
    if (percentage >= 75) return 'blue';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };

  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Goals 🎯</h1>
            <p className="text-yellow-100">Set targets and track your progress</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-white text-yellow-600 rounded-xl font-semibold hover:bg-yellow-50 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Goal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faTrophy} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{goals.length}</h3>
          <p className="text-blue-100 text-sm">Total Goals</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faFire} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{activeGoals.length}</h3>
          <p className="text-orange-100 text-sm">Active Goals</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl opacity-80" />
          </div>
          <h3 className="text-3xl font-bold">{completedGoals.length}</h3>
          <p className="text-green-100 text-sm">Completed</p>
        </div>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Active Goals</h2>
          {activeGoals.map((goal) => {
            const progressColor = getProgressColor(goal.progress_percentage);
            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getGoalIcon(goal.goal_type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{goal.goal_type} Goal</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(goal.start_date), 'MMM dd')} - {format(new Date(goal.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {goal.current_hours} / {goal.target_hours} hours
                    </span>
                    <span className={`text-sm font-bold ${
                      progressColor === 'green' ? 'text-green-600' :
                      progressColor === 'blue' ? 'text-blue-600' :
                      progressColor === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {goal.progress_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressColor === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        progressColor === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        progressColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {goal.progress_percentage >= 100 ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      🎉 Goal Achieved!
                    </span>
                  ) : goal.progress_percentage >= 75 ? (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      💪 Almost There!
                    </span>
                  ) : goal.progress_percentage >= 50 ? (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      🔥 Keep Going!
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      🚀 Let's Start!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getGoalIcon(goal.goal_type)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{goal.goal_type} Goal</h3>
                    <p className="text-sm text-gray-600">
                      {goal.target_hours} hours completed
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold inline-block">
                  ✅ Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faTrophy} className="text-6xl text-gray-300 mb-4" />
          <p className="text-xl text-gray-400 mb-2">No goals yet</p>
          <p className="text-gray-500 mb-4">Set your first study goal to get started!</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all shadow-lg"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">New Study Goal</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                <select
                  value={formData.goal_type}
                  onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.target_hours}
                  onChange={(e) => setFormData({ ...formData, target_hours: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many hours do you want to study?
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> Start with achievable goals and gradually increase them!
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                  Create Goal
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;