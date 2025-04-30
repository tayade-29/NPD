import React from 'react';

const SampleInspectionReportForm = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <form className="bg-white rounded-2xl shadow-lg p-8 space-y-10 text-gray-800 text-sm">
        <h2 className="text-2xl font-semibold text-gray-900">Summary Sheet - Sample Inspection Report</h2>

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">Supplier Name</label>
            <input type="text" className="w-full border p-2 rounded-xl" placeholder="Enter supplier name" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input type="date" className="w-full border p-2 rounded-xl" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Part Name</label>
            <input type="text" className="w-full border p-2 rounded-xl" placeholder="Enter part name" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Report No.</label>
            <input type="number" className="w-full border p-2 rounded-xl" placeholder="Enter report number" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Part No. / Rev. No. / Date</label>
            <input type="text" className="w-full border p-2 rounded-xl" placeholder="e.g. B2RH051020/XC_28/08/2024" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Sample Size</label>
            <input type="number" className="w-full border p-2 rounded-xl" placeholder="e.g. 5" />
          </div>
        </div>

        {/* Section 2: Observations */}
        <div>
          <label className="block mb-1 font-medium">Observations</label>
          <textarea className="w-full border p-2 rounded-xl" rows="3" placeholder="Enter observations" />
        </div>

        {/* Section 3: Checked and Approved By */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">Checked By</label>
            <input type="text" className="w-full border p-2 rounded-xl" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Approved By</label>
            <input type="text" className="w-full border p-2 rounded-xl" />
          </div>
        </div>

        {/* Section 4: R&D Remarks */}
        <div>
          <label className="block mb-1 font-medium">R&D Remarks</label>
          <textarea className="w-full border p-2 rounded-xl" rows="3" placeholder="Enter R&D remarks" />
        </div>

        {/* Section 5: R&D Approval */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">R&D Approval</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="rnd_approval" value="Accepted" className="accent-blue-600" />
              <span>Accepted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="rnd_approval" value="Conditionally Accepted" className="accent-yellow-600" />
              <span>Conditionally Accepted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="rnd_approval" value="Rejected" className="accent-red-600" />
              <span>Rejected</span>
            </label>
          </div>
        </div>

        {/* Section 6: NPD Manager Approval */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">NPD Manager Approval</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="npd_approval" value="Accepted" className="accent-blue-600" />
              <span>Accepted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="npd_approval" value="Conditionally Accepted" className="accent-yellow-600" />
              <span>Conditionally Accepted</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="npd_approval" value="Rejected" className="accent-red-600" />
              <span>Rejected</span>
            </label>
          </div>
        </div>

        {/* Section 7: Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">R&D Sign with Initials</label>
            <input type="text" className="w-full border p-2 rounded-xl" />
          </div>
          <div>
            <label className="block mb-1 font-medium">NPD Manager Sign & Initials</label>
            <input type="text" className="w-full border p-2 rounded-xl" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SampleInspectionReportForm;
