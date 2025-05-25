import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition"
            >
                Logout
            </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome, {user?.name}</h3>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {user?.email}</p>
            <p className="text-gray-600"><span className="font-medium">Role:</span> {user?.role}</p>
        </div>

        <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Admin Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="p-4 bg-blue-100 rounded-lg text-blue-800 font-medium shadow-sm">Manage Users</li>
                <li className="p-4 bg-green-100 rounded-lg text-green-800 font-medium shadow-sm">System Settings</li>
                <li className="p-4 bg-yellow-100 rounded-lg text-yellow-800 font-medium shadow-sm">View Reports</li>
                <li className="p-4 bg-purple-100 rounded-lg text-purple-800 font-medium shadow-sm">Manage Roles</li>
            </ul>
        </div>
    </div>
</div>

  );
}

export default AdminDashboard;