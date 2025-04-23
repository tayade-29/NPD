import React, { useState } from "react";
import { X, Save, Edit2, Upload, FileText, Calendar, Eye, CheckCircle, CalendarDays } from "lucide-react";
import ProcessTracker from "../Components/ProcessTracker";

const EnquiryDetails = ({ enquiry, onClose }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(enquiry);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [isProcessTrackerOpen, setIsProcessTrackerOpen] = useState(false);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setSelectedEnquiry((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const value = e.target.checked;
    setSelectedEnquiry((prev) => ({ ...prev, [field]: value }));
  };
 
 

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedEnquiry((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here (e.g., API call)
  };

  const tabs = [
    "View Details",
    "Initial Feasibility Check",
    "Quotation",
    "P.O.",
    "Status"
  ];

  const basicDetailsFields = [
    { key: "customerName", label: "Customer Name" },
    { key: "projectVehicleProgram", label: "Project/Vehicle Program" },
    { key: "partCode", label: "Part Code" },
    { key: "partName", label: "Part Name" },
    { key: "rawMaterial", label: "Raw Material" },
    { key: "partColour", label: "Part Colour" },
    { key: "sop", label: "SOP Date", type: "date" }
  ];

  const businessDetailsFields = [
    { key: "estimatedAnnualVolume", label: "Estimated Annual Volume" },
    { key: "enquiryReceivedDate", label: "Enquiry Received Date", type: "date" },
    { key: "dateQuoted", label: "Date Quoted", type: "date" },
    { key: "customerPODate", label: "Customer PO Date", type: "date" },
    { key: "poNo", label: "PO Number" }
  ];

  const costDetailsFields = [
    { key: "partCostEstimate", label: "Part Cost Estimate (₹)", type: "number" },
    { key: "toolCostEstimate", label: "Tool Cost Estimate (₹)", type: "number" },
    { key: "annualBusinessPotential", label: "Annual Business Potential (Lac ₹)", type: "number" }
  ];

  if (!selectedEnquiry) return null;

  return (
    <div className="fixed inset-0 bg-gray-50  flex items-center justify-center z-50">
      <div className="w-[1100px] h-[700px] bg-white rounded-xl  flex flex-col">
        <div className="p-6 pb-0 border-b  bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-500">
              Enquiry Details <span className="text-sm font-normal text-gray-500 ml-2">{selectedEnquiry.id}</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex space-x-1">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                  activeTab === i
                    ? "bg-white border-t border-r border-l border-gray-200 text-blue-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

        {activeTab === 0 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Details</h3>
                  <div className="space-y-4">
                    {basicDetailsFields.map(({ key, label, type }) => (
                      <div key={key} className="grid grid-cols-2 gap-3">
                        <label className="text-sm font-medium text-gray-600">{label}:</label>
                        {isEditing ? (
                          <input
                            type={type || "text"}
                            value={selectedEnquiry[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800">{selectedEnquiry[key]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Business Information</h3>
                  <div className="space-y-4">
                    {businessDetailsFields.map(({ key, label, type }) => (
                      <div key={key} className="grid grid-cols-2 gap-3">
                        <label className="text-sm font-medium text-gray-600">{label}:</label>
                        {isEditing ? (
                          <input
                            type={type || "text"}
                            value={selectedEnquiry[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800">{selectedEnquiry[key]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Cost Information</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  {costDetailsFields.map(({ key, label, type }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">{label}:</label>
                      {isEditing ? (
                        <input
                          type={type || "text"}
                          value={selectedEnquiry[key] || ""}
                          onChange={(e) => handleInputChange(e, key)}
                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">{selectedEnquiry[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Details
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feasibility */}
          {activeTab === 1 && (
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Initial Feasibility Check</h3>
              <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-1">Feasibility  Date</label>
  <div className="relative">
    <input
      type="date"
      value={selectedEnquiry.feasibilityDate || ""}
      onChange={(e) => handleInputChange(e, "fisibilityDate")}
      className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <CalendarDays size={18} />
    </div>
  </div>
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Upload Document</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "feasibilityFile")}
                      className="hidden"
                      id="feasibility-upload"
                    />
                    <label
                      htmlFor="feasibility-upload"
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-100 text-sm font-medium"
                    >
                      <Upload size={16} className="inline-block mr-2" /> Upload File
                    </label>
                    {selectedEnquiry.feasibilityFile && (
                      <button className="flex items-center text-green-600 hover:underline">
                        <Eye size={16} className="mr-1" /> View
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Feasibility Status</label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedEnquiry.isFeasible || false}
                    onChange={(e) => handleCheckboxChange(e, "isFeasible")}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-800">Feasible</span>
                </label>
              </div>
            </div>
          )}
 {/* Quoatation */}
 {activeTab === 2 && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 w-full max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Quotation Document Upload
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Quotation Number</label>
                  <input
                    type="text"
                    value={selectedEnquiry.quotationNumber || ""}
                    onChange={(e) => handleInputChange(e, "quotationNumber")}
                    placeholder="Enter quotation number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date</label>
  <div className="relative">
    <input
      type="date"
      value={selectedEnquiry.quotationDate || ""}
      onChange={(e) => handleInputChange(e, "quotationDate")}
      className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <CalendarDays size={18} />
    </div>
  </div>
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Upload Quotation File</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "quotationFile")}
                      className="hidden"
                      id="quotation-upload"
                    />
                    <label
                      htmlFor="quotation-upload"
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-100 text-sm font-medium"
                    >
                      <Upload size={16} className="inline-block mr-2" /> Upload File
                    </label>
                    {selectedEnquiry.quotationFile && (
                      <button className="flex items-center text-green-600 hover:underline">
                        <Eye size={16} className="mr-1" /> View
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Quotation Status</label>
                  <button
                    className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200"
                  >
                    <CheckCircle size={16} className="mr-2" /> Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          )}

{/* PO */}
{activeTab === 3 && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 w-full max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                P.O. Document Upload
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Purchase Order Number</label>
                  <input
                    type="text"
                    value={selectedEnquiry.quotationNumber || ""}
                    onChange={(e) => handleInputChange(e, "quotationNumber")}
                    placeholder="Enter quotation number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-1">P.O. Date</label>
  <div className="relative">
    <input
      type="date"
      value={selectedEnquiry.quotationDate || ""}
      onChange={(e) => handleInputChange(e, "quotationDate")}
      className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <CalendarDays size={18} />
    </div>
  </div>
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Upload Quotation File</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "quotationFile")}
                      className="hidden"
                      id="quotation-upload"
                    />
                    <label
                      htmlFor="quotation-upload"
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-100 text-sm font-medium"
                    >
                      <Upload size={16} className="inline-block mr-2" /> Upload File
                    </label>
                    {selectedEnquiry.quotationFile && (
                      <button className="flex items-center text-green-600 hover:underline">
                        <Eye size={16} className="mr-1" /> View
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Quotation Status</label>
                  <button
                    className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200"
                  >
                    <CheckCircle size={16} className="mr-2" /> Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Status</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                      currentStatus === 'Under Review' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : currentStatus === 'PO Received' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentStatus}
                    </span>
                    <p className="mt-2 text-sm text-gray-600">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsProcessTrackerOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
              
              {isProcessTrackerOpen && (
                <ProcessTracker
                  isOpen={true}
                  onClose={() => setIsProcessTrackerOpen(false)}
                  currentStatus={currentStatus}
                  onStatusUpdate={setCurrentStatus}
                  selectedEnquiry={selectedEnquiry}
                />
              )}
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status History</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-full">
                      <div className="h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                      <div className="h-full w-0.5 bg-gray-300 ml-[7px] mt-1"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">Enquiry Received</p>
                      <p className="text-xs text-gray-500">{selectedEnquiry.enquiryReceivedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-full">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                      <div className="h-full w-0.5 bg-gray-300 ml-[7px] mt-1"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">Quotation Sent</p>
                      <p className="text-xs text-gray-500">{selectedEnquiry.dateQuoted}</p>
                    </div>
                  </div>
                  
                  {selectedEnquiry.customerPODate && (
                    <div className="flex items-start">
                      <div className="h-full">
                        <div className="h-4 w-4 rounded-full bg-yellow-500 mt-1"></div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-800">PO Received</p>
                        <p className="text-xs text-gray-500">{selectedEnquiry.customerPODate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;