import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, CalendarCheck, FileText, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { api } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/attendance/report')
      .then(data => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-header"><h1>Dashboard</h1><p>Loading analytics...</p></div>
        <div className="stats-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-card accent" style={{ minHeight: 120 }}>
              <div className="loading-pulse" style={{ height: 20, background: 'var(--bg-glass)', borderRadius: 4, marginBottom: 8, width: '40%' }} />
              <div className="loading-pulse" style={{ height: 32, background: 'var(--bg-glass)', borderRadius: 4, width: '30%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxTrend = Math.max(...(report?.trend?.map(t => t.present) || [1]), 1);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's today's overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card accent animate-in">
          <div className="stat-icon"><Users size={22} /></div>
          <div className="stat-value">{report?.totalEmployees || 0}</div>
          <div className="stat-label">Total Employees</div>
        </div>

        <div className="stat-card success animate-in" style={{ animationDelay: '0.05s' }}>
          <div className="stat-icon"><CalendarCheck size={22} /></div>
          <div className="stat-value">{report?.presentToday || 0}</div>
          <div className="stat-label">Present Today</div>
        </div>

        <div className="stat-card warning animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon"><Clock size={22} /></div>
          <div className="stat-value">{report?.lateToday || 0}</div>
          <div className="stat-label">Late Arrivals</div>
        </div>

        <div className="stat-card danger animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="stat-icon"><AlertTriangle size={22} /></div>
          <div className="stat-value">{report?.absentToday || 0}</div>
          <div className="stat-label">Absent Today</div>
        </div>

        <div className="stat-card purple animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon"><FileText size={22} /></div>
          <div className="stat-value">{report?.pendingLeaves || 0}</div>
          <div className="stat-label">Pending Leaves</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Attendance Trend */}
        <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
          <div className="card-header">
            <h2><TrendingUp size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />7-Day Trend</h2>
          </div>
          <div className="chart-container">
            {report?.trend?.map((t, i) => {
              const pct = maxTrend > 0 ? (t.present / maxTrend) * 100 : 0;
              const dayName = new Date(t.date + 'T00:00').toLocaleDateString('en', { weekday: 'short' });
              return (
                <div key={i} className="chart-bar-wrapper">
                  <div className="chart-value">{t.present}</div>
                  <div className="chart-bar" style={{ height: `${Math.max(pct, 5)}%` }} />
                  <div className="chart-label">{dayName}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="card animate-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <h2><Users size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />Department Overview</h2>
          </div>
          <div className="dept-grid">
            {report?.deptBreakdown?.map((d, i) => (
              <div key={i} className="dept-item">
                <div className="dept-name">{d.department}</div>
                <div className="dept-bar-bg">
                  <div className="dept-bar-fill" style={{ width: `${d.total > 0 ? (d.present_today / d.total) * 100 : 0}%` }} />
                </div>
                <div className="dept-stats">
                  {d.present_today} / {d.total} present
                </div>
              </div>
            ))}
          </div>
          {(!report?.deptBreakdown || report.deptBreakdown.length === 0) && (
            <div className="empty-state"><p>No department data available</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
