import React, { useState } from "react";
import { Upload, X, Check, FileText } from "lucide-react";

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
    setCompletedSubProcesses((prev) => ({ 
      ...prev, 
      [`${processId}-${subProcessId}`]: !prev[`${processId}-${subProcessId}`] 
    }));
    handleSubProcessComplete(processId, subProcessId);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Process Tracker</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
       
      </div>

      <div className="border-b border-gray-200 bg-white overflow-x-auto">
        <div className="flex px-2">
          {Object.entries(processes).map(([processId, process]) => (
            <button
              key={processId}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === Number(processId)
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              } transition-colors focus:outline-none`}
              onClick={() => setActiveTab(Number(processId))}
            >
              {process.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab && (
          <div className="space-y-3">
            {Object.entries(processes[activeTab].subProcesses).map(([subId, subName]) => {
              const isCompleted = completedSubProcesses[`${activeTab}-${subId}`] || false;
              
              return (
                <div 
                  key={subId} 
                  className={`p-4 rounded-lg flex justify-between items-center transition-colors ${
                    isCompleted ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => handleCheckboxChange(activeTab, subId)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <div>
                      <p className={`font-medium ${isCompleted ? "text-green-700" : "text-gray-800"}`}>
                        {`${subId}. ${subName}`}
                      </p>
                      {fileUploads[`${activeTab}-${subId}`] && (
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FileText size={12} className="mr-1" />
                          {fileUploads[`${activeTab}-${subId}`]}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <label 
                    className={`cursor-pointer flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${
                      isCompleted 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    } transition-colors ml-4`}
                  >
                    <Upload size={14} className="mr-1.5" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(activeTab, subId, e)} 
                    />
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProcessTracker;