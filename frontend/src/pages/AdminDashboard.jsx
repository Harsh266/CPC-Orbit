import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
          },
        });

        if (res.data.admin) {
          setAdminInfo(res.data.admin);
          setLoading(false);
        } else {
          throw new Error('Admin data not found');
        }
      } catch (err) {
        console.error('Session expired or unauthorized');
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-8 bg-gray-100">
          {loading ? (
            <p className="text-gray-600">Loading admin details...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, {adminInfo.name}
              </h1>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
