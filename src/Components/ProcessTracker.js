// src/components/ProcessTracker.js
import React, { useState } from "react";
import { Upload, X } from "lucide-react";

const ProcessTracker = ({ isOpen, onClose, currentStatus, onStatusUpdate, selectedEnquiry }) => {
  const [completedSubProcesses, setCompletedSubProcesses] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [activeTab, setActiveTab] = useState(1);

  const processes = {
    1: {
      name: "Plan and Define",
      subProcesses: {
        1: "Enquiry Received",
        2: "Sent to Toolmaker",
        3: "Decide Feasibility",
        4: "Prepare Quotation",
        5: "Take Confirmation (P.O.)",
        6: "Decide APQP Time Plan",
        7: "Get Tool Design",
      },
    },
    2: {
      name: "Product Design",
      subProcesses: {
        1: "Initial Design Review",
        2: "Design Feedback",
        3: "Design Approval",
      },
    },
    3: {
      name: "Process Design and Development",
      subProcesses: {
        1: "Prepare PFD, PFMEA and Control Plan",
        2: "Provide Training",
      },
    },
    4: {
      name: "Product and Process Validation",
      subProcesses: {
        1: "Inspect Mould as per Checksheet",
        2: "T0",
        3: "T1",
        4: "T2",
        5: "T3",
        6: "Tfinal",
      },
    },
    5: {
      name: "Feedback",
      subProcesses: {
        1: "CFT Meeting for review",
      },
    },
    6: {
      name: "APQP Review",
      subProcesses: {
        1: "Review APQP time plan",
      },
    },
  };

  const handleFileUpload = (processId, subProcessId, event) => {
    const file = event.target.files[0];
    if (file) {
      setFileUploads((prev) => ({ ...prev, [`${processId}-${subProcessId}`]: file.name }));
      handleSubProcessComplete(processId, subProcessId);
    }
  };

  const handleSubProcessComplete = (processId, subProcessId) => {
    setCompletedSubProcesses((prev) => ({ ...prev, [`${processId}-${subProcessId}`]: true }));

    const allSubProcessesCompleted = Object.keys(processes[processId].subProcesses).every(
      (subId) => completedSubProcesses[`${processId}-${subId}`] || subId == subProcessId
    );

    if (allSubProcessesCompleted) {
      onStatusUpdate(`${processes[processId].name} Completed`);
    }
  };

  const handleCheckboxChange = (processId, subProcessId) => {
    setCompletedSubProcesses((prev) => ({ ...prev, [`${processId}-${subProcessId}`]: !prev[`${processId}-${subProcessId}`] }));
    handleSubProcessComplete(processId, subProcessId);
  };

  return (
    <div className={`w-[500px] bg-white shadow-lg rounded-lg transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"} max-h-[80vh] overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Process Tracker</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <div className="overflow-x-auto mb-4">
          <div className="flex space-x-2">
            {Object.entries(processes).map(([processId, process]) => (
              <button
                key={processId}
                className={`px-4 py-2 text-sm font-semibold ${activeTab === Number(processId) ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab(Number(processId))}
              >
                {process.name}
              </button>
            ))}
          </div>
        </div>

        {activeTab && (
          <div className="overflow-x-auto">
            {Object.entries(processes[activeTab].subProcesses).map(([subId, subName]) => (
              <div key={subId} className="p-4 bg-gray-50 rounded-lg mb-3 flex justify-between items-center hover:bg-gray-100 transition-colors">
                <div className="flex-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={completedSubProcesses[`${activeTab}-${subId}`] || false}
                    onChange={() => handleCheckboxChange(activeTab, subId)}
                    className="mr-2"
                  />
                  <p className="font-medium text-gray-800">{`${subId}. ${subName}`}</p>
                  {fileUploads[`${activeTab}-${subId}`] && (
                    <p className="text-sm text-gray-500 mt-1 ml-2">
                      Uploaded: {fileUploads[`${activeTab}-${subId}`]}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer flex items-center px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100">
                    <Upload size={16} className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500">Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(activeTab, subId, e)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTracker;