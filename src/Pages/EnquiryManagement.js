import React, { useState } from 'react';
import EnquiryTable from './EnquiryTable';
import EnquiryDetails from './EnquiryDetails';

// Mock data for demonstration
const mockEnquiries = [
  {
    id: 1,
    customerName: "ABC Motors",
    projectVehicleProgram: "EV Platform 2024",
    partCode: "EV-2024-001",
    partName: "Battery Housing",
    rawMaterial: "High-grade aluminum",
    sop: "2024-12-31",
    estimatedAnnualVolume: "10000",
    enquiryReceivedDate: "2024-03-01",
    partColour: "Black",
    dateQuoted: "2024-03-15",
    status: "Under Review",
    customerPODate: "2024-04-01",
    partCostEstimate: "25000",
    toolCostEstimate: "500000",
    annualBusinessPotential: "250",
    poNo: "PO-2024-001",
    designFiles: []
  },
  {
    id: 2,
    customerName: "XYZ Electric",
    projectVehicleProgram: "SUV Series X",
    partCode: "SUV-X-1200",
    partName: "Door Panel",
    rawMaterial: "ABS Plastic",
    sop: "2024-10-15",
    estimatedAnnualVolume: "25000",
    enquiryReceivedDate: "2024-02-10",
    partColour: "Grey",
    dateQuoted: "2024-02-25",
    status: "PO Received",
    customerPODate: "2024-03-20",
    partCostEstimate: "8500",
    toolCostEstimate: "320000",
    annualBusinessPotential: "212",
    poNo: "PO-XYZ-420",
    designFiles: []
  }
];

function App() {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleActionClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleCloseDetails = () => {
    setSelectedEnquiry(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Enquiry Management System</h1>

        <EnquiryTable 
          enquiries={mockEnquiries} 
          onActionClick={handleActionClick} 
        />

        {selectedEnquiry && (
          <EnquiryDetails 
            enquiry={selectedEnquiry} 
            onClose={handleCloseDetails} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
