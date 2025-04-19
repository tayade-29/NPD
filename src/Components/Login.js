import React from "react";

const TimePlanTable = () => {
  const data = [
    { id: "ENQ001", status: "In Progress" },
    { id: "ENQ002", status: "Completed" },
    { id: "ENQ003", status: "Pending" },
  ];

  return (
    <div className="p-6">
      {/* Heading and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1D2939]">APQP Time Plan</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
          + Add Activity
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-4">Sr No.</th>
              <th className="text-left px-6 py-4">Enquiry Register ID</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 border-t border-gray-100"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{row.id}</td>
                <td className="px-6 py-4">{row.status}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-400 py-6 text-sm"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimePlanTable;
