import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faCheck, faTrash, faEdit, faTimes, faExclamationCircle,
  faCalendar, faFlag, faCheckCircle, faCircle
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    due_date: ''
  });

  const priorities = [
    { value: 'HIGH', label: 'High Priority', color: 'red', icon: '🔴' },
    { value: 'MEDIUM', label: 'Medium Priority', color: 'yellow', icon: '🟡' },
    { value: 'LOW', label: 'Low Priority', color: 'green', icon: '🟢' }
  ];

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const params = filter === 'completed' ? { is_completed: true } : 
                     filter === 'active' ? { is_completed: false } : {};
      const response = await taskService.getTasks(params);
      setTasks(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      const data = { 
        ...formData, 
        student: user.id,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
      };
      
      if (editingTask) {
        await taskService.updateTask(editingTask.id, data);
        toast.success('Task updated!');
      } else {
        await taskService.createTask(data);
        toast.success('Task created!');
      }
      
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskService.updateTask(task.id, { is_completed: !task.is_completed });
      toast.success(task.is_completed ? 'Task reopened' : 'Task completed! 🎉');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      due_date: ''
    });
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    const p = priorities.find(pr => pr.value === priority);
    return p ? p.color : 'gray';
  };

  const getPriorityIcon = (priority) => {
    const p = priorities.find(pr => pr.value === priority);
    return p ? p.icon : '⚪';
  };

  const isOverdue = (task) => {
    if (!task.due_date || task.is_completed) return false;
    return new Date(task.due_date) < new Date();
  };

  const filteredTasks = tasks;
  const activeTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Tasks ✅</h1>
            <p className="text-blue-100">Stay organized and productive</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
            </div>
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-3xl font-bold text-gray-800">{activeTasks.length}</p>
            </div>
            <FontAwesomeIcon icon={faCircle} className="text-4xl text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{completedTasks.length}</p>
            </div>
            <FontAwesomeIcon icon={faCheck} className="text-4xl text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            filter === 'active' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active ({activeTasks.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            filter === 'completed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                task.is_completed ? 'border-green-500 opacity-75' :
                isOverdue(task) ? 'border-red-500' :
                task.priority === 'HIGH' ? 'border-red-400' :
                task.priority === 'MEDIUM' ? 'border-yellow-400' :
                'border-green-400'
              } hover:shadow-xl transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.is_completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {task.is_completed && (
                    <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPriorityIcon(task.priority)}</span>
                      {!task.is_completed && (
                        <>
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {task.description && (
                    <p className={`text-sm mb-3 ${task.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      <FontAwesomeIcon icon={faFlag} className="mr-1" />
                      {task.priority}
                    </span>

                    {task.due_date && (
                      <span className={`px-3 py-1 rounded-full ${
                        isOverdue(task) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <FontAwesomeIcon icon={isOverdue(task) ? faExclamationCircle : faCalendar} className="mr-1" />
                        {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        {isOverdue(task) && ' (Overdue)'}
                      </span>
                    )}

                    {task.is_completed && task.completed_at && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        Completed {format(new Date(task.completed_at), 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-400 mb-2">No tasks yet</p>
            <p className="text-gray-500">Create your first task to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add more details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {editingTask ? 'Update Task' : 'Create Task'}
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

export default Tasks;