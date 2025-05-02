import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaPlusCircle,
  FaChevronDown,
  FaChartBar,
  FaFileAlt,
  FaUsers,
  FaFile,
} from 'react-icons/fa';
import {
  ChartColumnDecreasing,
  CheckCircle,
  FileBarChart,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTemplateOpen, setTemplateOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isLookupOpen, setLookupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex relative">
      <div className={`bg-[#1D3461] text-white font-sans ${isSidebarOpen ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold">{isSidebarOpen && 'Dashboard'}</div>
          <button className="text-white" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">

            {/* Dashboard */}
            <li className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/" className="flex items-center">
                <ChartColumnDecreasing className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Dashboard</span>
              </Link>
            </li>

            {/* Enquiry Registration */}
            <li className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/enquiryform" className="flex items-center">
                <FaClipboardList className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Enquiry Registration</span>
              </Link>
            </li>

           {/* Add Template */}
<li title="Add Template" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative cursor-pointer" onClick={() => {
  setTemplateOpen(!isTemplateOpen);
  setStatusOpen(false);
  setLookupOpen(false);
}}>
  <FaPlusCircle className="text-xl" />
  <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Add Template</span>
  {isSidebarOpen && <FaChevronDown className={`ml-auto transition-transform ${isTemplateOpen ? 'rotate-180' : ''}`} />}
  {!isSidebarOpen && isTemplateOpen && (
    <div className="absolute left-full top-0 ml-2 w-64 bg-[#1D3461] text-white rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-white font-semibold mb-2">Add Template</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/apqpform" className="hover:text-blue-300">Add APQP Activity</Link></li>
        <li><Link to="/reviewform" className="hover:text-blue-300">Add Checkpoints</Link></li>
      </ul>
    </div>
  )}
</li>

{/* Status */}
<li title="Status" className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 relative cursor-pointer" onClick={() => {
  setStatusOpen(!isStatusOpen);
  setTemplateOpen(false);
  setLookupOpen(false);
}}>
  <CheckCircle className="text-xl" />
  <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Status</span>
  {isSidebarOpen && <FaChevronDown className={`ml-auto transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />}
  {!isSidebarOpen && isStatusOpen && (
    <div className="absolute left-full top-0 ml-2 w-64 bg-[#1D3461] text-white rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-white font-semibold mb-2">Status</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/enquirydetails" className="hover:text-blue-300">Update Enquiry Status</Link></li>
        <li><Link to="/timeplan" className="hover:text-blue-300">Pending APQP</Link></li>
        <li><Link to="/apqptable" className="hover:text-blue-300">APQP TimePlan</Link></li>
        <li><Link to="/feasibilityChart" className="hover:text-blue-300">Technical Feasibility</Link></li>
      </ul>
    </div>
  )}
</li>

            {isSidebarOpen && isStatusOpen && (
              <ul className="ml-6 space-y-2 text-sm">
                <li><Link to="/enquirydetails" className="hover:text-blue-300">Update Enquiry Status</Link></li>
                <li><Link to="/timeplan" className="hover:text-blue-300">Pending APQP</Link></li>
                <li><Link to="/apqptable" className="hover:text-blue-300">APQP TimePlan</Link></li>
                <li><Link to="/feasibilityChart" className="hover:text-blue-300">Technical Feasibility</Link></li>
              </ul>
            )}

            {/* CFT Meeting */}
            <li className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/cftmeeting" className="flex items-center">
                <FaFileAlt className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>CFT Meeting</span>
              </Link>
            </li>

            {/* Lookups */}
            <li onClick={() => setLookupOpen(!isLookupOpen)} className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 cursor-pointer">
              <FaUsers className="text-xl" />
              <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Lookups</span>
              {isSidebarOpen && <FaChevronDown className={`ml-auto transition-transform ${isLookupOpen ? 'rotate-180' : ''}`} />}
            </li>
            {isSidebarOpen && isLookupOpen && (
              <ul className="ml-6 space-y-2 text-sm">
                <li><Link to="/customer" className="hover:text-blue-300">Customers</Link></li>
                <li><Link to="/supplier" className="hover:text-blue-300">Suppliers</Link></li>
                <li><Link to="/user" className="hover:text-blue-300">Users</Link></li>
              </ul>
            )}

            {/* Report */}
            <li className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/report" className="flex items-center">
                <FileBarChart className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Report</span>
              </Link>
            </li>

            {/* Account */}
            <li className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/account" className="flex items-center">
                <FaUser className="text-xl" />
                <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Account</span>
              </Link>
            </li>

            {/* Logout */}
            <li onClick={handleLogout} className="group flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 cursor-pointer">
              <FaSignOutAlt className="text-xl" />
              <span className={`${isSidebarOpen ? 'block ml-2' : 'sr-only'}`}>Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Confirmation */}
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
