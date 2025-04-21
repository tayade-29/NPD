import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaPlusCircle,
  FaChevronDown
} from 'react-icons/fa';
import {
  ChartColumnDecreasing,
  CheckCircle,
  FileText,
  FileBarChart,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFormsOpen, setFormsOpen] = useState(false);
  const [isLookupOpen, setLookupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleForms = () => {
    setFormsOpen(!isFormsOpen);
    if (isLookupOpen) setLookupOpen(false);
  };
  const toggleLookup = () => {
    setLookupOpen(!isLookupOpen);
    if (isFormsOpen) setFormsOpen(false);
  };
  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div className={`bg-[#1D3461] text-white font-sans ${isSidebarOpen ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300`}>        
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold">{isSidebarOpen && 'Dashboard'}</div>
          <button className="text-white" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li title="Dashboard" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/" className="flex items-center">
                <ChartColumnDecreasing className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Dashboard</span>
              </Link>
            </li>
            <li title="Enquiry Registration" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/enquiryform" className="flex items-center">
                <FaClipboardList className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Enquiry Registration</span>
              </Link>
            </li>
            <li title="Enquiry Status Update" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/enquirydetails" className="flex items-center">
                <CheckCircle className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Enquiry Status Update</span>
              </Link>
            </li>
            <li title="Add APQP Activity" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/apqpform" className="flex items-center">
                <FaPlusCircle className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Add APQP Activity</span>
              </Link>
            </li>
            <li title="Add CheckPoints" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/reviewform" className="flex items-center">
                <FaPlusCircle className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Add CheckPoints</span>
              </Link>
            </li>
            <li title="Forms" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative" onClick={toggleForms}>
              <FaClipboardList className="text-xl" />
              <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Forms</span>
              {isSidebarOpen && <FaChevronDown className={`ml-auto transition-transform ${isFormsOpen ? 'rotate-180' : ''}`} />}
              {isSidebarOpen && isFormsOpen && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-[#1D3461] text-white rounded-lg shadow-lg p-4 z-50">
                  <h3 className="text-white font-semibold mb-2"> Forms</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/apqptimeplan" className="hover:text-blue-300">APQP Time Plan Chart</Link></li>
                    <li><Link to="/feasibilityChart" className="hover:text-blue-300">Feasibility Review Form</Link></li>
                  </ul>
                </div>
              )}
              {!isSidebarOpen && isFormsOpen && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-[#1D3461] text-white rounded-lg shadow-lg p-4 z-50">
                  <h3 className="text-white font-semibold mb-2"> Forms</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/apqptimeplan" className="hover:text-blue-300">APQP Time Plan Chart</Link></li>
                    <li><Link to="/feasibilityChart" className="hover:text-blue-300">Feasibility Review Form</Link></li>
                  </ul>
                </div>
              )}
            </li>
            <li title="Lookups" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative cursor-pointer" onClick={toggleLookup}>
              <FaUser className="text-xl" />
              <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Lookups</span>
              {isSidebarOpen && <FaChevronDown className={`ml-auto transition-transform ${isLookupOpen ? 'rotate-180' : ''}`} />}
              {!isSidebarOpen && isLookupOpen && (
                <div className="absolute left-full top-0 ml-2 w-64 bg-[#1D3461] text-white rounded-lg shadow-lg p-4 z-50">
                  <h3 className="text-white font-semibold mb-2"> Lookups</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/customer" className="hover:text-blue-300">Customer</Link></li>
                    <li><Link to="/supplier" className="hover:text-blue-300">Toolmaker/Supplier</Link></li>
                    <li><Link to="/user" className="hover:text-blue-300">User</Link></li>
                  </ul>
                </div>
              )}
            </li>
            <li title="Report" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/account" className="flex items-center">
                <FileBarChart className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Report</span>
              </Link>
            </li>
            <li title="Account" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative">
              <Link to="/account" className="flex items-center">
                <FaUser className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Account</span>
              </Link>
            </li>
            <li title="Logout" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative cursor-pointer" onClick={handleLogout}>
              <FaSignOutAlt className="text-xl" />
              <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={confirmLogout}>Yes</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;