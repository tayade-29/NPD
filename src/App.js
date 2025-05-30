import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import APQPTable from './Forms/APQPTable';
import FeasibilityReviewPage from './Forms/FeasibilityReviewCheckpoints';
import EnquiryRegisterForm from './Forms/EnquiryRegisterForm';
import EnquiryManagement from './Pages/EnquiryDetails';
// import APQPTimePlan from './Forms/APQPTimePlanChart';
import TimePlanTable from './Forms/TimePlanTable';
import APQPTimePlanChart from './Forms/APQPTimePlanChart'; 
import ActivityTable from './Components/ActivityTable';
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";
import Settings from "./Components/Settings";
import Login from "./Components/Login";
import Feasibility from "./Forms/FeasibiltyReviewChart";
import CustomerTable from "./Lookups/Customer";
import UserPage from "./Lookups/User";
import SupplierPage from "./Lookups/Supplier";
import MouldInspectionChecksheet from './Pages/MouldInspectionChecksheet';
import CoreCavityTable from './Tables/CoreCavityTable';
import FeedingSystemTable from './Tables/FeedingSystemTable';
import GeneralTable from './Tables/GeneralTable';
import MouldMaterialRelated from './Tables/MouldMaterialRelated';
import ToolDesignReview from './Pages/ToolDesignReview';
import TrialReportForm from './Pages/TrialReportForm';
import SampleInspectionReportForm from './Pages/SampleInspectionReportForm';
import TrialRequisitionNote from './Pages/TrialRequisitionNote';
import PreDispatchInspection from './Pages/PreDispatchInspection';





const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {isAuthenticated && <Navbar />}
          <div className="p-6 flex-1">
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ?
                    <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
                    : <Login />
                }
              />


              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/apqpform" element={<PrivateRoute><APQPTable /></PrivateRoute>} />
              <Route path="/reviewform" element={<PrivateRoute><FeasibilityReviewPage /></PrivateRoute>} />
              <Route path="/enquiryform" element={<PrivateRoute><EnquiryRegisterForm /></PrivateRoute>} />
              <Route path="/enquirydetails" element={<PrivateRoute><EnquiryManagement /></PrivateRoute>} />
              {/* <Route path="/apqptimeplan" element={<PrivateRoute><APQPTimePlan /></PrivateRoute>} /> */}
              <Route path="/timeplan" element={<PrivateRoute><TimePlanTable /></PrivateRoute>} />
              <Route path="/apqptimeplan" element={<PrivateRoute><APQPTimePlanChart /></PrivateRoute>} />
               
              <Route path="/feasibilityChart" element={<PrivateRoute><Feasibility /></PrivateRoute>} />
              <Route path="/customer" element={<PrivateRoute><CustomerTable /></PrivateRoute>} />
              <Route path="/supplier" element={<PrivateRoute><SupplierPage /></PrivateRoute>} />
              <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
              <Route path="/activity-table" element={<PrivateRoute><ActivityTable /></PrivateRoute>} />
              <Route path="/mouldinspection" element={<MouldInspectionChecksheet />} />
              <Route path="/core-cavity" element={<CoreCavityTable />} />
              <Route path="/feeding-system" element={<FeedingSystemTable />} />
              <Route path="/general" element={<GeneralTable />} />
              <Route path="/mouldmaterialrelated" element={<MouldMaterialRelated />} />
              <Route path="/tooldesignreview" element={<ToolDesignReview />} />
              <Route path="/trialreportform" element={<TrialReportForm />} />
              <Route path="/sampleinspectionreportform" element={<SampleInspectionReportForm />} />
              <Route path="/trialrequisitionnote" element={<TrialRequisitionNote />} />
              <Route path="/predispatchinspection" element={<PreDispatchInspection />} />
              <Route path='/apqptable' element={<APQPTable />} />




              {/* Root and catch-all routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route
                path="*"
                element={
                  isAuthenticated ?
                    <Navigate to="/dashboard" replace />
                    : <Navigate to="/login" replace />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
      {isAuthenticated && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;