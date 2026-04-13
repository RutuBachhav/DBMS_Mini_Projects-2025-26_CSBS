import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManageEmployees from './pages/ManageEmployees';
import AttendanceRecords from './pages/AttendanceRecords';
import LeaveRequests from './pages/LeaveRequests';
import Notifications from './pages/Notifications';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      {children}
    </div>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute role="admin"><AppLayout><ManageEmployees /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AppLayout><AttendanceRecords /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/leaves" element={<ProtectedRoute role="admin"><AppLayout><LeaveRequests /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedRoute role="employee"><AppLayout><EmployeeDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/employee/attendance" element={<ProtectedRoute role="employee"><AppLayout><AttendanceRecords /></AppLayout></ProtectedRoute>} />
          <Route path="/employee/leaves" element={<ProtectedRoute role="employee"><AppLayout><LeaveRequests /></AppLayout></ProtectedRoute>} />
          <Route path="/employee/notifications" element={<ProtectedRoute role="employee"><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
