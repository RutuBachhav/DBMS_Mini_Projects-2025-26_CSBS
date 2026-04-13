import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { LogIn, LogOut, Clock, CalendarCheck, FileText, Bell } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user, api } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [today, attendance, leaves, notifs] = await Promise.all([
        api('/api/attendance/today'),
        api('/api/attendance/my'),
        api('/api/leave/my'),
        api('/api/notifications/unread-count'),
      ]);
      setTodayRecord(today);
      setRecentAttendance(attendance.slice(0, 5));
      setRecentLeaves(leaves.slice(0, 3));
      setUnreadCount(notifs.count);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckin = async () => {
    setActionLoading(true);
    try {
      const data = await api('/api/attendance/checkin', { method: 'POST' });
      setToast({ message: `Checked in at ${data.check_in_time}`, type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  const handleCheckout = async () => {
    setActionLoading(true);
    try {
      const data = await api('/api/attendance/checkout', { method: 'POST' });
      setToast({ message: `Checked out. Worked ${data.hours_worked}h`, type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  const timeStr = currentTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const getStatusBadge = (status) => {
    const map = {
      present: 'badge-success', late: 'badge-warning', absent: 'badge-danger',
      'half-day': 'badge-info', pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger'
    };
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
  };

  const checkedIn = todayRecord && !todayRecord.check_out_time;
  const checkedOut = todayRecord && todayRecord.check_out_time;

  return (
    <div className="main-content">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p>Here's your attendance overview for today.</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card accent animate-in">
          <div className="stat-icon"><CalendarCheck size={22} /></div>
          <div className="stat-value">{recentAttendance.filter(a => a.status === 'present' || a.status === 'late').length}</div>
          <div className="stat-label">Days Present (Recent)</div>
        </div>
        <div className="stat-card info animate-in" style={{ animationDelay: '0.05s' }}>
          <div className="stat-icon"><FileText size={22} /></div>
          <div className="stat-value">{recentLeaves.filter(l => l.status === 'pending').length}</div>
          <div className="stat-label">Pending Leaves</div>
        </div>
        <div className="stat-card teal animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon"><Bell size={22} /></div>
          <div className="stat-value">{unreadCount}</div>
          <div className="stat-label">Unread Notifications</div>
        </div>
      </div>

      {/* Check-in/out Card */}
      <div className="card animate-in mb-6" style={{ animationDelay: '0.15s' }}>
        <div className="checkin-section">
          <div className="checkin-time">{timeStr}</div>
          <div className="checkin-date">{dateStr}</div>

          {!todayRecord && (
            <button className="btn btn-success checkin-btn" onClick={handleCheckin} disabled={actionLoading}>
              <LogIn size={22} />
              {actionLoading ? 'Processing...' : 'Check In'}
            </button>
          )}

          {checkedIn && (
            <>
              <button className="btn btn-danger checkin-btn" onClick={handleCheckout} disabled={actionLoading}>
                <LogOut size={22} />
                {actionLoading ? 'Processing...' : 'Check Out'}
              </button>
              <div className="checkin-status badge-success" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
                <Clock size={14} style={{ marginRight: 6 }} />
                Checked in at {todayRecord.check_in_time}
              </div>
            </>
          )}

          {checkedOut && (
            <div className="checkin-status badge-info" style={{ background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info-border)' }}>
              <CalendarCheck size={14} style={{ marginRight: 6 }} />
              Completed — {todayRecord.check_in_time} to {todayRecord.check_out_time}
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Attendance */}
        <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <h2>Recent Attendance</h2>
          </div>
          {recentAttendance.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentAttendance.map(a => (
                    <tr key={a.id}>
                      <td>{new Date(a.date + 'T00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}</td>
                      <td>{a.check_in_time || '—'}</td>
                      <td>{a.check_out_time || '—'}</td>
                      <td>{getStatusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No attendance records yet</p></div>
          )}
        </div>

        {/* Recent Leave Requests */}
        <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
          <div className="card-header">
            <h2>Leave Requests</h2>
          </div>
          {recentLeaves.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Type</th><th>Dates</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentLeaves.map(l => (
                    <tr key={l.leave_id}>
                      <td>{l.leave_type}</td>
                      <td style={{ fontSize: 'var(--font-xs)' }}>
                        {new Date(l.start_date + 'T00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        {l.start_date !== l.end_date && ` — ${new Date(l.end_date + 'T00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}`}
                      </td>
                      <td>{getStatusBadge(l.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No leave requests yet</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
