import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Trash2, FileSpreadsheet, Download, Upload, ChevronDown
} from "lucide-react";
import { phaseSubactivities } from "./subactivities";
import { useGetNpdEnquiryRegisterQuery } from "../features/api/apiSlice";
import { useGetEnquiriesByIdQuery } from "../features/api/apiSliceenquiry"; // make sure this path is correct

export default function APQPTimePlan() {
  const location = useLocation();
  const enquiryId = location.state?.enquiryId || null;
  const shouldFetch = !!enquiryId;

  const [formData, setFormData] = useState({
    partName: "",
    partNo: "",
    customer: "",
    customerPODate: "",
    pswApprovalDate: "",
    handoverDate: ""
  });

  useEffect(() => {
    console.log("Navigation state:", location.state);
  }, [location.state]);

  const {
    data: masterDetails = [],
    isLoading: isMasterLoading,
  } = useGetEnquiriesByIdQuery(
    { pAction: 1, pLookUpId: enquiryId },
    { skip: !shouldFetch }
  );

  const {
    data: allEnquiries = [],
    isLoading: isEnquiriesLoading,
  } = useGetNpdEnquiryRegisterQuery();

  const displayEnquiryRegisterId = allEnquiries.find(
    (e) => e.PkEnquiryMasterId === enquiryId
  )?.EnquiryRegisterNo || "";

  useEffect(() => {
    if (!isMasterLoading && Array.isArray(masterDetails) && masterDetails.length > 0) {
      const data = masterDetails[0];
      setFormData((prev) => ({
        ...prev,
        partNo: data.PartCode || "",
        partName: data.PartName,
        customer: data.CustomerName || "",
        customerPODate: data.CustomerPODate || "",
        pswApprovalDate: data.PSWApprovalDate || "",
        handoverDate: data.HandoverDate || ""
      }));
    }
  }, [isMasterLoading, masterDetails]);

  const columns = [
    "Activity", "Responsibility", "Planned Start", "Actual Start",
    "Planned Finish", "Actual Finish", "Status",
    "Actions Required", "Target Dates", "Status with Remarks"
  ];

  const responsibilityOptions = ["UAT", "CFT", "YNS", "MND"];
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null && !event.target.closest(`#dropdown-${dropdownOpen}`)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const mainActivityPhases = Object.keys(phaseSubactivities);

  const addSubactivityRows = (phase) => {
    const newRows = phaseSubactivities[phase].map((label) => ({
      id: crypto.randomUUID(),
      Activity: label,
      Responsibility: [],
      "Planned Start": "",
      "Actual Start": "",
      "Planned Finish": "",
      "Actual Finish": "",
      Status: "",
      "Actions Required": "",
      "Target Dates": "",
      "Status with Remarks": ""
    }));
    setRows(newRows);
  };

  const handlePhaseSelect = (e) => {
    const selected = e.target.value;
    if (selected) addSubactivityRows(selected);
  };

  const updateRow = (id, column, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [column]: value } : row)));
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    const headers = ["Sr No", ...columns];
    const metaInfo = [
      [`Enquiry Register ID: ${displayEnquiryRegisterId}`],
      ["STPPL / MKD / FM / 03"],
      ["Rev. No.: 04"],
      ["Rev. Date: 01.09.2019"],
      ["Page: 01 of 02"],
      [],
      headers
    ];
    const rowData = filteredRows.map((row, index) => [
      index + 1,
      ...columns.map((col) => Array.isArray(row[col]) ? row[col].join(" / ") : row[col])
    ]);
    const csvContent = [
      ...metaInfo.map(row => row.join(",")),
      ...rowData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apqp-time-plan.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (rows.length === 0) return alert("No data to save. Please add subactivities.");
    try {
      const response = await fetch("http://localhost:5000/api/save-apqp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, rows })
      });
      alert(response.ok ? "Data saved successfully!" : "Failed to save data.");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving.");
    }
  };

  const getColumnWidth = (column) => {
    return ["Activity", "Responsibility", "Actions Required", "Status with Remarks"].includes(column)
      ? "min-w-[300px]"
      : "min-w-[150px]";
  };

  return (
    <div className="w-[1400px] mx-auto p-6 bg-white shadow-xl rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">APQP TIME PLAN CHART</h1>
              <p className="text-base text-black mt-3">
                Enquiry Register ID:{" "}
                <span className="font-semibold">
                  {isEnquiriesLoading ? "Loading..." : displayEnquiryRegisterId}
                </span>
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <div>STPPL / MKD / FM / 03</div>
            <div>Rev. No.: 04</div>
            <div>Rev. Date: 01.09.2019</div>
            <div>Page: 01 of 02</div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            {[{ label: "Part Name", key: "partName" },
              { label: "Part No", key: "partNo" },
              { label: "Customer", key: "customer" }].map(({ label, key }, idx) => (
              <div key={idx}>
                <label className="block font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="block w-full px-4 py-3 border rounded-md"
                />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[{ label: "Customer PO Date", key: "customerPODate" },
              { label: "PSW Approval Date", key: "pswApprovalDate" },
              { label: "Handover Date", key: "handoverDate" }].map(({ label, key }, idx) => (
              <div key={idx}>
                <label className="block font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="date"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="block w-full px-4 py-3 border rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-8">
          {[{ color: "green-500", text: "G - Timing and actions are on time" },
            { color: "yellow-500", text: "Y - Slightly behind" },
            { color: "red-500", text: "R - Project is behind" }].map(({ color, text }, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-${color}`}></div>
              <span className="text-base">{text}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-3 w-80 border rounded-l-lg"
            />
            <button className="px-6 py-3 bg-blue-500 text-white rounded-r-lg">Search</button>
          </div>
          <div className="flex gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg">
              <Upload className="w-5 h-5" /> Export
            </button>
            <label className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-pointer">
              <Download className="w-5 h-5" /> Import
              <input type="file" className="hidden" accept=".csv" />
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4">Sr No</th>
              {columns.map((column, index) => (
                <th key={index} className={`px-6 py-4 ${getColumnWidth(column)}`}>
                  {column === "Activity" ? (
                    <select
                      onChange={handlePhaseSelect}
                      defaultValue=""
                      className="w-full px-4 py-2 border rounded"
                    >
                      <option value="">Select Activity Phase</option>
                      {mainActivityPhases.map((phase, idx) => (
                        <option key={idx} value={phase}>
                          {phase}
                        </option>
                      ))}
                    </select>
                  ) : (
                    column
                  )}
                </th>
              ))}
              {/* <th className="px-6 py-4">Action</th> */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{rowIndex + 1}</td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${getColumnWidth(column)}`}>
                    {column === "Activity" ? (
                      <span className="block px-2 py-1 text-gray-700 bg-gray-100 rounded">
                        {row[column]}
                      </span>
                    ) : column === "Responsibility" ? (
                      <div id={`dropdown-${row.id}`} className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === row.id ? null : row.id)}
                          className="w-full flex justify-between items-center px-3 py-2 border rounded bg-white"
                        >
                          <span>
                            {row[column].length > 0
                              ? row[column].join(" / ")
                              : "Select Responsibility"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        {dropdownOpen === row.id && (
                          <div className="absolute mt-2 bg-white border shadow rounded z-10 w-full">
                            {responsibilityOptions.map((option) => (
                              <label key={option} className="block px-3 py-2 hover:bg-gray-100 text-sm">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={row[column].includes(option)}
                                  onChange={() => {
                                    const isSelected = row[column].includes(option);
                                    const updatedSelection = isSelected
                                      ? row[column].filter((item) => item !== option)
                                      : [...row[column], option];
                                    updateRow(row.id, column, updatedSelection);
                                  }}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : column === "Status" ? (
                      <select
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                      >
                        <option value="">Select</option>
                        <option value="G">G</option>
                        <option value="Y">Y</option>
                        <option value="R">R</option>
                      </select>
                    ) : column.includes("Start") || column.includes("Finish") || column === "Target Dates" ? (
                      <input
                        type="date"
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                      />
                    )}
                  </td>
                ))}
                {/* <td className="px-6 py-4">
                  <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-base text-gray-500">
          Showing {filteredRows.length} of {rows.length} entries
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
