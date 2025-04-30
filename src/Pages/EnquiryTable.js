import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';

const EnquiryTable = ({
  enquiries = [],
  onActionClick,
  isLoading,
  selectedCustomerName,
  customerMap = {}, // Use the customerMap prop
}) => {
  // Assuming `customers` is already available and parsed correctly
  // No need to re-declare customerMap inside the component

  const [searchTerm, setSearchTerm] = useState('');



  // Filter enquiries based on search term
  const filteredEnquiries = Array.isArray(enquiries)
    ? enquiries.filter(enquiry =>
    (enquiry.EnquiryRegisterNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.ProjectName?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" max-w-7xl bg-white px-3 rounded-lg ml-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Enquiry List</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search enquiries by project name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-0 pr-4 py-2 border border-gray-300 rounded-lg "
            />
            <Search className="absolute right-3 top-2.5 h-5 w-10 text-blue-600 font-bold" />
          </div>
        </div>
      </div>

      {selectedCustomerName && (
        <div className="mb-4 text-sm text-gray-600">
          Showing enquiries for: <span className="font-medium">{selectedCustomerName}</span>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg max-h-[60vh] relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry Id</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEnquiries.map((enquiry, index) => (
              <tr key={enquiry.pPkEnquiryMasterId || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.pPkEnquiryMasterId || `${index + 1}`}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.EnquiryRegisterNo || '-'}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customerMap[enquiry.FkCustomerId] || '-'} {/* Use customerMap directly */}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.ProjectName || enquiry.projectVehicleProgram || '-'}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${enquiry.IsStatus === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {enquiry.IsStatus === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onActionClick(enquiry)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition"
                  >
                    <FileText size={16} className="mr-1" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No enquiries found</p>
            <p className="text-sm">Try adjusting your search or add a new enquiry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryTable;
