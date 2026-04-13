import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

export default function ManageEmployees() {
  const { api } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (filterDept) params.append('department', filterDept);
      if (search) params.append('search', search);
      const data = await api(`/api/employees?${params.toString()}`);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const data = await api('/api/employees/departments');
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { fetchEmployees(); }, [filterDept, search]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await api('/api/employees', {
          method: 'POST',
          body: JSON.stringify(editData),
        });
        setToast({ message: 'Employee added successfully!', type: 'success' });
      } else {
        await api(`/api/employees/${editData.employee_id}`, {
          method: 'PUT',
          body: JSON.stringify(editData),
        });
        setToast({ message: 'Employee updated successfully!', type: 'success' });
      }
      setModal(null);
      setEditData({});
      fetchEmployees();
      fetchDepartments();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api(`/api/employees/${id}`, { method: 'DELETE' });
      setToast({ message: 'Employee deleted.', type: 'success' });
      fetchEmployees();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="main-content">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1>Manage Employees</h1>
        <p>Add, edit, and manage employee records.</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
        <select className="form-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ minWidth: 160 }}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="toolbar-spacer" />
        <button className="btn btn-primary" onClick={() => { setModal('add'); setEditData({}); }}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="card animate-in">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Joined</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.employee_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {emp.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                  <td><span className="badge badge-purple">{emp.department}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                    {emp.created_at ? new Date(emp.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => { setModal('edit'); setEditData(emp); }}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => handleDelete(emp.employee_id, emp.name)}
                        title="Delete"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && employees.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>No employees found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Employee' : 'Edit Employee'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" required value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="John Smith" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-input" required value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="john@company.com" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input className="form-input" required value={editData.department || ''} onChange={(e) => setEditData({ ...editData, department: e.target.value })} placeholder="Engineering" />
                  </div>
                </div>
                <div className="form-group">
                  <label>{modal === 'edit' ? 'New Password (leave blank to keep)' : 'Password'}</label>
                  <input type="password" className="form-input" required={modal === 'add'} value={editData.password || ''} onChange={(e) => setEditData({ ...editData, password: e.target.value })} placeholder="••••••••" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (modal === 'add' ? 'Add Employee' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
