import React, { useState } from "react";
import { Plus, Trash2, FileSpreadsheet, Download, Upload } from "lucide-react";

export default function FeasibilityReview() {
    const [formData, setFormData] = useState({
        customer: "",
        partNo: "",
        date: "",
    });

    const columns = [
        "Check Points",
        "Details",
        "Comment / Action Required",
        "Person Responsible",
        "Target Date",
    ];

    const [rows, setRows] = useState([{
        id: "1",
        "Check Points": "",
        "Details": "",
        "Comment / Action Required": "",
        "Person Responsible": "",
        "Target Date": "",
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
        a.download = "feasibility-review.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getColumnWidth = (column) => {
        return "min-w-[200px]";  // Adjust as necessary
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-xl rounded-xl max-w-[1200px]">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Feasibility Review</h1>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div>STPPL / MKD / FM / 02</div>
                        <div>Rev. No.: 06</div>
                        <div>Rev. Date: 20.11.2021</div>
                    </div>
                </div>

                {/* Form Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Customer</label>
                            <input
                                type="text"
                                value={formData.customer}
                                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Part No</label>
                            <input
                                type="text"
                                value={formData.partNo}
                                onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="block w-full px-4 py-3 text-base border rounded-md shadow-sm" />
                        </div>
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
                                className="pl-12 pr-4 py-3 w-80 text-base border rounded-l-lg" />
                        </div>
                        <button
                            className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-400 text-base">
                            Search
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-700 text-base">
                            <Upload className="w-5 h-5" /> Export
                        </button>
                        <label className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-700 cursor-pointer text-base">
                            <Download className="w-5 h-5" /> Import
                            <input type="file" className="hidden" accept=".csv" />
                        </label>
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-700 text-base">
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
                                        {column === "Target Date" ? (
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
                                        title="Delete Row">
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