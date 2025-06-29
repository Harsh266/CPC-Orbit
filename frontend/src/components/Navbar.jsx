import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import api from '../services/api'; // Adjust the import based on your project structure

const Navbar = () => {
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await api.get('/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('adminToken')}`,
          },
        });

        if (res.data.admin) {
          setAdminInfo(res.data.admin);
        } else if (res.data.message) {
          const nameFromMsg = res.data.message.replace('Welcome, Admin ', '').trim();
          setAdminInfo({ name: nameFromMsg, email: '' });
        }
      } catch (err) {
        alert('Session expired, please login again');
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const goToPage = (path) => {
    navigate(path);
    setIsMenuOpen(false); // close menu after navigation
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
      <h1
        className="text-xl font-bold text-[#19376D] cursor-pointer"
        onClick={() => goToPage('/admin/dashboard')}
      >
        Admin Panel
      </h1>

      <div className="relative" ref={menuRef}>
        <FaUserCircle
          className="text-3xl text-gray-700 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-4 px-5 z-50">
            <p className="text-lg font-semibold text-gray-900 truncate">
              {adminInfo.name || 'Admin Name'}
            </p>
            <p className="text-sm text-gray-500 truncate mb-3">
              {adminInfo.email || 'admin@example.com'}
            </p>
            <hr className="border-gray-200 mb-3" />
            <button
              onClick={() => goToPage('/admin/profile')}
              className="w-full text-left px-3 py-2 rounded hover:bg-green-50 text-green-700 font-medium"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
