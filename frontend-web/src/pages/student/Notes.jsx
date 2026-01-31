import { useState, useEffect } from 'react';
import { noteService } from '../../services/noteService';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faStar, faTrash, faEdit, faTimes
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    color: '#FFFFFF',
    is_favorite: false
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'GENERAL', label: 'General' },
    { value: 'MATH', label: 'Mathematics' },
    { value: 'SCIENCE', label: 'Science' },
    { value: 'HISTORY', label: 'History' },
    { value: 'LANGUAGE', label: 'Language' },
    { value: 'EXAM_PREP', label: 'Exam Preparation' },
    { value: 'REVISION', label: 'Revision' },
    { value: 'OTHER', label: 'Other' },
  ];

  const colors = [
    { value: '#FFFFFF', label: 'White', class: 'bg-white' },
    { value: '#FEF3C7', label: 'Yellow', class: 'bg-yellow-100' },
    { value: '#DBEAFE', label: 'Blue', class: 'bg-blue-100' },
    { value: '#D1FAE5', label: 'Green', class: 'bg-green-100' },
    { value: '#FCE7F3', label: 'Pink', class: 'bg-pink-100' },
    { value: '#E0E7FF', label: 'Indigo', class: 'bg-indigo-100' },
    { value: '#FED7AA', label: 'Orange', class: 'bg-orange-100' },
  ];

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory]);

  const fetchNotes = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await noteService.getNotes(params);
      setNotes(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      const data = { ...formData, student: user.id };
      
      if (editingNote) {
        await noteService.updateNote(editingNote.id, data);
        toast.success('Note updated!');
      } else {
        await noteService.createNote(data);
        toast.success('Note created!');
      }
      
      setShowModal(false);
      resetForm();
      fetchNotes();
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
      is_favorite: note.is_favorite
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await noteService.deleteNote(id);
        toast.success('Note deleted');
        fetchNotes();
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const toggleFavorite = async (note) => {
    try {
      await noteService.updateNote(note.id, { is_favorite: !note.is_favorite });
      fetchNotes();
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'GENERAL',
      color: '#FFFFFF',
      is_favorite: false
    });
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.preview?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorClass = (colorValue) => {
    const color = colors.find(c => c.value === colorValue);
    return color ? color.class : 'bg-white';
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Notes 📝</h1>
            <p className="text-purple-100">Organize your study notes</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Note
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`${getColorClass(note.color)} rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 flex-1">{note.title}</h3>
                <button
                  onClick={() => toggleFavorite(note)}
                  className="text-yellow-500 hover:text-yellow-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faStar} className={note.is_favorite ? '' : 'opacity-30'} />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.preview || note.content}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{note.category}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <p className="text-xl mb-2">No notes yet</p>
            <p>Create your first note to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Note title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  required
                  rows="8"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your notes here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 ${color.class} ${
                          formData.color === color.value ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formData.is_favorite}
                  onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="favorite" className="text-sm font-medium text-gray-700">
                  Mark as favorite
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {editingNote ? 'Update Note' : 'Create Note'}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

export default Notes;