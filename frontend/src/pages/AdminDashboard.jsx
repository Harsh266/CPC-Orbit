import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="user-info">
        <h3>Welcome, {user?.name}</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
      <div className="dashboard-content">
        <h3>Admin Features</h3>
        <ul>
          <li>Manage Users</li>
          <li>System Settings</li>
          <li>View Reports</li>
          <li>Manage Roles</li>
        </ul>
      </div>
      <button 
        onClick={logout}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;