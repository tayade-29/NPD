// src/components/EnquiryTable.js
import React from "react";

const EnquiryTable = ({ filteredEnquiries, handleViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
            <th className="px极6 py-4 text-left text-sm font-semibold text-gray-600">Project</th>
            <th className="px-6 py-4 text-left text-sm font-semib极old text-gray-600">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnquiries.map((enquiry) => (
            <tr key={enquiry.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-800">{enquiry.id}</td>
              <td className="px-6 py-4 text-gray-800">{enquiry.customerName}</td>
              <td className="px-6 py-4 text-gray-800">{enquiry.projectVehicleProgram}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {enquiry.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleViewDetails(enquiry)}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnquiryTable;