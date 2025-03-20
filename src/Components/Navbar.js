import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu toggle

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-md">
      {/* Left Side: Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Center: Title */}
      <h1 className="text-2xl font-semibold">New Product Devlopment</h1>

      {/* Right Side: Profile Placeholder */}
      <div className="h-8 w-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
        A
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 text-gray-600">
          <X size={24} />
        </button>
        
        {/* Sidebar Items */}
        <nav className="mt-12 space-y-4">
          <SidebarItem to="/dashboard" label="Dashboard" />
          <SidebarItem to="/enquiry-status" label="Enquiry Status Update" />
          <SidebarItem to="/add-apqp" label="Add APQP" />
          <SidebarItem to="/account" label="Account" />
          <SidebarItem to="/logout" label="Logout" />
        </nav>
      </div>
    </div>
  );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ to, label }) => (
  <Link
    to={to}
    className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition duration-300"
  >
    {label}
  </Link>
);

export default Navbar;
