import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { FileText, Check, X, Plus } from 'lucide-react';

export default function LeaveRequests() {
  const { user, api } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Sick Leave', start_date: '', end_date: '', reason: ''
  });
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      if (isAdmin) {
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (filterDept) params.append('department', filterDept);
        const data = await api(`/api/leave?${params.toString()}`);
        setRequests(data);
      } else {
        const data = await api('/api/leave/my');
        setRequests(data);
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

  useEffect(() => { fetchRequests(); }, [filterStatus, filterDept]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api('/api/leave', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setToast({ message: 'Leave request submitted!', type: 'success' });
      setShowForm(false);
      setFormData({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
      fetchRequests();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  const handleAction = async (id, status) => {
    try {
      await api(`/api/leave/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setToast({ message: `Leave ${status}!`, type: 'success' });
      fetchRequests();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
  };

  return (
    <div className="main-content">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-header">
        <h1>Leave Requests</h1>
        <p>
          {isAdmin
            ? 'Review and manage employee leave requests.'
            : 'Submit and track your leave requests.'}
        </p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {isAdmin && (
          <>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="form-select"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </>
        )}
        <div className="toolbar-spacer" />
        {!isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> {showForm ? 'Cancel' : 'New Request'}
          </button>
        )}
      </div>

      {/* Leave Form (Employee) */}
      {showForm && !isAdmin && (
        <div className="card animate-in mb-6">
          <div className="card-header">
            <h2>Submit Leave Request</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  className="form-select"
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                >
                  <option>Sick Leave</option>
                  <option>Vacation</option>
                  <option>Personal</option>
                  <option>Emergency</option>
                  <option>Maternity/Paternity</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input
                  className="form-input"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Brief reason..."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card animate-in">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                {isAdmin && <th>Department</th>}
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.leave_id}>
                  {isAdmin && <td>{r.name}</td>}
                  {isAdmin && (
                    <td>
                      <span className="badge badge-purple">{r.department}</span>
                    </td>
                  )}
                  <td>{r.leave_type}</td>
                  <td style={{ fontSize: 'var(--font-xs)', whiteSpace: 'nowrap' }}>
                    {new Date(r.start_date + 'T00:00').toLocaleDateString('en', {
                      month: 'short', day: 'numeric'
                    })}
                    {r.start_date !== r.end_date && (
                      ` — ${new Date(r.end_date + 'T00:00').toLocaleDateString('en', {
                        month: 'short', day: 'numeric'
                      })}`
                    )}
                  </td>
                  <td style={{
                    color: 'var(--text-secondary)',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {r.reason || '—'}
                  </td>
                  <td>{getStatusBadge(r.status)}</td>
                  {isAdmin && (
                    <td>
                      {r.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAction(r.leave_id, 'approved')}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(r.leave_id, 'rejected')}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: 'var(--font-xs)'
                        }}>
                          Resolved
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && requests.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <p>No leave requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
