import React, { useEffect, useState } from 'react';
import { 
  X, 
  Save, 
  Edit2, 
  Upload, 
  FileText, 
  CalendarDays, 
  Eye, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import ProcessTracker from "../Components/ProcessTracker";
import { useGetCheckpointsQuery, useSaveFeasibilityCheckMutation,useSaveQuotationDetailsMutation,useSaveCustomerPODetailsMutation,
  useGetResponsiblePersonQuery
} from '../features/api/apiSliceenquiry';
import { useAuth } from '../context/AuthContext';

const EnquiryDetails = ({ enquiry, onClose }) => {
  const { userData } = useAuth();
  const [saveFeasibilityCheck] = useSaveFeasibilityCheckMutation();
  const [selectedEnquiry, setSelectedEnquiry] = useState(enquiry);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [isProcessTrackerOpen, setIsProcessTrackerOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);


  const handleInputChange = (e, field) => {
    setSelectedEnquiry(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (e, field) => {
    setSelectedEnquiry(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setSelectedEnquiry(prev => ({ ...prev, [field]: file }));
  };
 

  const handleSave = () => {
    // Your logic for handling the save action goes here
    console.log("Save button clicked");
    // You could also call your API or handle other actions here
  };
  
  

  const [isFeasible, setIsFeasible] = useState(false);
  const [checkpoints, setCheckpoints] = useState([]);
  const [responsiblePersons, setResponsiblePersons] = useState([]);
  const [feasibilityRows, setFeasibilityRows] = useState([]);


  // Fetch checkpoints when the tab is active
  const { data: checkpointData } = useGetCheckpointsQuery();
  const { data: responsibleData } = useGetResponsiblePersonQuery({
    clientId: userData?.clientId,
    plantId: userData?.plantId,
    locationId: userData?.locationId
  });

  useEffect(() => {
    if (checkpoints.length > 0) {
      setFeasibilityRows(checkpoints.map((checkpoint, index) => ({
        serialNo: index + 1,
        checkpointText: checkpoint.DataTextField,
        checkpointId: checkpoint.DataValueField,
        details: '',
        comments: '',
        responsiblePersonId: '',
        responsiblePersonName: '',
        targetDate: '',
      })));
    }
  }, [checkpoints]);
  
  useEffect(() => {
    if (checkpointData?.length) {
      setCheckpoints(checkpointData); // ✅ it's already parsed
    }
  }, [checkpointData]);
  
  

  useEffect(() => {
    if (responsibleData?.length) {
      setResponsiblePersons(responsibleData); // ✅ already parsed
    }
  }, [responsibleData]);
  

  // Handle checkbox change
  const handleFeasibilityChange = () => {
    setIsFeasible(!isFeasible);
  };

  const handleSaveFeasibility = async () => {
    const userId = userData?.userId; // or use CreatedBy if named differently
    const enquiryId = selectedEnquiry?.PkEnquiryMasterId;
  
    try {
      const savePromises = feasibilityRows.map(row => {
        return saveFeasibilityCheck({
          pPkNPDEnquiryInitialFeasibilityStudyId: 0,
          pFkEnquiryMasterId: enquiryId,
          pFkNPDPreliminaryInitialStudyId: row.checkpointId,           // ✅ checkpoint ID
          pFkResponsiblePersonId: row.responsiblePersonId,  
          pCommentActionRequired: row.comments || '',
          pTargetDate: row.targetDate || '',
          pCreatedBy: userData?.roleId,
        }).unwrap(); // unwrap to get promise
      });
  
      const responses = await Promise.all(savePromises);
      console.log("Feasibility saved successfully", responses);
      alert("Feasibility saved successfully");
    } catch (error) {
      console.error("Error saving feasibility:", error);
      alert("Something went wrong while saving feasibility");
    }
  };
  

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...feasibilityRows];
    if (field === "responsiblePersonId") {
      const selected = responsiblePersons.find(p => p.DataValueField === parseInt(value));
      updatedRows[index]["responsiblePersonName"] = selected?.DataTextField || '';
    }
    updatedRows[index][field] = value;
    setFeasibilityRows(updatedRows);
  };
  


  // Don't go here
  
  
  const [saveQuotationDetails, { isLoading, isSuccess, error }] = useSaveQuotationDetailsMutation();
  const handleSubmitQuotation = async () => {
    try {
      const payload = {
        pPkEnquiryMasterId: selectedEnquiry?.PkEnquiryMasterId,
        pQuotationNo: selectedEnquiry.quotationNumber,
        pQuotationDate: selectedEnquiry.quotationDate,
        pPartCost: selectedEnquiry.partCost || 0, // Default to 0 if not provided
        pToolCost: selectedEnquiry.toolCost || 0,
      };
  
      const response = await saveQuotationDetails(payload).unwrap();
      console.log("Quotation saved:", response);
      // Optionally show success message here
    } catch (err) {
      console.error("Failed to save quotation:", err);
      // Show error message here
    }
  };
  

  const [saveCustomerPODetails] = useSaveCustomerPODetailsMutation();

const handleSubmitPO = async () => {
  try {
    const payload = {
      pPkEnquiryMasterId: selectedEnquiry?.PkEnquiryMasterId,
      pCustomerPODate: selectedEnquiry?.customerPODate,
      pCustomerPONo: selectedEnquiry?.customerPONo,
    };

    const response = await saveCustomerPODetails(payload).unwrap();
    console.log("P.O. saved successfully", response);
    // Add toast or UI feedback here
  } catch (err) {
    console.error("Error saving P.O.:", err);
    // Add error feedback here
  }
};



  const tabs = [
    "View Details", "Initial Feasibility Check", "Quotation", "P.O.", "Status"
  ];

  // Rest of the component remains the same...

  // Fields to display based on the response
  const fieldsToDisplay = [
    { key: "EnquiryRegisterNo", label: "Enquiry Register No" },
    { key: "ProjectName", label: "Project Name" },
    { key: "PartCode", label: "Part Code" },
    { key: "PartName", label: "Part Name" },
    { key: "RawMaterialName", label: "Raw Material Name" },
    { key: "EnquiryDate", label: "Enquiry Date", type: "date" },
    { key: "IsActive", label: "Is Active" },
    { key: "CustomerName", label: "Customer Name" },

  ];

  if (!selectedEnquiry) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="w-[1100px] h-[700px] bg-white rounded-xl flex flex-col">
        <div className="p-6 pb-0 border-b bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-500">
              Enquiry Details <span className="text-sm font-normal text-gray-500 ml-2">{selectedEnquiry.EnquiryRegisterNo}</span>
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
          {/* View Details Tab */}
          {activeTab === 0 && (
  <div className="space-y-8 bg-gray-50">
    {/* Form Grid with Spacing and Styling */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fieldsToDisplay.map(({ key, label, type }) => (
        <div key={key} className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-gray-700 w-1/3">{label}:</label>
          {isEditing ? (
            <input
              type={type || "text"}
              value={selectedEnquiry[key] || ""}
              onChange={(e) => handleInputChange(e, key)}
              className="w-2/3 p-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          ) : (
            <p className="w-2/3 text-gray-800">{selectedEnquiry[key] || "N/A"}</p>
          )}
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="flex justify-center pt-6 space-x-4">
      {isEditing ? (
        <button
          onClick={handleSave}
          className="flex items-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all duration-300"
        >
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
        >
          <Edit2 size={18} className="mr-2" />
          Edit Details
        </button>
      )}
    </div>
  </div>
)}

                 {/* Feasibility */}
                 {activeTab === 1 && ( // Assuming 1 is the index for Initial Feasibility
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Initial Feasibility</h3>
          
          {/* Table for Checkpoints */}
          <div className="overflow-y-auto max-h-60">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Checkpoint</th>
                  <th>Checkpoint ID</th>
                  <th>Details</th>
                  <th>Comments</th>
                  <th>Responsible Person</th>
                  <th>Responsible Person ID</th>
                  <th>Target Date</th>
                </tr>
              </thead>
              <tbody>
  {feasibilityRows.map((row, index) => (
    <tr key={row.checkpointId}>
      <td>{row.serialNo}</td>
      <td>{row.checkpointText}</td>
      <td>{row.checkpointId}</td>
      <td>
        <input
          type="text"
          value={row.details}
          onChange={(e) => handleRowChange(index, "details", e.target.value)}
          className="border p-1 rounded w-full"
        />
      </td>
      <td>
        <input
          type="text"
          value={row.comments}
          onChange={(e) => handleRowChange(index, "comments", e.target.value)}
          className="border p-1 rounded w-full"
        />
      </td>
      <td>
        <select
          value={row.responsiblePersonId}
          onChange={(e) => handleRowChange(index, "responsiblePersonId", e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="">Select</option>
          {responsiblePersons.map(person => (
            <option key={person.DataValueField} value={person.DataValueField}>
              {person.DataTextField}
            </option>
          ))}
        </select>
      </td>
      <td>{row.responsiblePersonId}</td>
      <td>
        <input
          type="date"
          value={row.targetDate}
          onChange={(e) => handleRowChange(index, "targetDate", e.target.value)}
          className="border p-1 rounded w-full"
        />
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

          {/* Feasibility Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={isFeasible}
              onChange={handleFeasibilityChange}
              className="mr-2"
            />
            <label>Is Feasible</label>
          </div>

          {/* Save Button */}
          <div className="mt-4">
            <button
              onClick={handleSaveFeasibility}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
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
      {/* Quotation Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quotation Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={selectedEnquiry.quotationNumber || ""}
          onChange={(e) => handleInputChange(e, "quotationNumber")}
          placeholder="Enter quotation number"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Quotation Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quotation Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedEnquiry.quotationDate || ""}
            onChange={(e) => handleInputChange(e, "quotationDate")}
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <CalendarDays size={18} />
          </div>
        </div>
      </div>

      {/* Part Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Part Cost (₹)
        </label>
        <input
          type="number"
          value={selectedEnquiry.partCost || ""}
          onChange={(e) => handleInputChange(e, "partCost")}
          placeholder="Enter part cost"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Tool Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tool Cost (₹)
        </label>
        <input
          type="number"
          value={selectedEnquiry.toolCost || ""}
          onChange={(e) => handleInputChange(e, "toolCost")}
          placeholder="Enter tool cost"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Quotation File
        </label>
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
            <button
              type="button"
              className="flex items-center text-green-600 hover:underline"
            >
              <Eye size={16} className="mr-1" /> View
            </button>
          )}
        </div>
      </div>

      {/* Status Toggle / Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quotation Status
        </label>
        <button
          type="button"
          className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200"
        >
          <CheckCircle size={16} className="mr-2" /> Mark as Complete
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-4 text-right">
        <button
          onClick={handleSubmitQuotation}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
        >
          <Upload size={16} className="mr-2" /> Submit Quotation
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
      {/* Purchase Order Number */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Purchase Order Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={selectedEnquiry.customerPONo || ""}
          onChange={(e) => handleInputChange(e, "customerPONo")}
          placeholder="Enter P.O. number"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* P.O. Date */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          P.O. Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedEnquiry.customerPODate || ""}
            onChange={(e) => handleInputChange(e, "customerPODate")}
            className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <CalendarDays size={18} />
          </div>
        </div>
      </div>

      {/* Upload File (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Upload P.O. File</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "poFile")}
            className="hidden"
            id="po-upload"
          />
          <label
            htmlFor="po-upload"
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-100 text-sm font-medium"
          >
            <Upload size={16} className="inline-block mr-2" /> Upload File
          </label>
          {selectedEnquiry.poFile && (
            <button className="flex items-center text-green-600 hover:underline">
              <Eye size={16} className="mr-1" /> View
            </button>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={handleSubmitPO}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Upload size={16} className="mr-2" /> Submit P.O.
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

       



