import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useGetEnquiriesQuery,
  useCheckDuplicateEnquiryMutation,
  useAddEnquiryMutation,
  useGetCustomersQuery
} from '../features/api/apiSliceenquiry';
import CustomerDropdown from '../Components/CustomerDropdown';
import FileUploader from '../Components/FileUploader';
import EnquiryTable from '../Components/EnquiryRegistrationTable';
import { ArrowLeft, Save, X } from 'lucide-react';

const EnquiryForm = () => {
  const { userData } = useAuth();
  const [page, setPage] = useState('form');
  const [editMode, setEditMode] = useState(false);

  const initialFormData = {
    srNo: '',
    pFkCustomerId: '',
    customerName: '',
    projectVehicleProgram: '',
    partCode: '',
    partName: '',
    rawMaterial: '',
    sop: '',
    remark: '',
    isStatus: 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitError, setSubmitError] = useState('');

  const { data: enquiries = [], isLoading: isLoadingEnquiries, refetch } = useGetEnquiriesQuery();
  const { data: customers = [], isLoading: isLoadingCustomers, error: customerError } = useGetCustomersQuery(userData);
  const [checkDuplicate, { isLoading: isCheckingDuplicate }] = useCheckDuplicateEnquiryMutation();
  const [addEnquiry, { isLoading: isSubmitting }] = useAddEnquiryMutation();

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

  const handleEditClick = (enquiry) => {
    setFormData({
      srNo: enquiry.srNo || '',
      pFkCustomerId: enquiry.FkCustomerId || '',
      customerName: customerMap[enquiry.FkCustomerId] || '',
      projectVehicleProgram: enquiry.ProjectName || enquiry.projectVehicleProgram || '',
      partCode: enquiry.PartCode || enquiry.partCode || '',
      partName: enquiry.PartName || enquiry.partName || '',
      rawMaterial: enquiry.RawMaterialName || enquiry.rawMaterial || '',
      sop: enquiry.sop || '',
      remark: enquiry.remark || '',
      isStatus: enquiry.IsStatus || 0
    });
    setEditMode(true);
    setPage('form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      pFkCustomerId: customer.id,
      customerName: customer.name
    }));
  };

  const handleStatusChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      isStatus: checked ? 1 : 0,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFiles([]);
    setFileInputKey(prev => prev + 1);
    setSubmitError('');
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      if (!formData.pFkCustomerId || !formData.customerName || !formData.projectVehicleProgram || !formData.partCode || !formData.partName || !formData.rawMaterial) {
        setSubmitError('Please fill in all required fields');
        return;
      }

      if (!editMode) {
        const duplicateResult = await checkDuplicate({
          pFkCustomerId: formData.pFkCustomerId,
          projectVehicleProgram: formData.projectVehicleProgram,
          partCode: formData.partCode,
          partName: formData.partName,
          rawMaterial: formData.rawMaterial
        }).unwrap();

        if (duplicateResult.isDuplicate) {
          setSubmitError('An enquiry with similar details already exists!');
          return;
        }
      }

      await addEnquiry({
        pPkEnquiryMasterId: editMode ? formData.pPkEnquiryMasterId : 0,
        pFkCustomerId: formData.pFkCustomerId,
        projectVehicleProgram: formData.projectVehicleProgram,
        partCode: formData.partCode,
        partName: formData.partName,
        rawMaterial: formData.rawMaterial,
        remark: formData.remark,
        isStatus: formData.isStatus
      }).unwrap();

      resetForm();
      alert(editMode ? 'Enquiry updated successfully!' : 'Enquiry registered successfully!');
      setPage('table');
      refetch();
    } catch (error) {
      console.error('Operation failed:', error);
      setSubmitError(error.message || 'Operation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-2 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex justify-start space-x-8">
            <button
              onClick={() => { setPage('form'); setEditMode(false); }}
              className={`pb-3 px-1 text-sm font-medium ${page === 'form'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Register Enquiry
            </button>
            <button
              onClick={() => { setPage('table'); refetch(); }}
              className={`pb-3 px-1 text-sm font-medium ${page === 'table'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              View Enquiries
            </button>
          </nav>
        </div>

        {/* Form Page */}
        {page === 'form' && (
          <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {editMode && (
                  <button
                    onClick={() => { setPage('table'); resetForm(); }}
                    className="mr-4 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {editMode ? 'Edit Enquiry' : 'Register Enquiry'}
                </h2>
              </div>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <CustomerDropdown
                      selectedCustomer={formData.customerName}
                      onCustomerSelect={handleCustomerSelect}
                      customers={customers}
                      isLoading={isLoadingCustomers}
                      error={customerError}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <CustomerDropdown
                      selectedCustomer={formData.customerName}
                      onCustomerSelect={handleCustomerSelect}
                      customers={customers}
                      isLoading={isLoadingCustomers}
                      error={customerError}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project/Vehicle Program <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="projectVehicleProgram"
                      value={formData.projectVehicleProgram}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Part Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Part Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Part Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="partCode"
                      value={formData.partCode}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Part Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="partName"
                      value={formData.partName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Raw Material <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="rawMaterial"
                      value={formData.rawMaterial}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <FileUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                fileInputKey={fileInputKey}
                setFileInputKey={setFileInputKey}
              />

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SOP Date
                    </label>
                    <input
                      type="date"
                      name="sop"
                      value={formData.sop}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isStatus"
                        checked={formData.isStatus === 1}
                        onChange={handleStatusChange}
                        className="mr-2"
                      />
                      Mark as Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pr-4">
               
                <button
                  type="submit"
                  disabled={isSubmitting || isCheckingDuplicate}
                  className={`flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md ${isSubmitting || isCheckingDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {isSubmitting || isCheckingDuplicate ? 'Submitting...' : <><Save className="w-5 h-5 mr-2" />Save</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table Page */}
        {page === 'table' && (
          <EnquiryTable
            enquiries={enquiries}
            isLoading={isLoadingEnquiries}
            handleEditClick={handleEditClick}
          />
        )}
      </div>
    </div>
  );
};

export default EnquiryForm;
