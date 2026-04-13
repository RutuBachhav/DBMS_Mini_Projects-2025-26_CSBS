import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setName('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All linked data may be affected.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Error deleting category');
      }
    }
  };

  const editCategory = (cat) => {
    setName(cat.name);
    setEditingId(cat.category_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <span>🏷️</span> Categories
          </h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-white flex items-center gap-2 transition"
          >
            ← Back to Dashboard
          </button>
        </header>

        <section className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-500"
              placeholder="e.g. Mobile Phones, Office Supplies"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setName(''); }}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition"
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map((cat) => (
                <tr key={cat.category_id} className="hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-200">{cat.name}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-4">
                    <button 
                      onClick={() => editCategory(cat)}
                      className="text-amber-500 hover:text-amber-400 font-medium transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.category_id)}
                      className="text-rose-500 hover:text-rose-400 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center text-gray-500 italic">
                    No categories found. Start by adding one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Categories;
