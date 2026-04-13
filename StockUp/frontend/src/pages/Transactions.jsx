import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [products, setProducts] = useState([]);
  const [type, setType] = useState('SALE');
  const [items, setItems] = useState([{ product_id: '', quantity: 1, price: 0, current_stock: 0 }]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/transactions');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  const addItemRow = () => {
    setItems([...items, { product_id: '', quantity: 1, price: 0, current_stock: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'product_id') {
      const product = products.find(p => p.product_id === parseInt(value));
      if (product) {
        newItems[index].price = product.price;
        newItems[index].current_stock = product.quantity;
      } else {
        newItems[index].current_stock = 0;
      }
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/transactions', { type, items });
      alert(`${type} Completed Successfully!`);
      setItems([{ product_id: '', quantity: 1, price: 0, current_stock: 0 }]);
      fetchProducts();
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.error || 'Transaction failed. Check stock levels.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-500 drop-shadow-sm tracking-tight flex items-center gap-3">
            <span className="bg-blue-600/10 p-2 rounded-lg">🛒</span> Transactions
          </h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-white flex items-center gap-2 transition font-medium"
          >
            ← Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* New Transaction Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 ring-1 ring-white/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-100 italic tracking-wide">Record New Activity</h2>
                <div className="flex bg-gray-900/50 rounded-xl p-1 border border-gray-700">
                  <button 
                    type="button"
                    onClick={() => setType('SALE')}
                    className={`px-6 py-2 rounded-lg text-xs font-black tracking-widest transition-all duration-300 ${type === 'SALE' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 translate-y-[-1px]' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    SALE
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('PURCHASE')}
                    className={`px-6 py-2 rounded-lg text-xs font-black tracking-widest transition-all duration-300 ${type === 'PURCHASE' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 translate-y-[-1px]' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    PURCHASE
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-900/40 p-5 rounded-xl border border-gray-700/50 group transition-all hover:border-blue-500/30">
                      <div className="md:col-span-6">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Product</label>
                        <select 
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          required
                        >
                          <option value="">Select Item</option>
                          {products.map(p => (
                            <option key={p.product_id} value={p.product_id}>{p.name} (SKU: {p.sku})</option>
                          ))}
                        </select>
                        {item.product_id && (
                          <div className="mt-2 text-[10px] flex gap-2 ml-1">
                            <span className="text-gray-500 uppercase">Available:</span> 
                            <span className={`font-bold ${item.current_stock < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {item.current_stock} pcs
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Qty</label>
                        <input 
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Price/Unit</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                          <input 
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full p-3 pl-7 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            required
                          />
                        </div>
                      </div>
                      <div className="md:col-span-1 flex justify-center md:pt-6">
                        <button 
                          type="button" 
                          onClick={() => removeItemRow(index)}
                          className="text-gray-600 hover:text-rose-500 p-2 rounded-full hover:bg-rose-500/10 transition-colors"
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/30 p-6 rounded-2xl border border-gray-700 border-dashed">
                  <button 
                    type="button" 
                    onClick={addItemRow}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition group"
                  >
                    <span className="bg-blue-400/10 p-1.5 rounded-lg group-hover:bg-blue-400/20">+</span>
                    Add Another Item
                  </button>
                  <div className="text-right mt-4 md:mt-0">
                    <div className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Grand Total</div>
                    <div className="text-4xl font-black text-emerald-500 drop-shadow-lg font-mono">
                      ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter shadow-2xl transition-all duration-300 transform active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 ${type === 'SALE' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'}`}
                >
                  {loading ? 'CONFIRMING...' : `COMPLETE ${type} TRANSACTION`}
                </button>
              </form>
            </section>
          </div>

          {/* Activity Logs Sidebar */}
          <div className="lg:col-span-1">
            <section className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-3xl border border-gray-700 h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-lg font-black text-gray-300 mb-6 uppercase tracking-widest border-b border-gray-700 pb-4">Activity Stream</h2>
              <div className="space-y-4">
                {history.map((trans) => (
                  <div key={trans.transaction_id} className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/30 hover:border-gray-600 transition group relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${trans.type === 'SALE' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-tighter ${trans.type === 'SALE' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                        {trans.type}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">{new Date(trans.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xl font-bold font-mono group-hover:text-white transition-colors">
                      ${Number(trans.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="text-[9px] text-gray-700 font-bold">#TRX-{trans.transaction_id.toString().padStart(4, '0')}</div>
                      <div className="text-[9px] text-blue-500/50 font-bold group-hover:text-blue-500 transition-colors cursor-pointer">DETAILS →</div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-20 text-gray-700">
                    <div className="text-5xl mb-4 opacity-10">📑</div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-30">No transactions recorded</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
