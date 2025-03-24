import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import Login from './Pages/Login';
import APQPTable from './Forms/ApqpTable';
import FeasibilityReviewPage from './Forms/FeasibilityReview';
import EnquiryRegisterForm from './Forms/EnquiryRegisterForm';


function App() {
  return (
    <Router> {/* Wrap your application in Router */}
      <div>
        <Routes> {/* Define your routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/apqpform" element={<APQPTable />} />
          <Route path="/reviewform" element={<FeasibilityReviewPage />} />
          <Route path="/enquiryform" element={<EnquiryRegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;