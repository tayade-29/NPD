import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-npd.jpg";
import { FaBell, FaCommentDots, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const Navbar = () => { 
  return (
    <nav className="bg-white shadow-md  w-[calc(100%)] px-6 py-4 flex justify-between items-center ">
      {/* Company Logo and Name */}
      <div className="flex items-center space-x-4">
  <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
    <img
      src={logo}
      alt="Company Logo"
      className="w-full h-full object-contain"
    />
  </div>
  <h1 className="text-2xl font-bold text-gray-800">New Product Development</h1>
</div>

      {/* Icons and User Info */}
      <div className="flex items-center space-x-6">
        {/* Chat Icon */}
        <button className="relative">
          <FaCommentDots className="text-gray-700 w-6 h-6" />
        </button>

        {/* Notification Icon */}
        <button className="relative">
          <FaBell className="text-gray-700 w-6 h-6" />
          {/* {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {notificationCount}
            </span>
          )} */}
        </button>

        {/* User Account - Click to Navigate to Account Page */}
        <button className="flex items-center space-x-2 cursor-pointer">
          <FaUserCircle className="text-gray-700 w-8 h-8" />
          <span className="text-gray-700 font-medium">Guest</span>
        </button>
      </div>

    
    </nav>
  );
};

export default Navbar;
