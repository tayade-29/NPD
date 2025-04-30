import React, { useEffect, useState } from "react";
import {
  useGetEnquiriesByIdQuery,
  useGetCheckpointsForFeasibilityQuery,
  useGetSubCheckpointForFeasibilityQuery,
  useGetResponsiblePersonQuery,
  useSetFeasibilityReviewMutation
} from "../features/api/apiSliceenquiry";
import { useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


const FeasibilityReview = () => {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({ customer: "", partNo: "", date: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [checkpointOptions, setCheckpointOptions] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const location = useLocation();
  const enquiryId = location.state?.enquiryId || 0;
  console.log("Enquiry ID:", enquiryId);



  // const { data: enquiryData } = useGetEnquiriesByIdQuery({ pAction: 0, pLookUpId:enquiryId });
  const { data: checkpointData } = useGetCheckpointsForFeasibilityQuery();
  const { data: fetchedSubCheckpoints } = useGetSubCheckpointForFeasibilityQuery(
    { checkpointId: selectedCheckpoint },
    { skip: !selectedCheckpoint }
  );

  useEffect(() => {
    if (checkpointData) {
      setCheckpointOptions(checkpointData);
    }
  }, [checkpointData]);

  const { data: enquiryData } = useGetEnquiriesByIdQuery({ pAction: 0, pLookUpId: enquiryId });

  useEffect(() => {
    console.log('Enquiry Data Response:', enquiryData);
    if (enquiryData && enquiryData.length > 0) {
      const matchedEnquiry = enquiryData.find(item => item.PkEnquiryMasterId === enquiryId);
      if (matchedEnquiry) {
        setFormData({
          customer: matchedEnquiry.CustomerName || "",
          partNo: matchedEnquiry.PartCode || "",
          date: matchedEnquiry.EnquiryDate?.slice(0, 10) || "",
        });
      }
    }
  }, [enquiryData, enquiryId]);


  useEffect(() => {
    if (fetchedSubCheckpoints && fetchedSubCheckpoints.length > 0) {
      const newRows = fetchedSubCheckpoints.map((subCheckpoint, index) => ({
        id: (index + 1).toString(),
        subCheckpointId: subCheckpoint.DataValueField || 0, // store ID here
        checkpoint: subCheckpoint.DataTextField || "",
        comment: "",
        person: "",
        targetDate: "",
        responsiblePersonId: "", // you missed this also
      }));
      
      setRows(newRows);
    } else {
      setRows([]); // Clear rows if no sub-checkpoints
    }
  }, [fetchedSubCheckpoints, selectedCheckpoint]);

  const handleCheckpointChange = (e) => {
    const checkpointId = e.target.value;
    setSelectedCheckpoint(checkpointId);
  };

  const updateRow = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };


  const [responsiblePersons, setResponsiblePersons] = useState([]);
  const [feasibilityRows, setFeasibilityRows] = useState([]);


  const { data: responsibleData } = useGetResponsiblePersonQuery({
    clientId: userData?.clientId,
    plantId: userData?.plantId,
    locationId: userData?.locationId
  });
  useEffect(() => {
    if (responsibleData) {
      setResponsiblePersons(responsibleData);
    }
  }, [responsibleData]);
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...feasibilityRows];
    const updateRow = (id, field, value) => {
      setRows(prevRows =>
        prevRows.map(row => {
          if (row.id !== id) return row;

          // If changing the responsible person, also set name
          if (field === "responsiblePersonId") {
            const selected = responsiblePersons.find(p => p.DataValueField === parseInt(value));
            return {
              ...row,
              responsiblePersonId: value,
              responsiblePersonName: selected?.DataTextField || ""
            };
          }

          return { ...row, [field]: value };
        })
      );
    };

    if (field === "responsiblePersonId") {
      const selected = responsiblePersons.find(p => p.DataValueField === parseInt(value));
      updatedRows[index]["responsiblePersonName"] = selected?.DataTextField || '';
    }
    updatedRows[index][field] = value;
    setFeasibilityRows(updatedRows);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const [setFeasibilityReview] = useSetFeasibilityReviewMutation();
  const handleSave = async () => {
    try {
      const payload = rows.map(row => ({
        pPkNPDEnquiryFeasibilityReviewId: 0,
        pFkEnquiryMasterId: enquiryId,
        pFkNPDCheckPointTypeId: selectedCheckpoint, // This is DataValueField of selected checkpoint
        pFkNPDCheckPointTypeDetailId: row.subCheckpointId || 0, // We'll fix this below
        pFkResponsiblePersonId: row.responsiblePersonId || 0,
        pReviewDescription: row.checkpoint || "", // Checkpoint Name
        pCommentActionRequired: row.comment || "",
        pTargetDate: row.targetDate || "",
        pCreatedBy: userData?.roleId || 0
      }));
  
      for (const review of payload) {
        await setFeasibilityReview(review);
      }
  
      alert('Feasibility Reviews saved successfully!');
    } catch (error) {
      console.error('Error saving feasibility review:', error);
      alert('Failed to save feasibility reviews.');
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-white shadow-xl rounded-xl max-w-[1300px]">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Feasibility Review</h1>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-semibold">{formData.customer || "Not specified"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Part Number</p>
            <p className="font-semibold">{formData.partNo || "Not specified"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">
              {formData.date
                ? new Date(formData.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Centered Search
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-10 px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

         {/* Checkpoint Selection */}
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">Checkpoint Type</label>
      <select
        value={selectedCheckpoint}
        onChange={handleCheckpointChange}
        className="block w-full py-2.5 px-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Checkpoint Type</option>
        {checkpointOptions.map(option => (
          <option key={option.DataValueField} value={option.DataValueField}>
            {option.DataTextField}
          </option>
        ))}
      </select>
    </div>

    {/* Table Section */}
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-xs">
  <div className="max-h-[400px] overflow-y-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">Sr. No.</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkpoint</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Responsible</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Date</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.checkpoint}</td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={row.comment}
                  onChange={(e) => updateRow(row.id, "comment", e.target.value)}
                  placeholder="Enter comments..."
                />
              </td>
              <td className="px-4 py-3 text-center">
                <select
                  value={row.responsiblePersonId || ""}
                  onChange={(e) => updateRow(row.id, "responsiblePersonId", e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select responsible</option>
                  {responsibleData?.map(person => (
                    <option key={person.DataValueField} value={person.DataValueField}>
                      {person.DataTextField}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={row.targetDate}
                  onChange={(e) => updateRow(row.id, "targetDate", e.target.value)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
              No sub-checkpoints available. Please select a checkpoint type above.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


    {/* Save Button */}
    <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
      <button
        onClick={handleSave}
        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Save Review
      </button>
    </div>
    </div>
  );
};

export default FeasibilityReview;





