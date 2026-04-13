import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Filter } from 'lucide-react';

export default function AttendanceRecords() {
  const { user, api } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({ date: '', department: '', from: '', to: '' });
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const params = new URLSearchParams();
      if (isAdmin) {
        if (filters.date) params.append('date', filters.date);
        if (filters.department) params.append('department', filters.department);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        const data = await api(`/api/attendance?${params.toString()}`);
        setRecords(data);
      } else {
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        const data = await api(`/api/attendance/my?${params.toString()}`);
        setRecords(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      api('/api/employees/departments').then(setDepartments).catch(() => {});
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [filters]);

  const getStatusBadge = (status) => {
    const map = { present: 'badge-success', late: 'badge-warning', absent: 'badge-danger', 'half-day': 'badge-info' };
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>{isAdmin ? 'Attendance Records' : 'My Attendance'}</h1>
        <p>{isAdmin ? 'View and filter all employee attendance records.' : 'View your attendance history.'}</p>
      </div>

      {/* Filters */}
      <div className="toolbar">
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        {isAdmin && (
          <>
            <input type="date" className="form-input" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} style={{ width: 'auto' }} />
            <select className="form-select" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} style={{ minWidth: 160 }}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </>
        )}
        <input type="date" className="form-input" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} style={{ width: 'auto' }} placeholder="From" />
        <input type="date" className="form-input" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} style={{ width: 'auto' }} placeholder="To" />
        {(filters.date || filters.department || filters.from || filters.to) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ date: '', department: '', from: '', to: '' })}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card animate-in">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                {isAdmin && <th>Department</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                          {(r.name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        {r.name}
                      </div>
                    </td>
                  )}
                  {isAdmin && <td><span className="badge badge-purple">{r.department}</span></td>}
                  <td>{new Date(r.date + 'T00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td>{r.check_in_time || '—'}</td>
                  <td>{r.check_out_time || '—'}</td>
                  <td>{getStatusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && records.length === 0 && (
          <div className="empty-state">
            <CalendarCheck size={48} />
            <p>No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  );
}
