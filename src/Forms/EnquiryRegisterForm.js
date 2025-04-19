import React, { useState } from 'react';
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

const EnquiryForm = () => {
  const { userData } = useAuth();
  const [page, setPage] = useState('form');

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
    isStatus: 0  // Set default to active (1)
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitError, setSubmitError] = useState('');

  const { data: enquiries = [], isLoading: isLoadingEnquiries, refetch } = useGetEnquiriesQuery();
  const { data: customers = [], isLoading: isLoadingCustomers, error: customerError } = useGetCustomersQuery(userData);
  // Safe parsing of master fill API
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

// Create a map from customer ID to name
const customerMap = {};
parsedCustomers.forEach(cust => {
  customerMap[cust.DataValueField] = cust.DataTextField;
});


  const [checkDuplicate, { isLoading: isCheckingDuplicate }] = useCheckDuplicateEnquiryMutation();
  const [addEnquiry, { isLoading: isSubmitting }] = useAddEnquiryMutation();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      if (!formData.pFkCustomerId || !formData.customerName || !formData.projectVehicleProgram || !formData.partCode || !formData.partName || !formData.rawMaterial) {
        setSubmitError('Please fill in all required fields');
        return;
      }

      // Check for duplicate entries
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

      // Add new enquiry
      await addEnquiry({
        pPkEnquiryMasterId: 0,
        pFkCustomerId: formData.pFkCustomerId,
        projectVehicleProgram: formData.projectVehicleProgram,
        partCode: formData.partCode,
        partName: formData.partName,
        rawMaterial: formData.rawMaterial,
        remark: formData.remark,
        isStatus: formData.isStatus // Changed from pisStatus to isStatus
      }).unwrap();

      resetForm();
      alert('Enquiry registered successfully!');
      setPage('table');
      refetch();
    } catch (error) {
      console.error('Operation failed:', error);
      setSubmitError(error.message || 'Operation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setPage('form')}
              className={`pb-4 px-1 text-sm font-medium ${page === 'form'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Register Enquiry
            </button>
            <button
              onClick={() => { setPage('table'); refetch(); }}
              className={`pb-4 px-1 text-sm font-medium ${page === 'table'
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Enquiry Registration Form
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Project/Vehicle Program <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="projectVehicleProgram"
                      value={formData.projectVehicleProgram}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Part Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Part Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Part Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="partCode"
                      value={formData.partCode}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SOP Date
                    </label>
                    <input
                      type="date"
                      name="sop"
                      value={formData.sop}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isStatus === 1}
                        onChange={handleStatusChange}
                      />

                      <span className="ml-2 text-sm text-gray-600">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCheckingDuplicate}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 ${(isSubmitting || isCheckingDuplicate) ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? 'Saving...' : isCheckingDuplicate ? 'Checking...' : 'Save Enquiry'}
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
   refetch={refetch}
   onNewEnquiryClick={() => setPage('form')}
   customerMap={customerMap}
 />
 
       
        )}
      </div>
    </div>
  );
};

export default EnquiryForm;