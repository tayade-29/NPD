import React, { useState, useEffect } from 'react';

const ChecksheetTable = ({ data, title, isLoading, error }) => {
  const [results, setResults] = useState({});
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    setResults({});
    setRemarks({});
  }, [data]);

  // Loading State
  if (isLoading) {
    return (
      <div className="py-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 bg-gray-100 rounded w-full mb-2"></div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="py-4 text-red-500">
        Error loading data. Please try again.
      </div>
    );
  }

  // No Data State
  if (!data || data.length === 0) {
    return (
      <div className="py-4 text-gray-500">
        No data available for {title}.
      </div>
    );
  }

  // Handle changes to result inputs
  const handleResultChange = (id, value) => {
    setResults((prev) => ({ ...prev, [id]: value }));
  };

  // Handle changes to remarks input
  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="py-4 animate-fade-in">
      <div className="relative">
        {/* Table Container with Fixed Header and Scrollable Rows */}
        <div className="overflow-y-auto max-h-[450px] mb-3">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-16"
                >
                  Sr. No.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {title}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32"
                >
                  Result
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={item.DataValueField}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.DataTextField}
                    <input type="hidden" value={item.DataValueField} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      aria-label="Select result"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={results[item.DataValueField] || ''}
                      onChange={(e) =>
                        handleResultChange(item.DataValueField, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="OK">OK</option>
                      <option value="NOT OK">NOT OK</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter remark"
                      value={remarks[item.DataValueField] || ''}
                      onChange={(e) =>
                        handleRemarkChange(item.DataValueField, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button under the table, aligned to the left */}
        <div className="flex justify-end mt-1 ">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecksheetTable;
