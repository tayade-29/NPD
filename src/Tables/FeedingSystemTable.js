import React from 'react';

const FeedingSystemTable = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feeding System</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Rows will go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedingSystemTable;
