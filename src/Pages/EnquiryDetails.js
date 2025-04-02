// src/components/EnquiryDetails.js
import React, { useState } from "react";
import { X } from "lucide-react";
import EnquiryTable from "../Components/EnquiryTable";
import ProcessTracker from "../Components/ProcessTracker";
import { downloadCSV, downloadExcel, downloadPDF } from "../utils/fileUtils";

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

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setSelectedEnquiry((prev) => ({ ...prev, [field]: value }));

    setEnquiries((prev) =>
      prev.map((enq) => (enq.id === selectedEnquiry.id ? { ...enq, [field]: value } : enq))
    );
  };

  const filteredEnquiries = enquiries.filter((enquiry) => enquiry.id.toString().includes(searchQuery));

  const [selectedFormat, setSelectedFormat] = useState("");

  const handleSelectChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleDownload = (format) => {
    switch (format) {
      case "csv":
        downloadCSV(selectedEnquiry);
        break;
      case "excel":
        downloadExcel(selectedEnquiry);
        break;
      case "pdf":
        downloadPDF(selectedEnquiry);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Enquiry Management</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <EnquiryTable filteredEnquiries={filteredEnquiries} handleViewDetails={handleViewDetails} />

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="flex gap-6 max-w-[1200px] m-4">
            <div className="w-[600px] bg-white shadow-lg p-6 rounded-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Enquiry Details</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="text-gray-500 hover:text-gray-700">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Editable fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                      <input
                        type="text"
                        value={selectedEnquiry.customerName}
                        onChange={(e) => handleInputChange(e, "customerName")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project/Vehicle Program</label>
                      <input
                        type="text"
                        value={selectedEnquiry.projectVehicleProgram}
                        onChange={(e) => handleInputChange(e, 'projectVehicleProgram')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Code</label>
                      <input
                        type="text"
                        value={selectedEnquiry.partCode}
                        onChange={(e) => handleInputChange(e, 'partCode')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Name</label>
                      <input
                        type="text"
                        value={selectedEnquiry.partName}
                        onChange={(e) => handleInputChange(e, 'partName')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Raw Material</label>
                      <input
                        type="text"
                        value={selectedEnquiry.rawMaterial}
                        onChange={(e) => handleInputChange(e, 'rawMaterial')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SOP Date</label>
                      <input
                        type="date"
                        value={selectedEnquiry.sop}
                        onChange={(e) => handleInputChange(e, 'sop')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Colour</label>
                      <input
                        type="text"
                        value={selectedEnquiry.partColour}
                        onChange={(e) => handleInputChange(e, 'partColour')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Volume</label>
                      <input
                        type="number"
                        value={selectedEnquiry.estimatedAnnualVolume}
                        onChange={(e) => handleInputChange(e, 'estimatedAnnualVolume')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Enquiry Received Date</label>
                      <input
                        type="date"
                        value={selectedEnquiry.enquiryReceivedDate}
                        onChange={(e) => handleInputChange(e, 'enquiryReceivedDate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Cost (₹)</label>
                      <input
                        type="number"
                        value={selectedEnquiry.partCostEstimate}
                        onChange={(e) => handleInputChange(e, 'partCostEstimate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Quoted</label>
                      <input
                        type="date"
                        value={selectedEnquiry.dateQuoted}
                        onChange={(e) => handleInputChange(e, 'dateQuoted')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tool Cost (₹)</label>
                      <input
                        type="number"
                        value={selectedEnquiry.toolCostEstimate}
                        onChange={(e) => handleInputChange(e, 'toolCostEstimate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Business Potential (Lac)</label>
                      <input
                        type="number"
                        value={selectedEnquiry.annualBusinessPotential}
                        onChange={(e) => handleInputChange(e, 'annualBusinessPotential')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">P.O. No.</label>
                      <input
                        type="text"
                        value={selectedEnquiry.poNo}
                        onChange={(e) => handleInputChange(e, 'poNo')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Display fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.customerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project/Vehicle Program</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.projectVehicleProgram}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Code</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.partCode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Name</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.partName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Raw Material</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.rawMaterial}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SOP Date</label>
                      <p className="mt-1 block w-full text-gray-600">{new Date(selectedEnquiry.sop).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Colour</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.partColour}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Enquiry Received Date</label>
                      <p className="mt-1 block w-full text-gray-600">{new Date(selectedEnquiry.enquiryReceivedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Quoted</label>
                      <p className="mt-1 block w-full text-gray-600">{new Date(selectedEnquiry.dateQuoted).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer PO Date</label>
                      <p className="mt-1 block w-full text-gray-600">{new Date(selectedEnquiry.customerPODate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Volume</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.estimatedAnnualVolume}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Cost (₹)</label>
                      <p className="mt-1 block w-full text-gray-600">₹{selectedEnquiry.partCostEstimate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tool Cost (₹)</label>
                      <p className="mt-1 block w-full text-gray-600">₹{selectedEnquiry.toolCostEstimate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Business Potential (Lac)</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.annualBusinessPotential} Lac</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">P.O. No.</label>
                      <p className="mt-1 block w-full text-gray-600">{selectedEnquiry.poNo || "-"}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-700 mb-2">Design Files</h4>
                  {selectedEnquiry.designFiles && selectedEnquiry.designFiles.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEnquiry.designFiles.map((fileObj, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span>{fileObj.file.name}</span>
                          <a href={fileObj.url} className="text-blue-500 hover:text-blue-700">
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No files uploaded</p>
                  )}
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

                <div className="flex flex-col gap-4">
                  <label htmlFor="download-dropdown" className="font-medium text-gray-700">
                    Select Download Format:
                  </label>

                  <select
                    id="download-dropdown"
                    className="bg-white border border-gray-300 text-gray-800 rounded-md shadow-sm p-2"
                    onChange={handleSelectChange}
                  >
                    <option value="">--Choose Format--</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDownload(selectedFormat)}
                      className={`mt-4 p-2 text-white rounded-md w-60 justify-item-center 
      ${selectedFormat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={!selectedFormat}
                    >
                      Download
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    {isEditing ? "Save Changes" : "Edit"}
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
      )}
    </div>
  );
};

export default EnquiryDetails;