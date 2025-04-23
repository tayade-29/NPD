import { useState, useEffect, useRef } from "react";
import React from "react";
import logo from "../assets/logo2.jpg";
import { FaBell, FaCommentDots, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useChangePasswordMutation } from '../features/api/apiSliceenquiry'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

 

  const { userData } = useAuth();
  const [changePassword] = useChangePasswordMutation();
  
  const handleSavePassword = async () => {
    const { current, newPass, confirm } = form;
  
    if (!current || !newPass || !confirm) {
      alert('All fields are required');
      return;
    }
  
    if (newPass !== confirm) {
      alert('New password and confirm password do not match');
      return;
    }
  
    try {
      const result = await changePassword({
        pFkEmpId: userData?.EmployeeCode||1,
        pPassword: newPass
      }).unwrap();
  
      if (result?.status === 'success' || result === true) {
        alert('Password changed successfully');
        setShowChangePassword(false);
        setForm({ current: '', newPass: '', confirm: '' });
      } else {
        alert('Password change failed.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      alert('An error occurred. Please try again.');
  }
};

  return (
    <>
      <nav className="bg-white shadow-md w-full px-4 md:px-6 py-3 flex justify-between items-center relative z-50">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Company Logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
            New Product Development
          </h1>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 relative">
          <button className="relative">
            <FaCommentDots className="text-gray-700 w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button className="relative">
            <FaBell className="text-gray-700 w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 cursor-pointer focus:outline-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <FaUserCircle className="text-gray-700 w-6 h-6 md:w-8 md:h-8" />
              <span className="text-gray-700 font-medium hidden md:inline-block">Guest</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 text-sm text-gray-700 animate-fadeIn">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="current"
                value={form.current}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPass"
                value={form.newPass}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
