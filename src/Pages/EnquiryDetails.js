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

  const { 
    data: checkpointsData,
    isLoading: checkpointsLoading,
    error: checkpointsError
  } = useGetCheckpointsQuery(selectedEnquiry?.EnquiryRegisterNo);

  // Initialize rows with proper mutable objects
  useEffect(() => {
    if (checkpointsData && activeTab === 1) {
      const initializedRows = checkpointsData.map(row => {
        const parsedRow = typeof row === 'string' ? JSON.parse(row) : {...row};
        return {
          ...parsedRow,
          details: parsedRow.details || '',
          comment: parsedRow.comment || '',
          responsible: parsedRow.responsible || '',
          targetDate: parsedRow.targetDate || ''
        };
      });
      setRows(initializedRows);
    }
  }, [checkpointsData, activeTab]);

  // Proper immutable update for row changes
  const handleRowChange = (index, field, value) => {
    setRows(prevRows => {
      const newRows = prevRows.map((row, i) => {
        if (i === index) {
          return { ...row, [field]: value };
        }
        return row;
      });
      return newRows;
    });
  };

  const handleReset = () => {
    if (checkpointsData) {
      const resetRows = checkpointsData.map(row => ({
        ...(typeof row === 'string' ? JSON.parse(row) : row),
        details: '',
        comment: '',
        responsible: '',
        targetDate: ''
      }));
      setRows(resetRows);
    }
  };

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
 

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
  
    const enquiryId = selectedEnquiry?.PkEnquiryMasterId;
    const createdBy = userData?.userId;
  
    if (!createdBy || !enquiryId) {
      alert("Missing user or enquiry info.");
      setIsSaving(false);
      return;
    }
  
    const validRows = rows.filter((row) => {
      const data = typeof row === "string" ? JSON.parse(row) : row;
      return (
        data.DataTextField &&
        data.responsible &&
        data.targetDate &&
        !isNaN(new Date(data.targetDate).getTime())
      );
    });
  
    if (validRows.length === 0) {
      alert("No valid rows to save.");
      setIsSaving(false);
      return;
    }
  
    const payloads = validRows.map((checkpointData) => {
      // 🔄 Map from checkpoint text to master list value
      const matchedMaster = checkpointsData?.find(
        item => item.DataTextField.trim() === checkpointData.DataTextField.trim()
      );
  
      const preliminaryId = matchedMaster?.DataValueField || 0;
  
      return {
        pPkNPDEnquiryInitialFeasibilityStudyId: 0,
        pFkEnquiryMasterId: selectedEnquiry?.PkEnquiryMasterId,
        pFkNPDPreliminaryInitialStudyId: preliminaryId,
        pFkResponsiblePersonId: Number(checkpointData.responsible),
        pCommentActionRequired: checkpointData.comment || "",
        pTargetDate:'',
        pCreatedBy: userData?.roleId
      };
    });
  
    // ❌ Filter out any payloads without a valid master ID
    const filteredPayloads = payloads.filter(p => p.pFkNPDPreliminaryInitialStudyId > 0);
    if (filteredPayloads.length === 0) {
      alert("Mapping failed: No valid preliminary study IDs found.");
      setIsSaving(false);
      return;
    }
  
    try {
      const results = await Promise.allSettled(
        filteredPayloads.map(payload => saveFeasibilityCheck(payload).unwrap())
      );
  
      const failed = results.filter(r => r.status === "rejected");
  
      if (failed.length > 0) {
        throw new Error(`${failed.length}/${results.length} saves failed`);
      }
  
      alert("Feasibility data saved successfully.");
    } catch (err) {
      console.error("Feasibility Save Error:", err);
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  
  
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

const { data: responsiblePersons = [], isLoading: responsibleLoading } = useGetResponsiblePersonQuery({
  clientId: userData?.clientId, // you can make these dynamic if needed
  plantId: userData?.plantId,
  locationId: userData?.locationId
});

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
                 {activeTab === 1 && (
  <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
    {/* Loading & Error States */}
    {checkpointsLoading ? (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent" />
      </div>
    ) : checkpointsError ? (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Error</h3>
          <p className="text-sm text-gray-500">{checkpointsError.message}</p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col h-full divide-y divide-gray-200">
        {/* Header */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Initial Feasibility Check</h3>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-12">Sr. No.</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[300px]">
                    Check Points
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Details</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Comments</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Responsible</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((checkpointData, index) => (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-500 align-top">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 align-top">
        {checkpointData.DataTextField}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          placeholder="Enter details"
          value={checkpointData.details}
          onChange={(e) => handleRowChange(index, "details", e.target.value)}
        />
      </td>
      <td className="px-4 py-3 align-top">
        <textarea
          rows={1}
          className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          placeholder="Add comments"
          value={checkpointData.comment}
          onChange={(e) => handleRowChange(index, "comment", e.target.value)}
        />
      </td>
      <td className="px-4 py-3 align-top">
      <select
  className="w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  value={checkpointData.responsible}
  onChange={(e) => handleRowChange(index, "responsible", e.target.value)}
>
  <option value="">Select Responsible</option>

  {responsibleLoading ? (
    <option disabled>Loading...</option>
  ) : (
    responsiblePersons.map((person) => (
      <option key={person.DataValueField} value={person.DataValueField}>
        {person.DataTextField}
      </option>
    ))
  )}
</select>

      </td>
      <td className="px-4 py-3 align-top">
        <div className="relative">
          <input
            type="date"
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            value={checkpointData.targetDate}
            onChange={(e) => handleRowChange(index, "targetDate", e.target.value)}
          />
          <CalendarDays className="h-4 w-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </td>
    </tr>
  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Supporting Documents</h4>
                  <p className="text-sm text-gray-500 mt-1">Upload relevant feasibility documents</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "feasibilityFile")}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500">
                    <Upload className="h-5 w-5 mr-2 text-gray-500" />
                    Upload File
                  </div>
                </label>
              </div>
              {selectedEnquiry.feasibilityFile && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{selectedEnquiry.feasibilityFile.name}</span>
                  <button className="text-blue-600 hover:text-blue-800 ml-2 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                </div>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEnquiry.isFeasible || false}
                      onChange={(e) => handleCheckboxChange(e, "isFeasible")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:bg-blue-600">
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Mark as Feasible
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                    rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500"
                >
                  Reset Changes
                </button>
                <button
  onClick={handleSave}
  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
    rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
    focus:ring-blue-500"
>
  Save All Changes
</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    )}
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

       



