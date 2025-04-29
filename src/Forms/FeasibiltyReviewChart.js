import React, { useEffect, useState } from "react";
import {
  useGetEnquiriesByIdQuery,
  useGetCheckpointsForFeasibilityQuery,
  useGetSubCheckpointForFeasibilityQuery,
  useGetResponsiblePersonQuery
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
        checkpoint: subCheckpoint.DataTextField || "",
        comment: "",
        person: "",
        targetDate: "",
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

      {/* Table */}
      <div className="relative">
        <div className="overflow-y-auto max-h-[400px] border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 shadow text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Sr No</th>

                {/* Checkpoints Header with Dropdown */}
                <th className="px-4 py-3 border">
                  <div className="flex flex-col items-center">

                    <select
                      value={selectedCheckpoint}
                      onChange={handleCheckpointChange}
                      className="mt-2 w-48 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Check Point</option>
                      {checkpointOptions.map((option) => (
                        <option key={option.DataValueField} value={option.DataValueField}>
                          {option.DataTextField}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>

                <th className="px-4 py-3 border">Comment / Action Required</th>
                <th className="px-4 py-3 border">Person Responsible</th>
                <th className="px-4 py-3 border">Target Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{row.checkpoint}</td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                        value={row.comment}
                        onChange={(e) => updateRow(row.id, "comment", e.target.value)}
                      />
                    </td>
                    <select
                      value={row.responsiblePersonId || ""}
                      onChange={(e) => updateRow(row.id, "responsiblePersonId", e.target.value)}
                      className="w-full border rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      {responsiblePersons.map(person => (
                        <option key={person.DataValueField} value={person.DataValueField}>
                          {person.DataTextField}
                        </option>
                      ))}
                    </select>


                    <td className="px-4 py-2 border">
                      <input
                        type="date"
                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                        value={row.targetDate}
                        onChange={(e) => updateRow(row.id, "targetDate", e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fixed Save Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeasibilityReview;
