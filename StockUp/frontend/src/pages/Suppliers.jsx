import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      alert('Error saving supplier');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        alert('Error deleting supplier');
      }
    }
  };

  const editSupplier = (sup) => {
    setFormData({
      name: sup.name,
      contact_person: sup.contact_person || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || ''
    });
    setEditingId(sup.supplier_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <span>🤝</span> Suppliers
          </h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-white flex items-center gap-2 transition"
          >
            ← Back to Dashboard
          </button>
        </header>

        <section className="bg-gray-800 p-8 rounded-xl shadow-2xl mb-10 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-blue-400">
            {editingId ? 'Update Supplier Details' : 'Register New Supplier'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Supplier Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                placeholder="Business Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Contact Person</label>
              <input 
                name="contact_person"
                value={formData.contact_person}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Email Address</label>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                placeholder="contact@supplier.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Phone Number</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Business Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500 resize-none"
                placeholder="123 Street Name, City, Country"
              />
            </div>
            <div className="lg:col-span-3 flex gap-4 mt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-12 py-3.5 rounded-lg font-bold transition-all transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Supplier' : 'Add Supplier'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' }); }}
                  className="bg-gray-700 hover:bg-gray-600 px-8 py-3.5 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Supplier & Address</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Communication</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {suppliers.map((sup) => (
                  <tr key={sup.supplier_id} className="hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{sup.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sup.address || 'No address provided'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {sup.contact_person || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-blue-400">{sup.email || 'No email'}</div>
                      <div className="text-gray-400 text-xs">{sup.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-4">
                        <button 
                          onClick={() => editSupplier(sup)}
                          className="text-amber-500 hover:text-amber-400 font-medium transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteSupplier(sup.supplier_id)}
                          className="text-rose-500 hover:text-rose-400 font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {suppliers.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-gray-500 italic">
                      <div className="text-4xl mb-2 text-gray-700">🏢</div>
                      No suppliers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Suppliers;
