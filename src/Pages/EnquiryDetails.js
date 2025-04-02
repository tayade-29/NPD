import React, { useState } from "react";
import { FileCheck, Upload, X } from "lucide-react";
import EnquiryTable from "../Components/EnquiryTable";
import { downloadCSV, downloadExcel, downloadPDF } from "../utils/fileUtils";

// Process Tracker Component
const ProcessTracker = ({ isOpen, onClose, currentStatus, onStatusUpdate, selectedEnquiry }) => {
  const [completedSubProcesses, setCompletedSubProcesses] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [activeTab, setActiveTab] = useState(1);

  const processes = {
    1: { name: "Plan and Define", subProcesses: { 1: "Enquiry Received", 2: "Sent to Toolmaker", 3: "Decide Feasibility", 4: "Prepare Quotation", 5: "Take Confirmation (P.O.)", 6: "Decide APQP Time Plan", 7: "Get Tool Design" } },
    2: { name: "Product Design", subProcesses: { 1: "Initial Design Review", 2: "Design Feedback", 3: "Design Approval" } },
    3: { name: "Process Design and Development", subProcesses: { 1: "Prepare PFD, PFMEA and Control Plan", 2: "Provide Training" } },
    4: { name: "Product and Process Validation", subProcesses: { 1: "Inspect Mould as per Checksheet", 2: "T0", 3: "T1", 4: "T2", 5: "T3", 6: "Tfinal" } },
    5: { name: "Feedback", subProcesses: { 1: "CFT Meeting for review" } },
    6: { name: "APQP Review", subProcesses: { 1: "Review APQP time plan" } }
  };

  const handleFileUpload = (processId, subProcessId, event) => {
    const file = event.target.files[0];
    if (file) {
      setFileUploads((prev) => ({ ...prev, [`${processId}-${subProcessId}`]: file.name }));
      handleSubProcessComplete(processId, subProcessId);
    }
  };

  const handleSubProcessComplete = (processId, subProcessId) => {
    setCompletedSubProcesses((prev) => ({ ...prev, [`${processId}-${subProcessId}`]: true }));

    const allSubProcessesCompleted = Object.keys(processes[processId].subProcesses).every(
      (subId) => completedSubProcesses[`${processId}-${subId}`] || subId == subProcessId
    );

    if (allSubProcessesCompleted) {
      onStatusUpdate(`${processes[processId].name} Completed`);
    }
  };

  const handleCheckboxChange = (processId, subProcessId) => {
    setCompletedSubProcesses((prev) => ({
      ...prev,
      [`${processId}-${subProcessId}`]: !prev[`${processId}-${subProcessId}`]
    }));
    handleSubProcessComplete(processId, subProcessId);
  };

  return (
    <div className={`w-[500px] bg-white shadow-lg rounded-lg transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Process Tracker</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        {/* Horizontal Scrolling for Process Tabs */}
        <div className="overflow-x-auto mb-4">
          <div className="flex space-x-2">
            {Object.entries(processes).map(([processId, process]) => (
              <button
                key={processId}
                className={`px-4 py-2 text-sm font-semibold ${activeTab === processId ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab(Number(processId))}
              >
                {process.name}
              </button>
            ))}
          </div>
        </div>

        {activeTab && (
          <div className="overflow-x-auto">
            {Object.entries(processes[activeTab].subProcesses).map(([subId, subName]) => (
              <div key={subId} className="p-4 bg-gray-50 rounded-lg mb-3 flex justify-between items-center hover:bg-gray-100 transition-colors">
                <div className="flex-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={completedSubProcesses[`${activeTab}-${subId}`] || false}
                    onChange={() => handleCheckboxChange(activeTab, subId)}
                    className="mr-2"
                  />
                  <p className="font-medium text-gray-800">{`${subId}. ${subName}`}</p>
                  {fileUploads[`${activeTab}-${subId}`] && (
                    <p className="text-sm text-gray-500 mt-1 ml-2">
                      Uploaded: {fileUploads[`${activeTab}-${subId}`]}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer flex items-center px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100">
                    <Upload size={16} className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500">Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(activeTab, subId, e)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enquiry Details Component
const EnquiryDetails = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isProcessTrackerOpen, setIsProcessTrackerOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Under Review");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      srNo: "001",
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
      designFiles: [
        { file: { name: "design-spec.pdf" }, url: "#", status: "success" },
        { file: { name: "3d-model.step" }, url: "#", status: "success" },
      ],
    },
    // Add more sample enquiries as needed
  ]);

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsProcessTrackerOpen(false);
    setIsEditing(false);
  };

  const handleStatusUpdate = (newStatus) => {
    if (selectedEnquiry) {
      const updatedStatus = newStatus;
      setCurrentStatus(updatedStatus);
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enq) => (enq.id === selectedEnquiry.id ? { ...enq, status: updatedStatus } : enq))
      );
    }
  };

  // Filter enquiries based on search query
  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.id.toString().includes(searchQuery) // Convert ID to string for comparison
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Enquiry Management</h1>

      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Project</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{enquiry.id}</td>
                <td className="px-6 py-4 text-gray-800">{enquiry.customerName}</td>
                <td className="px-6 py-4 text-gray-800">{enquiry.projectVehicleProgram}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {enquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(enquiry)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex gap-6 max-w-[1200px]">
            <div className="w-[600px] bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{selectedEnquiry.projectVehicleProgram}</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="text-gray-500 hover:text-gray-700">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Customer</h4>
                  <p className="text-gray-600">{selectedEnquiry.customerName}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Specifications</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {Object.entries(selectedEnquiry).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="text-gray-800 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-700 mb-2">Current Status</h4>
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {currentStatus}
                    </span>
                    <button
                      onClick={() => setIsProcessTrackerOpen(true)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit Status
                    </button>
                  </div>
                </div>
              </div>

              <ProcessTracker
                isOpen={isProcessTrackerOpen}
                onClose={() => setIsProcessTrackerOpen(false)}
                currentStatus={currentStatus}
                onStatusUpdate={handleStatusUpdate}
                selectedEnquiry={selectedEnquiry}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetails;