import React from 'react';

const SampleInspectionReportForm = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
        <h2 className="text-2xl font-semibold">Summary Sheet - Sample Inspection Report</h2>

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Supplier Name</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="Enter supplier name" />
          </div>
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input type="date" className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-medium mb-1">Part Name</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="Enter part name" />
          </div>
          <div>
            <label className="block font-medium mb-1">Report No.</label>
            <input type="number" className="w-full p-2 border rounded-xl" placeholder="Enter report number" />
          </div>
          <div>
            <label className="block font-medium mb-1">Part No. / Rev. No. / Date</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. B2RH051020/XC_28/08/2024" />
          </div>
          <div>
            <label className="block font-medium mb-1">Sample Size</label>
            <input type="number" className="w-full p-2 border rounded-xl" placeholder="e.g. 5" />
          </div>
        </div>

        {/* Section 2: Observations */}
        <div>
          <label className="block font-medium mb-1">Observations</label>
          <textarea className="w-full p-2 border rounded-xl" rows="3" placeholder="Enter observations"></textarea>
        </div>

        {/* Section 3: Checked By and Approved By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Checked By</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-medium mb-1">Approved By</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
        </div>

        {/* Section 4: R&D Remarks */}
        <div>
          <label className="block font-medium mb-1">R&D Remarks</label>
          <textarea className="w-full p-2 border rounded-xl" rows="3" placeholder="Enter R&D remarks"></textarea>
        </div>

        {/* Section 5: R&D Approval */}
        <div>
          <h3 className="text-lg font-semibold mb-2">R&D Approval</h3>
          <div className="flex items-center space-x-6">
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
          <h3 className="text-lg font-semibold mb-2">NPD Manager Approval</h3>
          <div className="flex items-center space-x-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">R&D Sign with Initials</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-medium mb-1">NPD Manager Sign & Initials</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition">Submit</button>
        </div>

      </div>
    </div>
  );
};

export default SampleInspectionReportForm;