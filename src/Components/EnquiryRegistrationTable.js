import React, { useState } from 'react';
import { Search, RefreshCw, PlusCircle } from 'lucide-react';

const EnquiryTable = ({ 
  enquiries = [], 
  isLoading, 
  refetch, 
  onNewEnquiryClick 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEnquiries = Array.isArray(enquiries) 
    ? enquiries.filter(enquiry =>
        Object.values(enquiry).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800">Enquiry List</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={refetch}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={onNewEnquiryClick}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Enquiry
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Material</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEnquiries.map((enquiry, index) => (
              <tr key={enquiry.pPkEnquiryMasterId || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.pPkEnquiryMasterId || `ENQ-${index + 1}`}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enquiry.CustomerName || enquiry.customerName || '-'}
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
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    enquiry.IsStatus || enquiry.isStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {(enquiry.IsStatus || enquiry.isStatus) ? 'Active' : 'Inactive'}
                  </span>
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