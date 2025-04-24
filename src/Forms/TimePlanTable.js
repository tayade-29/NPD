import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNpdEnquiryRegisterQuery } from '../features/api/apiSlice'; // ✅ Update the path as needed

const TimePlanTable = () => {
  const navigate = useNavigate();

  const { data = [], isLoading, isError } = useGetNpdEnquiryRegisterQuery();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">APQP Time Plan Table</h2>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry Register Id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : isError ? (
              <tr><td colSpan="4" className="text-center p-4 text-red-600">Error loading enquiries</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-4">No Enquiries Found</td></tr>
            ) : (
              data.map((enquiry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.EnquiryRegisterNo || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{enquiry.Status || 'Active'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <button
                      onClick={() => navigate('/apqptimeplan', { state: { enquiryId: enquiry.PkEnquiryMasterId } })}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimePlanTable;
