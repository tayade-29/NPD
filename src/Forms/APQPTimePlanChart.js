import React, { useState } from "react";
import { Plus, Trash2, FileSpreadsheet, Download, Upload } from "lucide-react";

export default function APQPTimePlan() {
  const [formData, setFormData] = useState({
    partName: "",
    partNo: "",
    customer: "",
    customerPODate: "",
    pswApprovalDate: "",
    handoverDate: "",
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

  const [rows, setRows] = useState([{
    id: "1",
    Activity: "",
    Responsibility: "",
    "Planned Start": "",
    "Actual Start": "",
    "Planned Finish": "",
    "Actual Finish": "",
    Status: "",
    "Actions Required": "",
    "Target Dates": "",
    "Status with Remarks": ""
  }]);

  const [searchTerm, setSearchTerm] = useState("");

  const addRow = () => {
    const newRow = {
      id: (rows.length + 1).toString(),
      ...Object.fromEntries(columns.map(col => [col, ""]))
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id, column, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [column]: value } : row)));
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    const headers = ["Sr No", ...columns];
    const csvContent = [
      headers.join(","),
      ...filteredRows.map((row, index) => [
        index + 1,
        ...columns.map(col => row[col])
      ].join(","))
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
    if (column === "Activity" || column === "Responsibility" || column === "Actions Required" || column === "Status with Remarks") {
      return "min-w-[300px]";
    }
    return "min-w-[150px]";
  };

  return (
    <div className="w-[1200px] mx-auto p-6 bg-white shadow-xl rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">APQP TIME PLAN CHART</h1>
          </div>
          <div className="text-sm text-gray-600">
            <div>STPPL / MKD / FM / 03</div>
            <div>Rev. No.: 04</div>
            <div>Rev. Date: 01.09.2019</div>
            <div>Page: 01 of 02</div>
          </div>
        </div>

        {/* Form Header */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Part Name</label>
              <input
                type="text"
                value={formData.partName}
                onChange={(e) => setFormData({...formData, partName: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Part No</label>
              <input
                type="text"
                value={formData.partNo}
                onChange={(e) => setFormData({...formData, partNo: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Customer</label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({...formData, customer: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Customer PO Date</label>
              <input
                type="date"
                value={formData.customerPODate}
                onChange={(e) => setFormData({...formData, customerPODate: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">PSW Approval Date</label>
              <input
                type="date"
                value={formData.pswApprovalDate}
                onChange={(e) => setFormData({...formData, pswApprovalDate: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Handover Date</label>
              <input
                type="date"
                value={formData.handoverDate}
                onChange={(e) => setFormData({...formData, handoverDate: e.target.value})}
                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500"></div>
            <span className="text-base">G - Timing and actions are on time</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500"></div>
            <span className="text-base">Y - Timing and actions are slightly behind</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500"></div>
            <span className="text-base">R - Project timing and actions are behind</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-80 text-base border rounded-l-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-400 text-base"
            >
              Search
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-700 text-base"
            >
              <Download className="w-5 h-5" /> Export
            </button>
            <label className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-700 cursor-pointer text-base">
              <Upload className="w-5 h-5" /> Import
              <input type="file" className="hidden" accept=".csv" />
            </label>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-700 text-base"
            >
              <Plus className="w-5 h-5" /> Add Row
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 border-b min-w-[80px]">Sr No</th>
              {columns.map((column, index) => (
                <th key={index} className={`px-6 py-4 text-left text-base font-semibold text-gray-600 border-b ${getColumnWidth(column)}`}>
                  {column}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 border-b min-w-[80px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-base text-gray-600">{rowIndex + 1}</td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${getColumnWidth(column)}`}>
                    {column === "Status" ? (
                      <select
                        className="w-full px-4 py-2 text-base border rounded focus:ring-2 focus:ring-blue-500"
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="G">G</option>
                        <option value="Y">Y</option>
                        <option value="R">R</option>
                      </select>
                    ) : column.includes("Start") || column.includes("Finish") || column === "Target Dates" ? (
                      <input
                        type="date"
                        className="w-full px-4 py-2 text-base border rounded focus:ring-2 focus:ring-blue-500"
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full px-4 py-2 text-base border rounded focus:ring-2 focus:ring-blue-500"
                        value={row[column]}
                        onChange={(e) => updateRow(row.id, column, e.target.value)}
                      />
                    )}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Row"
                  >
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