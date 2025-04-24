// src/pages/EnquiryPage.jsx (or wherever you organize pages)
import React from "react";
import { useGetEnquiriesQuery } from "../api/enquiryApi"; // adjust this path to your actual api file
import EnquiryTable from "../components/EnquiryTable"; // adjust if needed

const EnquiryPage = () => {
  const { data = [], isLoading, isError } = useGetEnquiriesQuery();

  if (isLoading) return <p className="p-4 text-gray-600">Loading enquiries...</p>;
  if (isError) return <p className="p-4 text-red-600">Failed to load enquiries.</p>;

  // Optional mapping if API keys are different than UI
  const formattedData = data.map((item) => ({
    id: item.EnquiryID || item.id,
    customerName: item.Customer || item.customerName,
    projectVehicleProgram: item.Project || item.projectVehicleProgram,
    partCode: item.PartCode || item.partCode,
    partName: item.PartName || item.partName,
    rawMaterial: item.RawMaterial || item.rawMaterial,
    status: item.Status || item.status,
  }));

  const handleView = (enquiry) => {
    // Define what happens on "View" button click (e.g., navigate, show modal)
    console.log("Selected Enquiry:", enquiry);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Enquiries</h1>
      <EnquiryTable enquiries={formattedData} onActionClick={handleView} />
    </div>
  );
};

export default EnquiryPage;
