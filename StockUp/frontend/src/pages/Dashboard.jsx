import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
    total_sales: 0
  });
  const [alerts, setAlerts] = useState({
    low_stock_items: [],
    out_of_stock_items: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Interceptor in api.js handles token

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/alerts')
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-gray-400 font-bold tracking-widest uppercase text-xs">Assembling Insights...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter flex items-center gap-3">
            <span className="text-blue-500">StockUp</span> Command Center
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Monitoring operations for {user.name || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Session Active</div>
            <div className="text-emerald-500 text-[10px] font-bold">● Network Stable</div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-rose-600 hover:text-white text-gray-400 px-6 py-3 rounded-2xl border border-gray-700 hover:border-transparent transition-all duration-300 font-bold text-sm shadow-xl"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main>
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800 p-8 rounded-3xl shadow-3xl border border-gray-700 ring-1 ring-white/5 relative group transition-all hover:translate-y-[-4px]">
            <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:scale-110 transition-transform">📦</div>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Inventory</div>
            <div className="text-4xl font-black text-white flex items-baseline gap-2">
              {stats.total_products}
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">SKUs</span>
            </div>
            <div className="mt-4 w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[75%]"></div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-3xl shadow-3xl border border-gray-700 ring-1 ring-white/5 relative group transition-all hover:translate-y-[-4px]">
            <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:scale-110 transition-transform">💎</div>
            <div className="text-emerald-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Gross Revenue</div>
            <div className="text-4xl font-black text-white font-mono tracking-tighter">
              ${Number(stats.total_sales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-4 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">All-time Sales Peak</div>
          </div>

          <div className="bg-gray-800 p-8 rounded-3xl shadow-3xl border border-gray-700 ring-1 ring-white/5 relative group transition-all hover:translate-y-[-4px]">
            <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:scale-110 transition-transform">⚡</div>
            <div className="text-amber-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Low Stock Warning</div>
            <div className="text-4xl font-black text-white flex items-baseline gap-2">
              {stats.low_stock_count}
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Items</span>
            </div>
            <div className="mt-4 text-[10px] text-amber-500 font-bold uppercase tracking-wider">Needs Attention</div>
          </div>

          <div className="bg-gray-800 p-8 rounded-3xl shadow-3xl border border-gray-700 ring-1 ring-white/5 relative group transition-all hover:translate-y-[-4px]">
            <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:scale-110 transition-transform">🔥</div>
            <div className="text-rose-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Stock Overdue</div>
            <div className="text-4xl font-black text-rose-500 flex items-baseline gap-2">
              {stats.out_of_stock_count}
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Out</span>
            </div>
            <div className="mt-4 text-[10px] text-rose-500 font-bold uppercase tracking-wider">Lost Opportunity</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Navigation Matrix */}
          <div className="lg:col-span-3">
            <section className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl space-y-8 sticky top-8">
              <div>
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  Navigation Matrix
                </h3>
                <nav className="space-y-2">
                  <button onClick={() => navigate('/products')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 hover:bg-blue-600/10 hover:text-blue-400 transition-all group font-bold text-sm border border-transparent hover:border-blue-500/20">
                    <span>📦 Manage Inventory</span> <span className="text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                  </button>
                  <button onClick={() => navigate('/transactions')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 hover:bg-emerald-600/10 hover:text-emerald-400 transition-all group font-bold text-sm border border-transparent hover:border-emerald-500/20">
                    <span>🛒 New Transaction</span> <span className="text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                  </button>
                  <button onClick={() => navigate('/categories')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 hover:bg-amber-600/10 hover:text-amber-400 transition-all group font-bold text-sm border border-transparent hover:border-amber-500/20">
                    <span>🏷️ Category Hub</span> <span className="text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                  </button>
                  <button onClick={() => navigate('/suppliers')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 hover:bg-indigo-600/10 hover:text-indigo-400 transition-all group font-bold text-sm border border-transparent hover:border-indigo-500/20">
                    <span>🤝 Supplier Portal</span> <span className="text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                  </button>
                </nav>
              </div>
              
              <div className="pt-8 border-t border-gray-700/50">
                <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/10">
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Pro Tip</p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">Clicking "Restock" will automatically take you to a Purchase transaction.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Actionable Insights Center */}
          <div className="lg:col-span-9 space-y-10">
            {/* Depleted Stock Alerts */}
            {alerts.out_of_stock_items.length > 0 && (
              <section className="bg-gray-800 rounded-3xl border border-rose-500/30 shadow-4xl overflow-hidden ring-1 ring-rose-500/10">
                <div className="bg-rose-500/5 px-8 py-5 flex items-center justify-between border-b border-rose-500/20">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                    <h3 className="text-rose-500 font-extrabold text-sm uppercase tracking-[0.2em]">Depleted Stock Alert</h3>
                  </div>
                  <span className="text-rose-800 font-black text-[10px] uppercase">Urgent Action Required</span>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {alerts.out_of_stock_items.map((item, id) => (
                    <div key={id} className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-700/20 transition-all group">
                      <div className="mb-4 md:mb-0">
                        <div className="font-black text-lg text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{item.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-3">
                          <span className="bg-gray-900 px-2 py-0.5 rounded text-blue-500">SKU: {item.sku}</span>
                          <span>|</span>
                          <span>Partner: {item.supplier_name || 'Generic'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/transactions')} 
                        className="w-full md:w-auto px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs tracking-widest transition-all shadow-xl shadow-rose-900/20 active:scale-95"
                      >
                        REORDER IMMEDIATELY
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Low Inventory Monitoring */}
            <section className="bg-gray-800 rounded-3xl border border-gray-700 shadow-4xl overflow-hidden ring-1 ring-white/5">
              <div className="bg-gray-900/40 px-8 py-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  Low Inventory Watchlist
                </h3>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none">Healthy threshold: 10 units</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/30 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4 border-b border-gray-700">Product Specification</th>
                      <th className="px-8 py-4 border-b border-gray-700">Classification</th>
                      <th className="px-8 py-4 border-b border-gray-700 text-center">Remaining</th>
                      <th className="px-8 py-4 border-b border-gray-700 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {alerts.low_stock_items.length > 0 ? alerts.low_stock_items.map((item, id) => (
                      <tr key={id} className="hover:bg-gray-700/30 transition-all group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono italic mt-1">{item.sku}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-gray-900 px-3 py-1 rounded text-[10px] font-black text-gray-400 hover:text-white transition-colors cursor-default">
                            {item.category_name || 'General'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-[10px] font-black inline-block border border-amber-500/20">
                            {item.quantity} UNITS
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => navigate('/transactions')} 
                            className="text-blue-500 hover:text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 px-4 py-2 rounded-lg transition-all"
                          >
                            RESTOCK
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                          <div className="text-gray-700 text-6xl mb-6 opacity-20 transform hover:scale-110 transition-transform cursor-default">📊</div>
                          <p className="text-xs font-black text-gray-700 uppercase tracking-[0.4em]">Inventory Optimal • No Warnings</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <footer className="bg-gray-900/20 px-8 py-4 border-t border-gray-700 flex justify-center">
                <button onClick={() => navigate('/products')} className="text-[10px] font-black text-gray-600 hover:text-blue-500 transition-colors uppercase tracking-widest">
                  View Full Inventory Manifest →
                </button>
              </footer>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
