import React, { useState } from "react";

const EnquiryTable = ({ enquiries }) => {
  const [showFiles, setShowFiles] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2"> Enquiry List</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-500 text-white text-sm uppercase sticky top-0">
            <tr>
              {["Sr. No.", "Customer Name", "Project/Vehicle", "Part Code", "Part Name", "Raw Material", "SOP",
                "Annual Volume", "Enquiry Date", "Part Colour", "Date Quoted", "Status","Customer P.O Date", "Part Cost",
                "Tool Cost", "Annual Potential", "P.O no.", "Design Files", "Actions"].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry, index) => (
                <tr key={index} className="border-b transition duration-200 hover:bg-gray-100">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{enquiry.customerName}</td>
                  <td className="px-6 py-4">{enquiry.projectVehicleProgram}</td>
                  <td className="px-6 py-4">{enquiry.partCode}</td>
                  <td className="px-6 py-4">{enquiry.partName}</td>
                  <td className="px-6 py-4">{enquiry.rawMaterial}</td>
                  <td className="px-6 py-4">{new Date(enquiry.sop).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{enquiry.estimatedAnnualVolume}</td>
                  <td className="px-6 py-4">{new Date(enquiry.enquiryReceivedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{enquiry.partColour}</td>
                  <td className="px-6 py-4">{enquiry.dateQuoted ? new Date(enquiry.dateQuoted).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4">{enquiry.status}</td>
                  <td className="px-6 py-4">{enquiry.customerPODate ? new Date(enquiry.customerPODate).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4">₹{enquiry.partCostEstimate}</td>
                  <td className="px-6 py-4">₹{enquiry.toolCostEstimate}</td>
                  <td className="px-6 py-4">{enquiry.annualBusinessPotential} Lac</td>
                  <td className="px-6 py-4">{enquiry.poNo || "-"}</td>
                  
                  <td className="px-6 py-4">
                    {enquiry.designFiles && enquiry.designFiles.length > 0 ? (
                      <div className="flex items-center space-x-3">
                        <span>{enquiry.designFiles.length} file(s) uploaded</span>
                        <button
                          onClick={() => setShowFiles(enquiry.designFiles)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View Files
                        </button>
                      </div>
                    ) : (
                      "No files uploaded"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {/* You can add any action buttons here if needed */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No enquiries found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* File Modal */}
      {showFiles && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
            <ul className="space-y-2">
              {showFiles.map((fileObj, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                  <span>{fileObj.file.name}</span>
                  <a href={fileObj.url} download className="text-blue-500">Download</a>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowFiles(null)} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryTable;