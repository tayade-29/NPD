import React, { useState } from 'react';
import { Search, RefreshCw, PlusCircle, Edit } from 'lucide-react';

const EnquiryTable = ({
  enquiries = [],
  isLoading,
  refetch,
  onNewEnquiryClick,
  selectedCustomerName,
  customerMap = {},
  onEditClick
}) => {

  const [searchTerm, setSearchTerm] = useState('');

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
    <div className=" max-w-7xl bg-white p-2 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800">Enquiry List</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {selectedCustomerName && (
        <div className="mb-4 text-sm text-gray-600">
          Showing enquiries for: <span className="font-medium">{selectedCustomerName}</span>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Enquiry No
</th>

              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Material</th>
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
                  {customerMap[enquiry.FkCustomerId] || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.ProjectName || enquiry.projectVehicleProgram || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.PartCode || enquiry.partCode || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.PartName || enquiry.partName || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.RawMaterialName || enquiry.rawMaterial || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    enquiry.IsStatus === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {enquiry.IsStatus === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => onEditClick(enquiry)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-150 rounded-lg px-3 py-1.5 inline-flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
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