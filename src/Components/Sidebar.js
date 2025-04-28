import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaSignOutAlt,
  FaClipboardList,
  FaChevronDown,
  FaChartLine,
  FaSearch,
  FaRegCalendarCheck,
  FaCheckCircle,
  FaTachometerAlt,
  FaTasks,
  FaUserTie	
} from 'react-icons/fa';
import { LayoutDashboard, FileBarChart, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <div
        className={`bg-gray-700 text-white font-sans ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } min-h-screen p-3 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold truncate">
            {isSidebarOpen && 'APQP Dashboard'}
          </div>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={toggleSidebar}
          >
            <FaBars size={24} /> {/* made bigger */}
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li className="relative">
              <Link
                to="/"
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaChartLine className="w-6 h-6" /> {/* bigger */}
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>
                  Dashboard
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Dashboard
                  </span>
                )}
              </Link>
            </li>

            {/* Enquiry Registration */}
            <li className="relative">
              <Link
                to="/enquiryform"
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaClipboardList className="w-4 h-4" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>
                  Enquiry Registration
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Enquiry Registration
                  </span>
                )}
              </Link>
            </li>

            {/* Templates Dropdown */}
            <li className="relative">
              <button
                onClick={() => handleDropdown('templates')}
                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <ClipboardCheck className="w-6 h-6" />
                <span className={`ml-3 flex-1 text-left ${!isSidebarOpen && 'sr-only'}`}>
                  Templates
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Templates
                  </span>
                )}
                {isSidebarOpen && (
                  <FaChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openDropdown === 'templates' ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {openDropdown === 'templates' && (
                <ul className={`${
                  isSidebarOpen ? 'ml-8 mt-1' : 'absolute left-full top-0 ml-2 bg-gray-800 p-2 rounded-lg shadow-xl z-10 min-w-[160px]'
                } space-y-2`}>
                  <li>
                    <Link
                      to="/apqpform"
                      className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg"
                    >
                      Add APQP Activity
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/reviewform"
                      className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg"
                    >
                      Add CheckPoints
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Status Dropdown */}
            <li className="relative">
              <button
                onClick={() => handleDropdown('status')}
                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaTasks className="w-6 h-6" />
                <span className={`ml-3 flex-1 text-left ${!isSidebarOpen && 'sr-only'}`}>
                  Status
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Status
                  </span>
                )}
                {isSidebarOpen && (
                  <FaChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openDropdown === 'status' ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {openDropdown === 'status' && (
                <ul className={`${
                  isSidebarOpen ? 'ml-8 mt-1' : 'absolute left-full top-0 ml-2 bg-gray-800 p-2 rounded-lg shadow-xl z-10 min-w-[160px]'
                } space-y-2`}>
                  <li>
                    <Link to="/enquirymgt" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Enquiry Status
                    </Link>
                  </li>
                  <li>
                    <Link to="/apqptimeplan" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      APQP Timeline
                    </Link>
                  </li>
                  <li>
                    <Link to="/feasibilityChart" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Feasibility Review
                    </Link>
                  </li>
                  <li>
                    <Link to="/pendingapqp" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Pending APQP
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* CFT Meeting */}
            <li className="relative">
              <Link
                to="/cft"
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaRegCalendarCheck className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>
                  CFT Meeting
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    CFT Meeting
                  </span>
                )}
              </Link>
            </li>

            {/* Lookups Dropdown */}
            <li className="relative">
              <button
                onClick={() => handleDropdown('lookups')}
                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaUserTie	 className="w-6 h-6" />
                <span className={`ml-3 flex-1 text-left ${!isSidebarOpen && 'sr-only'}`}>
                  Lookups
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Lookups
                  </span>
                )}
                {isSidebarOpen && (
                  <FaChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openDropdown === 'lookups' ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {openDropdown === 'lookups' && (
                <ul className={`${
                  isSidebarOpen ? 'ml-8 mt-1' : 'absolute left-full top-0 ml-2 bg-gray-800 p-2 rounded-lg shadow-xl z-10 min-w-[160px]'
                } space-y-2`}>
                  <li>
                    <Link to="/customer" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Customers
                    </Link>
                  </li>
                  <li>
                    <Link to="/supplier" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Suppliers
                    </Link>
                  </li>
                  <li>
                    <Link to="/user" className="flex items-center p-2 text-sm hover:bg-gray-700 rounded-lg">
                      Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Reports */}
            <li className="relative">
              <Link
                to="/account"
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaSearch className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>
                  Reports
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Reports
                  </span>
                )}
              </Link>
            </li>

            {/* Logout */}
            <li className="relative">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors group relative"
              >
                <FaSignOutAlt className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>
                  Logout
                </span>
                {!isSidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Logout
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white">
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                onClick={confirmLogout}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
