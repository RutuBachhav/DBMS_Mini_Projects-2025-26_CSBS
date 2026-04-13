import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, FileText,
  Bell, LogOut, Menu, X
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user?.role === 'employee') {
      api('/api/notifications/unread-count')
        .then(data => setUnreadCount(data.count))
        .catch(() => {});
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/employees', icon: Users, label: 'Manage Employees' },
    { to: '/admin/attendance', icon: CalendarCheck, label: 'Attendance Records' },
    { to: '/admin/leaves', icon: FileText, label: 'Leave Requests' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  ];

  const employeeLinks = [
    { to: '/employee', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/employee/attendance', icon: CalendarCheck, label: 'My Attendance' },
    { to: '/employee/leaves', icon: FileText, label: 'Leave Requests' },
    { to: '/employee/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : '?';

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`mobile-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <div>
            <h2>AttendX</h2>
            <span>{isAdmin ? 'Admin Panel' : 'Employee Portal'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Navigation</div>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
                {link.badge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: 'var(--danger)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
