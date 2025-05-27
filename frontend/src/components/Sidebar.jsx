// Sidebar.js
import React from 'react';
import {
  FaTachometerAlt ,FaUsers, FaUniversity, FaBook, FaClock, FaClipboardCheck,
  FaMoneyCheck, FaListAlt, FaUserCog, FaGraduationCap
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-[#19376D] text-white flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-gray-700">
        <img src="/public/Logo.png" alt="GU CPC" className="h-10 mr-2" />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => goToPage('/admin/dashboard')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaTachometerAlt /> {/* Example dashboard icon from react-icons */}
          <span>Dashboard</span>
        </button>
        <button onClick={() => goToPage('/admin/manage-coordinator')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaUserCog /><span>Manage Coordinator</span>
        </button>
        <button onClick={() => goToPage('/admin/users')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaUsers /><span>Users</span>
        </button>
        <button onClick={() => goToPage('/admin/colleges')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaUniversity /><span>Colleges</span>
        </button>
        <button onClick={() => goToPage('/admin/programs')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaBook /><span>Programs</span>
        </button>
        <button onClick={() => goToPage('/admin/subjects')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaBook /><span>Subjects</span>
        </button>
        <button onClick={() => goToPage('/admin/subject-allocation')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaListAlt /><span>Subject Allocation</span>
        </button>
        <button onClick={() => goToPage('/admin/students')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaGraduationCap /><span>Students</span>
        </button>
        <button onClick={() => goToPage('/admin/time-slot')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaClock /><span>Time Slot</span>
        </button>
        <button onClick={() => goToPage('/admin/attendance')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaClipboardCheck /><span>Attendance</span>
        </button>
        <button onClick={() => goToPage('/admin/payment-voucher')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaMoneyCheck /><span>Payment Voucher</span>
        </button>
        <button onClick={() => goToPage('/admin/attendance-report')} className="flex items-center space-x-2 hover:bg-[#1d3e7f] p-2 rounded">
          <FaClipboardCheck /><span>Attendance Report</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
