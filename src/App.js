<<<<<<< HEAD

=======
>>>>>>> e30cc094bc12a965864e80fdbca94c657a53dbbe
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import APQPTable from './Forms/ApqpActivityTable';
import FeasibilityReviewPage from './Forms/FeasibilityReviewCheckpoints';
import EnquiryRegisterForm from './Forms/EnquiryRegisterForm';
import EnquiryManagement from './Pages/EnquiryDetails';  // Remove curly braces
import APQPTimePlan from './Forms/APQPTimePlanChart';
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";
import Settings from "./Components/Settings";
import Logout from "./Components/Logout";
import Login from "./Components/Login";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

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
              <Route path="/apqpform" element={<APQPTable />} />
              <Route path="/reviewform" element={<FeasibilityReviewPage />} />
              <Route path="/enquiryform" element={<EnquiryRegisterForm />} />
              <Route path="/enquirydetails" element={<EnquiryManagement />} />
              <Route path="/apqptimeplan" element={<APQPTimePlan />} />
            </Routes>
          </div>
        </div>
      </div>

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

export default App;