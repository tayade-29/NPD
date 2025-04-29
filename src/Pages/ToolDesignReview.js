import React from 'react';

const ToolDesignReviewTable = () => {
  const data = [
    {
      srNo: 1,
      checkPoint: 'All the parts are numbered for easy assly of mould.',
      specification: 'Alphabets/Number (a,b,c.../1,2,3..)',
      observations: 'Yes',
      remark: '',
    },
    {
      srNo: 2,
      checkPoint: 'Tool LxWxH as per the m/c tonnage target.',
      specification: '--',
      observations: 'Yes',
      remark: '',
    },
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Tool Design Review</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2">Sr. No.</th>
                <th className="px-4 py-2">Check Points</th>
                <th className="px-4 py-2">Specification</th>
                <th className="px-4 py-2">Observations</th>
                <th className="px-4 py-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.srNo}</td>
                  <td className="px-4 py-2">{item.checkPoint}</td>
                  <td className="px-4 py-2">{item.specification}</td>
                  <td className="px-4 py-2">{item.observations}</td>
                  <td className="px-4 py-2">{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ToolDesignReviewTable;
