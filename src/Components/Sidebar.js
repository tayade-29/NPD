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
  FaTasks,
  FaFileAlt
} from 'react-icons/fa';
import { ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
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

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
    setOpenDropdown(null);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bg-gray-700 text-white font-sans ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } h-screen p-3 transition-all duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold truncate">
            {isSidebarOpen && 'APQP Dashboard'}
          </div>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link to="/" onClick={handleLinkClick} className="flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors">
                <FaChartLine className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/enquiryform" onClick={handleLinkClick} className="flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors">
                <FaClipboardList className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>Enquiry Registration</span>
              </Link>
            </li>

            {/* Templates */}
            <Dropdown
              label="Templates"
              icon={<ClipboardCheck className="w-6 h-6" />}
              isSidebarOpen={isSidebarOpen}
              isOpen={openDropdown === 'templates'}
              toggle={() => handleDropdown('templates')}
            >
              <DropdownLink to="/apqpform" onClick={handleLinkClick} label="Add APQP Activity" />
              <DropdownLink to="/reviewform" onClick={handleLinkClick} label="Add CheckPoints" />
            </Dropdown>

            {/* Status */}
            <Dropdown
              label="Status"
              icon={<FaTasks className="w-6 h-6" />}
              isSidebarOpen={isSidebarOpen}
              isOpen={openDropdown === 'status'}
              toggle={() => handleDropdown('status')}
            >
              <DropdownLink to="/enquirymgt" onClick={handleLinkClick} label="Update Enquiry Status" />
              <DropdownLink to="/pendingapqp" onClick={handleLinkClick} label="Pending APQP Time Plan" />
              <DropdownLink to="/apqptimeplan" onClick={handleLinkClick} label="Update APQP Time Plan" />
              <DropdownLink to="/frt" onClick={handleLinkClick} label="Technical Feasibility Review" />
            </Dropdown>

            <li>
              <Link to="/cft" onClick={handleLinkClick} className="flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors">
                <FaRegCalendarCheck className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>CFT Meeting</span>
              </Link>
            </li>

            {/* Lookups */}
            <Dropdown
              label="Lookups"
              icon={<FaSearch className="w-6 h-6" />}
              isSidebarOpen={isSidebarOpen}
              isOpen={openDropdown === 'lookups'}
              toggle={() => handleDropdown('lookups')}
            >
              <DropdownLink to="/customer" onClick={handleLinkClick} label="Customers" />
              <DropdownLink to="/supplier" onClick={handleLinkClick} label="Suppliers" />
              <DropdownLink to="/user" onClick={handleLinkClick} label="Users" />
            </Dropdown>

            <li>
              <Link to="/account" onClick={handleLinkClick} className="flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors">
                <FaFileAlt className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>Reports</span>
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button onClick={handleLogout} className="w-full flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors">
                <FaSignOutAlt className="w-6 h-6" />
                <span className={`ml-3 ${!isSidebarOpen && 'sr-only'}`}>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white">
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={confirmLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Logout</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub Components
const Dropdown = ({ label, icon, isSidebarOpen, isOpen, toggle, children }) => (
  <li className="relative">
    <button
      onClick={toggle}
      className="w-full flex items-center p-3 hover:bg-gray-600 rounded-lg transition-colors"
    >
      {icon}
      <span className={`ml-3 flex-1 text-left ${!isSidebarOpen && 'sr-only'}`}>{label}</span>
      {isSidebarOpen && (
        <FaChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </button>
    {isOpen && (
      <ul className={`${isSidebarOpen ? 'ml-8 mt-1' : 'absolute left-full top-0 ml-2 bg-gray-800 p-2 rounded-lg shadow-lg z-50 min-w-[160px]'} space-y-2`}>
        {children}
      </ul>
    )}
  </li>
);

const DropdownLink = ({ to, onClick, label }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center p-2 text-sm hover:bg-gray-600 rounded-lg transition-colors"
    >
      {label}
    </Link>
  </li>
);

export default Sidebar;
