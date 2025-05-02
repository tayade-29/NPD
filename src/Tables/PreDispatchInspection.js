import React from 'react';

const PreDispatchInspection = () => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Pre-Dispatch Inspection Report</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                'Sr. No.', 'Parameter', 'Specification', 'Checking Instrument/L.C.',
                'Observation 1', 'Observation 2', 'Observation 3',
                'Observation 4', 'Observation 5', 'Remarks'
              ].map((heading, index) => (
                <th key={index} className="px-4 py-3 text-left font-semibold border border-gray-200">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {Array(10).fill('').map((_, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-200 px-4 py-2">
                    {cellIndex === 0 ? (
                      <div className="bg-gray-100 px-2 py-1 rounded text-center font-medium text-gray-700 w-8">
                        {rowIndex + 1}
                      </div>
                    ) : cellIndex >= 4 && cellIndex <= 8 ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder=""
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder=""
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreDispatchInspection;
