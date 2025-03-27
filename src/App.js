import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import Login from './Pages/Login';
import APQPTable from './Forms/ApqpActivityTable';
import FeasibilityReviewPage from './Forms/FeasibilityReviewCheckpoints';
import EnquiryRegisterForm from './Forms/EnquiryRegisterForm';
import EnquiryManagement from './Pages/EnquiryDetails';  // Remove curly braces
import APQPTimePlan from './Forms/APQPTimePlanChart';



function App() {
  return (
    <Router> {/* Wrap your application in Router */}
      <div>
        <Routes> {/* Define your routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/apqpform" element={<APQPTable />} />
          <Route path="/reviewform" element={<FeasibilityReviewPage />} />
          <Route path="/enquiryform" element={<EnquiryRegisterForm />} />
          <Route path="/enquirydetails" element={<EnquiryManagement/>} />
          <Route path="/apqptimeplan" element={<APQPTimePlan/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;