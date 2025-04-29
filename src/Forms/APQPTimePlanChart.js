import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Trash2, FileSpreadsheet, Download, Upload, ChevronDown, Calendar
} from "lucide-react";
// import { phaseSubactivities } from "./subactivities";
import { useGetNpdEnquiryRegisterQuery, useGetResponsibilitiesQuery } from "../features/api/apiSlice";
import { useGetEnquiriesByIdQuery } from "../features/api/apiSliceenquiry";
import { useSaveApqpTimePlanMutation } from "../features/api/apiSlice"; // import the mutation
import { useGetActivityPhasesQuery } from "../features/api/apiSlice";
import { useGetSubactivitiesQuery } from "../features/api/apiSlice";
import { useAuth } from '../context/AuthContext';

export default function APQPTimePlan() {
  const location = useLocation();
  const enquiryId = location.state?.enquiryId || null;
  const shouldFetch = !!enquiryId;
  const { userData } = useAuth();
  
  // const userData = JSON.parse(localStorage.getItem("userData"));
  const [saveApqpTimePlan] = useSaveApqpTimePlanMutation(); // initializes the mutation
  // const [subactivitiesMap, setSubactivitiesMap] = useState({});
  // const mainActivityPhases = Array.isArray(activityPhaseData?.Data)
  
  const [formData, setFormData] = useState({
    partName: "",
    partNo: "",
    customer: "",
    customerPODate: "",
    pswApprovalDate: "",
    handoverDate: ""
  });

  const {
    data: masterDetails = [],
    isLoading: isMasterLoading,
  } = useGetEnquiriesByIdQuery(
    { pAction: 1, pLookUpId: enquiryId },
    { skip: !shouldFetch }
  );

  const {
    data: activityPhaseData = [],
    isLoading: isActivityPhaseLoading
  } = useGetActivityPhasesQuery({
    clientId: userData?.clientId || 1,
    plantId: userData?.plantId || 1,
    locationId: userData?.locationId || 1
  });
  
  const {
    data: allEnquiries = [],
    isLoading: isEnquiriesLoading,
  } = useGetNpdEnquiryRegisterQuery();

  const {
    data: responsibilityList = [],
    isLoading: isResponsibilitiesLoading,
  } = useGetResponsibilitiesQuery({
    clientId: userData?.clientId || 1,
    plantId: userData?.plantId || 1,
    locationId: userData?.locationId || 1,
  });

  const responsibilityOptions = responsibilityList
  .filter(item => parseInt(item.DataValueField) >= 1)
  .map(item => ({
    label: item.DataTextField,
    value: item.DataValueField
  }));

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

  const columns = ["Activity", "Responsibility", "Planned Start", "Planned Finish"];
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

  const mainActivityPhases = Array.isArray(activityPhaseData)
  ? activityPhaseData
      .filter(item => parseInt(item?.DataValueField) >= 1) // 👈 only include value >= 1
      .map(item => ({
        id: item.DataValueField,
        name: item.DataTextField
      }))
  : [];

  const addSubactivityRows = (phaseLabel, subacts, selectedId) => {
    const newRows = subacts.map((label) => ({
      id: crypto.randomUUID(),
      Phase: phaseLabel,
      PhaseId: selectedId,
      Activity: label,
      Responsibility: [],
      "Planned Start": "",
      "Planned Finish": ""
    }));
  
    setRows(newRows);
  };
  
  const handlePhaseSelect = async (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
  
    try {
      const response = await fetch("http://192.168.0.172:83/Service.asmx/prc_master_fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pAction: 6,
          pLookUpId: parseInt(selectedId),
          pLookUpType: 0,
          pSelectionType: 0,
          pClientId: userData?.clientId || 1,
          pPlantId: userData?.plantId || 1,
          pLocationId: userData?.locationId || 1,
        }),
      });
   
      const result = await response.json();
      const subactivityData = JSON.parse(result.d);
  
      // ✅ Filter subactivities with DataValueField >= 1
      const filteredSubactivities = subactivityData
        .filter(item => parseInt(item.DataValueField) >= 1)
        .map(item => ({
          label: item.DataTextField,
          value: item.DataValueField
        }));
  
      // ✅ Get the label (text) of selected phase
      const phaseLabel = mainActivityPhases.find(p => p.id === selectedId)?.name || "";
  
      // ✅ Generate new rows
      const newRows = filteredSubactivities.map((sub) => ({
        id: crypto.randomUUID(),
        Phase: phaseLabel,           // 👈 this is for display
        PhaseId: selectedId,         // ✅ use this in handleSave for pFKAPQPTypeId
        Activity: sub.label,
        ActivityId: sub.value,
        Responsibility: [],
        "Planned Start": "",
        "Planned Finish": ""
      }));
  
      setRows(newRows); // ✅ finally update table rows
    } catch (error) {
      console.error("Error fetching subactivities:", error);
    }
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
      const results = await Promise.all(
        rows.map(async (row) => {
          const payload = {
            pPkAPQPTimePlanId: 0,
            pFkEnquiryMasterId: enquiryId,
            pFkAPQPTypeId: Number(row.PhaseId),
            pFkAPQPMasterDetailId: Number(row.ActivityId),
            pFKResponsibilityEMPId: row.Responsibility.join(","),
            pStartPlanDate: row["Planned Start"],
            pEndPlanDate: row["Planned Finish"],
            pTargetDate: '',
            pCreatedBy: userData?.roleId
          };
  
          const result = await saveApqpTimePlan(payload);
  
          // ✅ Treat "null" (string) or object response as success
          if (result?.data === "null" || typeof result?.data === "object") {
            return result;
          }
  
          // ❌ Any other condition is a failure
          throw new Error("Failed to save row");
        })
      );
  
      // ✅ Final success message
      alert("APQP plan added successfully!");
  
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };
  
  
  const getColumnWidth = (column) => {
    return ["Activity", "Responsibility"].includes(column)
      ? "min-w-[300px]"
      : "min-w-[150px]";
  };
 
  
  
  return (
    <div className="w-[1500px] mx-auto p-6 bg-white shadow-xl rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Pending APQP TIME PLAN </h1>
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
            {/* Labels with values fetched from API */}
            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Part Name:</label>
              <span className="text-gray-800">{formData.partName || "N/A"}</span>
            </div>

            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Part No:</label>
              <span className="text-gray-800">{formData.partNo || "N/A"}</span>
            </div>

            <div className="flex items-center">
              <label className="w-40 font-semibold text-gray-700">Customer:</label>
              <span className="text-gray-800">{formData.customer || "N/A"}</span>
            </div>
          </div>

          {/* Editable Date Input Fields with Calendar Blocks - Horizontal Layout */}
          <div className="space-y-4">
            {/* Customer PO Date */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-700">Customer PO Date:</label>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={formData.customerPODate}
                  onChange={(e) => setFormData({ ...formData, customerPODate: e.target.value })}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* PSW Approval Date */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-700">PSW Approval Date:</label>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={formData.pswApprovalDate}
                  onChange={(e) => setFormData({ ...formData, pswApprovalDate: e.target.value })}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Handover Date */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold text-gray-700">Handover Date:</label>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={formData.handoverDate}
                  onChange={(e) => setFormData({ ...formData, handoverDate: e.target.value })}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
  {[
    { bgColor: "bg-green-500", text: "G - Timing and actions are on time" },
    { bgColor: "bg-yellow-500", text: "Y - Slightly behind" },
    { bgColor: "bg-red-500", text: "R - Project is behind" }
  ].map(({ bgColor, text }, idx) => (
    <div key={idx} className="flex items-center gap-3">
      <div className={`w-5 h-5 ${bgColor}`}></div> {/* use prebuilt class */}
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
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 w-16">Sr No</th>
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
                          <option key={idx} value={phase.id}>
                            {phase.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredRows.map((row, rowIndex) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">{rowIndex + 1}</td>
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
                                ? responsibilityOptions
                                    .filter((opt) => row[column].includes(opt.value))
                                    .map((opt) => opt.label)
                                    .join(" / ")
                                : "Select Responsibility"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          </button>
                          {dropdownOpen === row.id && (
                            <div className="absolute mt-2 bg-white border shadow rounded z-10 w-full max-h-[200px] overflow-y-auto">
                              {responsibilityOptions.map((option) => (
                                <label key={option.value} className="block px-3 py-2 hover:bg-gray-100 text-sm">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={row[column].includes(option.value)}
                                    onChange={() => {
                                      const isSelected = row[column].includes(option.value);
                                      const updatedSelection = isSelected
                                        ? row[column].filter((id) => id !== option.value)
                                        : [...row[column], option.value];
                                      updateRow(row.id, column, updatedSelection);
                                    }}
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : column.includes("Start") || column.includes("Finish") ? (
                        <div className="relative flex items-center">
                          <input
                            type="date"
                            value={row[column]}
                            onChange={(e) => updateRow(row.id, column, e.target.value)}
                            className="w-full pl-4 pr-12 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <div className="absolute right-3 pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
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