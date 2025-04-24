import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import {
  useGetEnquiriesQuery,
  useGetCustomersQuery
} from '../features/api/apiSliceenquiry';
import EnquiryTable from "./EnquiryTable";
import EnquiryDetails from "./EnquiryDetails";
import { FileText, RefreshCw } from "lucide-react";

const EnquiriesPage = () => {
  const { userData } = useAuth();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const { data: enquiries = [], isLoading, isError, error, refetch } = useGetEnquiriesQuery();
  const { data: customers = [], isLoading: isLoadingCustomers, error: customerError } = useGetCustomersQuery(userData);
  let parsedCustomers = [];
  if (Array.isArray(customers)) {
    parsedCustomers = customers;
  } else if (typeof customers?.d === 'string') {
    try {
      parsedCustomers = JSON.parse(customers.d);
    } catch (e) {
      console.error("Failed to parse customer list", e);
    }
  }
  // Create customer map
  const customerMap = {};
  parsedCustomers.forEach(cust => {
    customerMap[cust.DataValueField] = cust.DataTextField;
  });

  const handleActionClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleCloseDetails = () => {
    setSelectedEnquiry(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Enquiry Management</h1>
          
        </div>
        
      </div>


      <EnquiryTable 
        enquiries={enquiries}
        isLoading={isLoading}
        isError={isError}
        error={error}
        customerMap={customerMap}
        onActionClick={handleActionClick}
      />

      {selectedEnquiry && (
        <EnquiryDetails 
          enquiry={selectedEnquiry} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default EnquiriesPage;