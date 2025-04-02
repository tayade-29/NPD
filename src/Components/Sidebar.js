import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTachometerAlt,
  FaUser ,
  FaSignOutAlt,
  FaClipboardList,
  FaFileAlt,
  FaPlusCircle,
  FaChevronDown
} from 'react-icons/fa';
import { ChartColumnDecreasing, CheckCircle, FileText,FileBarChart} from 'lucide-react';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFormsOpen, setFormsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleForms = () => {
    setFormsOpen(!isFormsOpen);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return (
    <div className="flex">
      <div
        className={`bg-[#1D3461] text-white font-sans ${isSidebarOpen ? 'w-64' : 'w-16'} min-h-screen p-4 transition-all duration-300 backdrop-blur-lg bg-opacity-90`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold">{isSidebarOpen && 'Dashboard'}</div>
          <button className="text-white focus:outline-none" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/" className="flex items-center">
                <ChartColumnDecreasing className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Dashboard</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/enquiryform" className="flex items-center">
                <FaClipboardList className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Enquiry Registration</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/enquirydetails" className="flex items-center">
                <CheckCircle className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Enquiry Status Update</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/apqpform" className="flex items-center">
                <FaPlusCircle className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Add APQP Activity</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/reviewform" className="flex items-center">
                <FaPlusCircle className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Add CheckPoints</span>
              </Link>
            </li>

            <li className="flex flex-col">
              <div
                className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 cursor-pointer"
                onClick={toggleForms}
              >
                <FileText className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Forms</span>
                <FaChevronDown className={`text-sm transition-transform ${isFormsOpen ? 'rotate-180' : ''}`} />
              </div>
              <ul className={`ml-6 space-y-1 transition-all duration-300 ${isFormsOpen ? 'block' : 'hidden'}`}>
                <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
                  <Link to="/apqptimeplan" className="flex items-center">
                    <FileText className="text-xl min-w-[24px]" />
                    <span className="whitespace-nowrap">APQP Time Plan Chart</span>
                  </Link>
                </li>
                <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
                  <Link to="/feasibilityChart" className="flex items-center">
                    <FileText className="text-xl min-w-[24px]" />
                    <span className="whitespace-nowrap">Feasibility Review Form</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/account" className="flex items-center">
                <FileBarChart className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Report</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2">
              <Link to="/account" className="flex items-center">
                <FaUser  className="text-xl min-w-[24px]" />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Account</span>
              </Link>
            </li>
            <li className="flex items-center gap-x-4 hover:bg-gray-700 rounded p-2 cursor-pointer" onClick={handleLogout}>
              <FaSignOutAlt className="text-xl min-w-[24px]" />
              <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmLogout}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowLogoutConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;