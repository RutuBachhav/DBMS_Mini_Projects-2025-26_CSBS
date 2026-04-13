import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    price: 0,
    category_id: '',
    supplier_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  // api.js interceptor handles token

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, supRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setFormData({ 
        name: '', 
        sku: '', 
        description: '', 
        quantity: 0, 
        price: 0, 
        category_id: '', 
        supplier_id: '' 
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product. Check SKU uniqueness.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? All stock history will be lost.')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const editProduct = (prod) => {
    setFormData({
      name: prod.name,
      sku: prod.sku,
      description: prod.description || '',
      quantity: prod.quantity,
      price: prod.price,
      category_id: prod.category_id || '',
      supplier_id: prod.supplier_id || ''
    });
    setEditingId(prod.product_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <span>📦</span> Product Management
          </h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </header>

        <section className="bg-gray-800 p-8 rounded-xl shadow-2xl mb-10 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-blue-400">
            {editingId ? 'Edit Product Details' : 'Add New Product to Inventory'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Product Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500" 
                placeholder="Product title"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">SKU (Stock Keeping Unit)</label>
              <input 
                name="sku" 
                value={formData.sku} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500" 
                placeholder="e.g. ELEC-001" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Category</label>
              <select 
                name="category_id" 
                value={formData.category_id} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Supplier</label>
              <select 
                name="supplier_id" 
                value={formData.supplier_id} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Supplier</option>
                {suppliers.map(sup => <option key={sup.supplier_id} value={sup.supplier_id}>{sup.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Initial Quantity</label>
              <input 
                name="quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                min="0" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Price (USD)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                value={formData.price} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                min="0" 
                required 
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={onChange} 
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-gray-500" 
                rows="2"
                placeholder="Details about the product..."
              ></textarea>
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 hover:bg-blue-700 px-12 py-3.5 rounded-lg font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingId ? 'Update Product' : 'Register Product'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData({ name: '', sku: '', description: '', quantity: 0, price: 0, category_id: '', supplier_id: '' }); }} 
                  className="bg-gray-700 hover:bg-gray-600 px-10 py-3.5 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4 text-center">In-Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{prod.name}</div>
                      <div className="text-xs font-mono text-blue-500 mt-1">{prod.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-900/50 px-3 py-1 rounded text-gray-400 border border-gray-700">
                        {prod.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {prod.supplier_name || 'No Supplier'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${prod.quantity > 5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {prod.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-500">
                      ${Number(prod.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => editProduct(prod)} 
                          className="text-amber-500 hover:text-amber-400 font-medium transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteProduct(prod.product_id)} 
                          className="text-rose-500 hover:text-rose-400 font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">
                      <div className="text-5xl mb-4 text-gray-700">📦</div>
                      No products in inventory yet.
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

export default Products;
