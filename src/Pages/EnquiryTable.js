import React from "react";
import { FileText } from "lucide-react";

const EnquiryTable = ({ enquiries, onActionClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 text-sm  sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Enquiry ID</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Project</th>
              <th className="px-4 py-3 text-left font-semibold">Part Code</th>
              <th className="px-4 py-3 text-left font-semibold">Part Name</th>
              <th className="px-4 py-3 text-left font-semibold">Raw Material</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry, index) => (
                <tr key={index} className="border-b transition duration-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{enquiry.id}</td>
                  <td className="px-4 py-3 text-gray-800">{enquiry.customerName}</td>
                  <td className="px-4 py-3 text-gray-800">{enquiry.projectVehicleProgram}</td>
                  <td className="px-4 py-3 text-gray-800">{enquiry.partCode}</td>
                  <td className="px-4 py-3 text-gray-800">{enquiry.partName}</td>
                  <td className="px-4 py-3 text-gray-800">{enquiry.rawMaterial}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      enquiry.status === 'Under Review' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : enquiry.status === 'PO Received' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {enquiry.status}
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No enquiries found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryTable;