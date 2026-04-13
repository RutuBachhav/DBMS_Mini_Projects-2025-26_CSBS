import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Bell, Send, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { user, api } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [notifications, setNotifications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: '', message: '', employee_id: 'all' });
  const [sending, setSending] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await api('/api/notifications');
      setNotifications(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    if (isAdmin) {
      api('/api/employees').then(setEmployees).catch(() => {});
    }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api('/api/notifications', { method: 'POST', body: JSON.stringify(form) });
      setToast({ message: 'Notification sent!', type: 'success' });
      setForm({ title: '', message: '', employee_id: 'all' });
      fetchNotifications();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setSending(false);
  };

  const markAllRead = async () => {
    try {
      await api('/api/notifications/read-all', { method: 'PUT' });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    try {
      await api(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="main-content">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1>Notifications</h1>
        <p>{isAdmin ? 'Send and manage notifications.' : 'Your notifications.'}</p>
      </div>

      {isAdmin && (
        <div className="card animate-in mb-6">
          <div className="card-header"><h2><Send size={18} style={{ marginRight: 8 }} />Send Notification</h2></div>
          <form onSubmit={handleSend}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notification title" />
              </div>
              <div className="form-group">
                <label>Send To</label>
                <select className="form-select" value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}>
                  <option value="all">All Employees</option>
                  {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-textarea" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Type your message..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <Send size={16} /> {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>
      )}

      <div className="card animate-in">
        <div className="card-header">
          <h2><Bell size={18} style={{ marginRight: 8 }} />{isAdmin ? 'Sent Notifications' : 'Your Notifications'}</h2>
          {!isAdmin && notifications.some(n => !n.is_read) && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}><CheckCheck size={14} /> Mark all read</button>
          )}
        </div>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.notification_id} className={`notification-item ${!n.is_read && !isAdmin ? 'unread' : ''}`}
              onClick={() => !n.is_read && !isAdmin && markRead(n.notification_id)} style={{ cursor: !n.is_read && !isAdmin ? 'pointer' : 'default' }}>
              {!n.is_read && !isAdmin && <div className="notification-dot" />}
              <div className="notification-content">
                <div className="notification-title">{n.title || 'Notification'}</div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">
                  {isAdmin && n.employee_name && `To: ${n.employee_name} · `}
                  {n.sent_time ? new Date(n.sent_time).toLocaleString() : ''}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state"><Bell size={48} /><p>No notifications</p></div>
        )}
      </div>
    </div>
  );
}
