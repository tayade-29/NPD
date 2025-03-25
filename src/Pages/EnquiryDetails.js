import React, { useState } from "react";
import { FileCheck, Upload, X } from "lucide-react";

const ProcessTracker = ({ isOpen, onClose, currentStatus, onStatusUpdate, selectedEnquiry }) => {
  const [completedSubProcesses, setCompletedSubProcesses] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [activeTab, setActiveTab] = useState(1);

  const processes = {
    1: { name: "Design Review", subProcesses: { 1: "Initial Design Review", 2: "Design Feedback", 3: "Design Approval" } },
    2: { name: "Tool Development", subProcesses: { 1: "Tool Design", 2: "Tool Manufacturing", 3: "Tool Trial" } },
    3: { name: "Sample Development", subProcesses: { 1: "First Sample Production", 2: "Sample Testing", 3: "Customer Approval" } }
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

  return (
    <div className={`w-[500px] bg-white shadow-lg rounded-lg transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Process Tracker</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        <div className="flex space-x-2 border-b mb-4">
          {Object.entries(processes).map(([processId, process]) => (
            <button
              key={processId}
              className={`px-4 py-2 text-sm font-semibold ${activeTab == processId ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab(Number(processId))}
            >
              {process.name}
            </button>
          ))}
        </div>

        {activeTab && (
          <div>
            {Object.entries(processes[activeTab].subProcesses).map(([subId, subName]) => (
              <div key={subId} className="p-4 bg-gray-50 rounded-lg mb-3 flex justify-between items-center hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{`${subId}. ${subName}`}</p>
                  {fileUploads[`${activeTab}-${subId}`] && (
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded: {fileUploads[`${activeTab}-${subId}`]}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {completedSubProcesses[`${activeTab}-${subId}`] ? (
                    <FileCheck className="text-green-500" size={20} />
                  ) : (
                    <label className="cursor-pointer flex items-center px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100">
                      <Upload size={16} className="text-blue-500 mr-1" />
                      <span className="text-sm text-blue-500">Upload</span>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(activeTab, subId, e)} />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isProcessTrackerOpen, setIsProcessTrackerOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Under Review");
  const [enquiries, setEnquiries] = useState([
    { 
      id: 1, 
      customerName: "ABC Motors", 
      projectName: "EV Platform 2024", 
      status: "Under Review", 
      description: "Electric vehicle development project focusing on new platform design.",
      specifications: {
        material: "High-grade aluminum",
        dimensions: "2500mm x 1800mm",
        weight: "450kg",
        capacity: "5 passengers"
      },
      timeline: "Q4 2024",
      budget: "$2.5M"
    }
  ]);

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsProcessTrackerOpen(false);
  };

  const handleStatusUpdate = (newStatus) => {
    if (selectedEnquiry) {
      const updatedStatus = newStatus;
      setCurrentStatus(updatedStatus);
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enq) => 
          enq.id === selectedEnquiry.id ? { ...enq, status: updatedStatus } : enq
        )
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Enquiry Management</h1>

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
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{enquiry.id}</td>
                <td className="px-6 py-4 text-gray-800">{enquiry.customerName}</td>
                <td className="px-6 py-4 text-gray-800">{enquiry.projectName}</td>
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
                <h3 className="text-xl font-bold text-gray-800">{selectedEnquiry.projectName}</h3>
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
                  <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-600">{selectedEnquiry.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Specifications</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {Object.entries(selectedEnquiry.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="text-gray-800 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Timeline</h4>
                  <p className="text-gray-600">{selectedEnquiry.timeline}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Budget</h4>
                  <p className="text-gray-600">{selectedEnquiry.budget}</p>
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
      )}
    </div>
  );
};

export default App;