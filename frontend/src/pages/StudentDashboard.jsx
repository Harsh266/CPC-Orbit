import { useAuth } from '../context/AuthContext';

function StudentDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="user-info">
        <h3>Welcome, {user?.name}</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
      <div className="dashboard-content">
        <h3>Student Features</h3>
        <ul>
          <li>View Courses</li>
          <li>Access Materials</li>
          <li>Submit Assignments</li>
          <li>Check Grades</li>
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

export default StudentDashboard;