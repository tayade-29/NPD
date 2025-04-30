import { useState, useRef, useEffect } from "react";
import { FaBell, FaCommentDots, FaUserCircle, FaChevronDown } from "react-icons/fa";
import PasswordChangeModal from "./ChangePasswordModal";
import { useAuth } from "../context/AuthContext";

const SIDEBAR_WIDTH = 256;
 // Adjust this if your sidebar width is different

const Navbar = ({ isSidebarOpen }) => {
  const { userData, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const UserName = userData.UserName;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <>
    <nav
  className="fixed top-0 z-50 bg-white shadow-md px-4 sm:px-6 flex justify-between items-center transition-all duration-300 py-4 sm:py-5"
  style={{
    left: isSidebarOpen ? '256px' : '64px',
    width: isSidebarOpen ? 'calc(100% - 256px)' : 'calc(100% - 64px)',
  }}
>


        {/* Company Logo and Name */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <img
            src="/src/assets/logo2.jpg"
            alt="Company Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            <span className="hidden sm:inline">New Product Development</span>
            <span className="sm:hidden">NPD</span>
          </h1>
        </div>

        {/* Icons and User Info */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button className="relative p-1 rounded-full hover:bg-gray-100">
            <FaCommentDots className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="relative p-1 rounded-full hover:bg-gray-100">
            <FaBell className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-gray-700 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-gray-700 font-medium hidden sm:block">
                {UserName}
              </span>
              <FaChevronDown
                className={`text-gray-500 w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fadeIn">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{UserName}</div>
                  <div className="text-gray-500 text-xs truncate">
                    {userData?.email || ""}
                  </div>
                </div>
                <button
                  onClick={openPasswordModal}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Password Change Modal */}
      {isPasswordModalOpen && <PasswordChangeModal onClose={closePasswordModal} />}

      {/* Spacer to push content below fixed navbar */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default Navbar;
