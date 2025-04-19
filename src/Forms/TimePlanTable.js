import React from 'react';
import { useNavigate } from 'react-router-dom';

const TimePlanTable = () => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/apqptimeplan'); // ✅ Goes to ActivityTable.js route
  };

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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ENQ12345</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">On Track</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <button
                  onClick={handleView}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimePlanTable;
