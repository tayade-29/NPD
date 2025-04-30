import React, { useEffect, useState } from 'react';
import {
  useToolDesignReviewQuery,
  useSubmitToolDesignReviewMutation
} from '../features/api/apiSliceChecklist';
import { useGetEnquiriesQuery } from '../features/api/apiSliceenquiry';
import { useAuth } from '../context/AuthContext';


const ToolDesignReviewTable = ({ queryParams }) => {
  const { userData } = useAuth();
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('');
  const { data: rawEnquiries = [] } = useGetEnquiriesQuery();
  const [submitToolDesignReview] = useSubmitToolDesignReviewMutation();
  const { data = [], isLoading, isError } = useToolDesignReviewQuery(queryParams);
  const [tableData, setTableData] = useState([]);

  // ✅ Parse the enquiry list if needed
  const enquiries =
    typeof rawEnquiries === 'string'
      ? JSON.parse(rawEnquiries)
      : rawEnquiries;

  // ✅ Handle dropdown change
  const handleEnquiryChange = (e) => {
    setSelectedEnquiryId(e.target.value);
  };

  useEffect(() => {
    if (data?.length) {
      const mapped = data
        .filter((item) => item.DataValueField !== -1)
        .map((item, index) => ({
          srNo: index + 1,
          checkPoint: item.DataTextField,
          sampleSpecification: item.Specification || '',
          specification: '',
          observations: '', // '0' = Yes, '1' = No, '2' = N/A
          remark: '',
          checkPointId: item.DataValueField
        }));
      setTableData(mapped);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    const updated = [...tableData];
    updated[index][field] = value;
    setTableData(updated);
  };

  const handleSubmit = async () => {
    if (!selectedEnquiryId) {
      alert('Please select an Enquiry before submitting.');
      return;
    }

    try {
      for (const row of tableData) {
        const payload = {
          pPkNPDToolDesignReviewCheckListId: 0,
          pFkEnquiryMasterId: Number(selectedEnquiryId),
          pFkNPDToolDesignCheckPointTypeDetailsId: Number(row.checkPointId),
          pSpecification: row.specification,
          pObservations: Number(row.observations),
          pRemark: row.remark,
          pCreatedBy: Number(userData?.roleId) // ✅ Replace with real user if needed
        };

        await submitToolDesignReview(payload).unwrap();
      }

      alert('Tool Design Review submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting the data.');
    }
  };

 

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Tool Design Review</h2>

        {/* ✅ Fixed Enquiry Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Select Project</label>
          <select
            value={selectedEnquiryId}
            onChange={handleEnquiryChange}
            className="border border-gray-300 rounded px-3 py-2 w-60"
          >
            <option value="">-- Select Project --</option>
            {enquiries.map((enquiry) => (
              <option key={enquiry.PkEnquiryMasterId} value={enquiry.PkEnquiryMasterId}>
                {enquiry.ProjectName}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Your Table Rendering */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl">
            <thead className="bg-gray-100 text-gray-800 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Sr. No.</th>
                <th className="px-4 py-3 text-left">Check Points</th>
                <th className="px-4 py-3 text-left">Sample Specification</th>
                <th className="px-4 py-3 text-left">Specification</th>
                <th className="px-4 py-3 text-left">Observations</th>
                <th className="px-4 py-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="bg-gray-100 px-2 py-1 rounded text-center">{item.srNo}</div>
                  </td>
                  <td className="px-2 py-3 w-80">{item.checkPoint}</td>
                  <td className="px-2 py-3 w-80">{item.sampleSpecification}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.specification}
                      onChange={(e) => handleChange(index, 'specification', e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {['Yes', 'No', 'N/A'].map((label, i) => (
                        <button
                          key={label}
                          onClick={() => handleChange(index, 'observations', i)} // storing integer
                          className={`px-3 py-1 rounded-full text-sm border transition ${item.observations === i
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.remark}
                      onChange={(e) => handleChange(index, 'remark', e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolDesignReviewTable;
