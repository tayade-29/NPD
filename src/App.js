import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; // ✅ Import Footer
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";
import Settings from "./Components/Settings";
import Logout from "./Components/Logout";
import Login from "./Components/Login";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; // ✅ Check if on login page

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isLoginPage && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {!isLoginPage && <Navbar />}
          <div className="p-6 flex-1">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </div>
      {/* ✅ Footer should be displayed only if not on the login page */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
