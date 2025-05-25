import { useAuth } from '../context/AuthContext';

function FacultyDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h2>Faculty Dashboard</h2>
      <div className="user-info">
        <h3>Welcome, {user?.name}</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
      <div className="dashboard-content">
        <h3>Faculty Features</h3>
        <ul>
          <li>Manage Classes</li>
          <li>View Students</li>
          <li>Upload Materials</li>
          <li>Create Assignments</li>
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

export default FacultyDashboard;