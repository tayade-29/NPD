import React, { useState } from "react";
import { Plus, Trash2, FileSpreadsheet, Download, Upload } from "lucide-react";
import { phaseSubactivities } from "./subactivities";

export default function APQPTimePlan() {
  const [formData, setFormData] = useState({
    partName: "",
    partNo: "",
    customer: "",
    customerPODate: "",
    pswApprovalDate: "",
    handoverDate: ""
  });

  const columns = [
    "Activity",
    "Responsibility",
    "Planned Start",
    "Actual Start",
    "Planned Finish",
    "Actual Finish",
    "Status",
    "Actions Required",
    "Target Dates",
    "Status with Remarks"
  ];

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const mainActivityPhases = Object.keys(phaseSubactivities);

  const addSubactivityRows = (phase) => {
    const timestamp = Date.now();
    const newRows = phaseSubactivities[phase].map((label, idx) => ({
      id: `${phase}-${idx + 1}-${timestamp}`,
      Activity: label,
      Responsibility: "",
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
    if (selected) {
      addSubactivityRows(selected);
    }
  };

  const removeRow = (id) => setRows(rows.filter((row) => row.id !== id));

  const updateRow = (id, column, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [column]: value } : row)));
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    const headers = ["Sr No", ...columns];
    const csvContent = [
      headers.join(","),
      ...filteredRows.map((row, index) =>
        [index + 1, ...columns.map((col) => row[col])].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apqp-time-plan.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getColumnWidth = (column) => {
    if (["Activity", "Responsibility", "Actions Required", "Status with Remarks"].includes(column)) {
      return "min-w-[300px]";
    }
    return "min-w-[150px]";
  };

  return (
    <div className="w-[1400px] mx-auto p-6 bg-white shadow-xl rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">APQP TIME PLAN CHART</h1>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <div>STPPL / MKD / FM / 03</div>
            <div>Rev. No.: 04</div>
            <div>Rev. Date: 01.09.2019</div>
            <div>Page: 01 of 02</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            {["Part Name", "Part No", "Customer"].map((label, idx) => (
              <div key={idx}>
                <label className="block font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="text"
                  value={formData[label.replace(" ", "").toLowerCase()]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [label.replace(" ", "").toLowerCase()]: e.target.value
                    })
                  }
                  className="block w-full px-4 py-3 border rounded-md"
                />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {["Customer PO Date", "PSW Approval Date", "Handover Date"].map((label, idx) => (
              <div key={idx}>
                <label className="block font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="date"
                  value={formData[label.replace(/\s+/g, "").toLowerCase()]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [label.replace(/\s+/g, "").toLowerCase()]: e.target.value
                    })
                  }
                  className="block w-full px-4 py-3 border rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 mb-8">
          {["green-500", "yellow-500", "red-500"].map((color, i) => (
            <div className="flex items-center gap-3" key={i}>
              <div className={`w-8 h-8 bg-${color}`}></div>
              <span className="text-base">
                {i === 0
                  ? "G - Timing and actions are on time"
                  : i === 1
                  ? "Y - Slightly behind"
                  : "R - Project is behind"}
              </span>
            </div>
          ))}
        </div>

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
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg"
            >
              <Upload className="w-5 h-5" /> Export
            </button>
            <label className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-pointer">
              <Download className="w-5 h-5" /> Import
              <input type="file" className="hidden" accept=".csv" />
            </label>
          </div>
        </div>
      </div>

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
              <th className="px-6 py-4">Action</th>
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
                <td className="px-6 py-4">
                  <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-base text-gray-500">
        Showing {filteredRows.length} of {rows.length} entries
      </div>
    </div>
  );
}
