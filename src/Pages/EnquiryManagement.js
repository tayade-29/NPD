import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import {
  useGetEnquiriesQuery,
  useGetEnquiriesByIdQuery,
  useGetCustomersQuery
} from '../features/api/apiSliceenquiry';
import EnquiryTable from "./EnquiryTable";
import EnquiryDetails from "./EnquiryDetails";

const EnquiriesPage = () => {
  const { userData } = useAuth();

  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Get all enquiries
  const { data: enquiries = [], isLoading, isError, error } = useGetEnquiriesQuery();

  // Get customers
  const { data: customers = [], isLoading: isLoadingCustomers, error: customerError } = useGetCustomersQuery(userData);

  // Get enquiry by ID (skip until user selects one)
  const {
    data: enquiryDetails,
    refetch: refetchEnquiryById,
    isFetching: isLoadingDetails
  } = useGetEnquiriesByIdQuery(
    { pAction: 1, pLookUpId: selectedEnquiryId },
    { skip: !selectedEnquiryId }
  );

  // When enquiryDetails is updated, sync it to selectedEnquiry
  useEffect(() => {
    if (enquiryDetails && enquiryDetails.length > 0) {
      setSelectedEnquiry(enquiryDetails[0]); // assuming it returns an array
    }
  }, [enquiryDetails]);

  // Parse customers safely
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

  const customerMap = {};
  parsedCustomers.forEach(cust => {
    customerMap[cust.DataValueField] = cust.DataTextField;
  });

  const handleViewClick = (enquiry) => {
    setSelectedEnquiryId(enquiry.PkEnquiryMasterId);
  };

  const handleCloseDetails = () => {
    setSelectedEnquiry(null);
    setSelectedEnquiryId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquiry Management</h1>
      </div>

      <EnquiryTable 
        enquiries={enquiries}
        isLoading={isLoading}
        isError={isError}
        error={error}
        customerMap={customerMap}
        onActionClick={handleViewClick}
      />

      {selectedEnquiry && (
        <EnquiryDetails 
          enquiry={selectedEnquiry}
          isLoading={isLoadingDetails}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default EnquiriesPage;
