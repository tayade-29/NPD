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
  AlertTriangle,
  Check
} from "lucide-react";
import ProcessTracker from "../Components/ProcessTracker";
import {
  useGetCheckpointsQuery, useSaveFeasibilityCheckMutation, useSaveQuotationDetailsMutation, useSaveCustomerPODetailsMutation,
  useGetResponsiblePersonQuery
} from '../features/api/apiSliceenquiry';
import { useAuth } from '../context/AuthContext';

const EnquiryDetails = ({ enquiry, onClose }) => {
  const { userData } = useAuth();
  const [saveFeasibilityCheck] = useSaveFeasibilityCheckMutation();
  const [poSubActiveTab, setPoSubActiveTab] = useState(0); // 0 for Supplier, 1 for Customer
  const [subActiveTab, setSubActiveTab] = useState(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState(enquiry);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [isProcessTrackerOpen, setIsProcessTrackerOpen] = useState(false);



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

  // For view details tab
  const handleSave = () => {
    console.log("Save button clicked");
  };



  // {for initial feasibilty check tab}
  const [isFeasible, setIsFeasible] = useState(true);
  const [checkpoints, setCheckpoints] = useState([]);
  const [responsiblePersons, setResponsiblePersons] = useState([]);
  const [feasibilityRows, setFeasibilityRows] = useState([]);
  const [feasibilityReason, setFeasibilityReason] = useState('');
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
      setCheckpoints(checkpointData);
    }
  }, [checkpointData]);
  useEffect(() => {
    if (responsibleData?.length) {
      setResponsiblePersons(responsibleData);
    }
  }, [responsibleData]);
  const handleFeasibilityChange = () => {
    setIsFeasible(!isFeasible);
  };
  const handleSaveFeasibility = async () => {
    const userId = userData?.userId; //
    const enquiryId = selectedEnquiry?.PkEnquiryMasterId;

    try {
      const savePromises = feasibilityRows.map(row => {
        return saveFeasibilityCheck({
          pPkNPDEnquiryInitialFeasibilityStudyId: 0,
          pFkEnquiryMasterId: enquiryId,
          pFkNPDPreliminaryInitialStudyId: Number(row.checkpointId),           // ✅ checkpoint ID
          pFkResponsiblePersonId: Number(row.responsiblePersonId),
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
    if (feasibilityRows.some(row => !row.details || !row.targetDate)) {
      // Alert message when required fields are not filled
      alert("Please fill in all the fields (Details and Target Date) before saving.");
    }
  }

  const isSaveDisabled = () => {
    return feasibilityRows.some(row => !row.details || !row.targetDate);
  }

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...feasibilityRows];
    if (field === "responsiblePersonId") {
      const selected = responsiblePersons.find(p => p.DataValueField === parseInt(value));
      updatedRows[index]["responsiblePersonName"] = selected?.DataTextField || '';
    }
    updatedRows[index][field] = value;
    setFeasibilityRows(updatedRows);
  };



  //  for quotation upload tab
  const [saveQuotationDetails, { isLoading, isSuccess, error }] = useSaveQuotationDetailsMutation();
  const handleSubmitQuotation = async () => {
    try {
      const payload = {
        pPkEnquiryMasterId: selectedEnquiry?.PkEnquiryMasterId,
        pQuotationNo: selectedEnquiry.quotationNumber,
        pQuotationDate: selectedEnquiry.quotationDate,
        pPartCost: selectedEnquiry.partCost || 0,
        pToolCost: selectedEnquiry.toolCost || 0,
      };

      const response = await saveQuotationDetails(payload).unwrap();
      console.log("Quotation saved:", response);
    } catch (err) {
      console.error("Failed to save quotation:", err);
    }
  };


  //  for PO tab
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
    } catch (err) {
      console.error("Error saving P.O.:", err);
    }
  };

  const tabs = [
    "View Details", "Initial Feasibility Check", "Quotation", "P.O.", "Status"
  ];

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
    <div className="fixed inset-0 bg-gray-50 flex items-center mt-0 z-50">
      <div className="w-full h-[600px] bg-white rounded-xl flex flex-col">
        <div className="px-10  pb-0 border-b bg-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Enquiry Details
              </h2>
              <p className="text-sm font-normal text-gray-800 ml-2 mt-1">
                {selectedEnquiry.EnquiryRegisterNo}
              </p>
            </div>


            <button onClick={onClose} className="text-gray-800 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="flex space-x-1">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-3 text-sm font-medium transition-colors justify-center rounded-t-lg ${activeTab === i
                    ? "bg-white border-t border-r border-l border-gray-200 text-blue-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* View Details Tab */}
          {activeTab === 0 && (
            <div className="flex justify-center">
              <div className="bg-gray-50 px-10 py-6 rounded-lg shadow-sm space-y-6 w-full max-w-5xl">
                {/* Form Title */}
                <h3 className="text-xl font-semibold text-gray-700">Enquiry Details</h3>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fieldsToDisplay.map(({ key, label, type }) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
                      {isEditing ? (
                        <input
                          type={type || "text"}
                          value={selectedEnquiry[key] || ""}
                          onChange={(e) => handleInputChange(e, key)}
                          className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800 text-sm">{selectedEnquiry[key] || "N/A"}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button Bottom-Right */}
                <div className="flex justify-end pt-2">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}




          {/* Feasibility */}
          {activeTab === 1 && (
            <div className="relative">
              {/* Scrollable Table Section */}
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-300 rounded-md">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600 uppercase text-xs shadow-sm">
                    <tr>
                      <th className="px-4 py-3">Serial No.</th>
                      <th className="px-4 py-3">Checkpoint</th>
                      <th className="hidden">Checkpoint ID</th>
                      <th className="px-4 py-3 w-60">Details</th>
                      <th className="px-4 py-3 w-60">Comments</th>
                      <th className="px-4 py-3 w-56">Responsible Person</th>
                      <th className="hidden">Responsible Person ID</th>
                      <th className="px-4 py-3">Target Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {feasibilityRows.map((row, index) => (
                      <tr key={row.checkpointId} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-2">{row.serialNo}</td>
                        <td className="px-4 py-2">{row.checkpointText}</td>
                        <td className="hidden">{row.checkpointId}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.details}
                            onChange={(e) => handleRowChange(index, "details", e.target.value)}
                            className="w-full border rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.comments}
                            onChange={(e) => handleRowChange(index, "comments", e.target.value)}
                            className="w-full border rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={row.responsiblePersonId}
                            onChange={(e) => handleRowChange(index, "responsiblePersonId", e.target.value)}
                            className="w-full border rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Select</option>
                            {responsiblePersons
                              .filter(person => person.DataValueField >= 1)
                              .map(person => (
                                <option key={person.DataValueField} value={person.DataValueField}>
                                  {person.DataTextField}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="hidden">{row.responsiblePersonId}</td>
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={row.targetDate}
                            onChange={(e) => handleRowChange(index, "targetDate", e.target.value)}
                            className="w-full border rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sticky Footer Section */}
              <div className="sticky bottom-0 bg-white py-2 border-t mt-0 z-20">
                {/* Feasibility Radio Buttons */}
                <div className="flex items-center gap-6 px-2 mb-4">
                  <span className="text-sm text-gray-700">Feasibility:</span>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="feasibility"
                      value="yes"
                      checked={isFeasible === true}
                      onChange={() => {
                        setIsFeasible(true);
                        setFeasibilityReason('');
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    Feasible
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="feasibility"
                      value="no"
                      checked={isFeasible === false}
                      onChange={() => setIsFeasible(false)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    Not Feasible
                  </label>
                </div>

                {/* Conditional Textarea for Reason */}
                {!isFeasible && (
                  <div className="px-2 mb-4">
                    <label className="block text-sm text-gray-700 mb-1">Reason for Non-Feasibility:</label>
                    <textarea
                      value={feasibilityReason}
                      onChange={(e) => setFeasibilityReason(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 resize-none focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Please explain why this is not feasible"
                      required
                    ></textarea>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end px-2">
                  <button
                    onClick={handleSaveFeasibility}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
                    disabled={isSaveDisabled()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quoatation */}
          {activeTab === 2 && (
            <div className="bg-white p-6 border border-gray-200 rounded-lg w-full max-w-4xl mx-auto shadow-sm">
              {/* Nested Tabs Header */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-4">
                  {['Supplier Quotation', 'Customer Quotation'].map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setSubActiveTab(idx)}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${subActiveTab === idx
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quotation Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Quotation Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedEnquiry.quotationNumber || ""}
                      onChange={(e) => handleInputChange(e, "quotationNumber")}
                      placeholder="Enter quotation number"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Quotation Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Quotation Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedEnquiry.quotationDate || ""}
                        onChange={(e) => handleInputChange(e, "quotationDate")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <CalendarDays className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Costs Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Part Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={selectedEnquiry.partCost || ""}
                      onChange={(e) => handleInputChange(e, "partCost")}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tool Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={selectedEnquiry.toolCost || ""}
                      onChange={(e) => handleInputChange(e, "toolCost")}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Upload Quotation File
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "quotationFile")}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                    {selectedEnquiry.quotationFile && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-1" />
                        File Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={handleSubmitQuotation}
                    className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Quotation
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* PO */}
          {activeTab === 3 && (
            <div className="bg-white p-6 border border-gray-200 rounded-lg w-full max-w-4xl mx-auto shadow-sm">
              {/* Nested Tabs Header */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-4">
                  {['Supplier P.O', 'Customer P.O'].map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setPoSubActiveTab(idx)}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${poSubActiveTab === idx
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* P.O Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {poSubActiveTab === 0 ? 'Supplier' : 'Customer'} P.O Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={poSubActiveTab === 0 ? selectedEnquiry.supplierPONo : selectedEnquiry.customerPONo || ""}
                      onChange={(e) => handleInputChange(e, poSubActiveTab === 0 ? "supplierPONo" : "customerPONo")}
                      placeholder={`Enter ${poSubActiveTab === 0 ? 'Supplier' : 'Customer'} P.O number`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* P.O Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {poSubActiveTab === 0 ? 'Supplier' : 'Customer'} P.O Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={poSubActiveTab === 0 ? selectedEnquiry.supplierPODate : selectedEnquiry.customerPODate || ""}
                        onChange={(e) => handleInputChange(e, poSubActiveTab === 0 ? "supplierPODate" : "customerPODate")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <CalendarDays className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Upload {poSubActiveTab === 0 ? 'Supplier' : 'Customer'} P.O File
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, poSubActiveTab === 0 ? "supplierPOFile" : "customerPOFile")}
                      className="hidden"
                      id="po-file-upload"
                    />
                    <label
                      htmlFor="po-file-upload"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                    {selectedEnquiry[poSubActiveTab === 0 ? "supplierPOFile" : "customerPOFile"] && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-1" />
                        File Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={handleSubmitPO}
                    className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit {poSubActiveTab === 0 ? 'Supplier' : 'Customer'} P.O
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Status Tab */}
          {activeTab === 4 && (
            <div className="space-y-8 p-4 md:p-6">

              {/* Current Status Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Current Status</h3>
                  <div className="mt-2 flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus === 'Under Review'
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentStatus === 'PO Received'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}>
                      {currentStatus}
                    </span>
                    <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsProcessTrackerOpen(true)}
                  className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                >
                  <Edit2 size={16} className="mr-2" />
                  Update Status
                </button>
              </div>

              {/* Status History Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Status History</h3>

                <div className="relative pl-6 space-y-8">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {/* Timeline Items */}
                  <div className="relative">
                    <div className="absolute -left-1 top-1 bg-green-500 h-3 w-3 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Enquiry Received</p>
                      <p className="text-xs text-gray-500">{selectedEnquiry.enquiryReceivedDate}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-1 top-1 bg-blue-500 h-3 w-3 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Quotation Sent</p>
                      <p className="text-xs text-gray-500">{selectedEnquiry.dateQuoted}</p>
                    </div>
                  </div>

                  {selectedEnquiry.customerPODate && (
                    <div className="relative">
                      <div className="absolute -left-1 top-1 bg-yellow-500 h-3 w-3 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">PO Received</p>
                        <p className="text-xs text-gray-500">{selectedEnquiry.customerPODate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Center Modal for Process Tracker */}
              {isProcessTrackerOpen && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white w-full max-w-[1200px] mx-4 elative">
                    <ProcessTracker
                      isOpen={true}
                      onClose={() => setIsProcessTrackerOpen(false)}
                      currentStatus={currentStatus}
                      onStatusUpdate={setCurrentStatus}
                      selectedEnquiry={selectedEnquiry}
                    />

                  </div>
                </div>
              )}
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;





