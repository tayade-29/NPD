import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";

const AppContent = () => {
  const location = useLocation(); // Get current route

  return (
    <>
      {/* Show Navbar only when not on the Login page */}
      {location.pathname !== "/" && <Navbar />}
      
      <div className="mt-16 p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
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
