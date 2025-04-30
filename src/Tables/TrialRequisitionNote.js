import React from 'react';

const TrialRequisitionNote = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Trial Requisition Note</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-bold">Department</label>
            <input type="text" placeholder="Enter department" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Trial For</label>
            <input type="text" placeholder="Enter trial for" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Customer Name</label>
            <input type="text" placeholder="Enter customer name" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Name of Mould</label>
            <input type="text" placeholder="Enter mould name" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Mould Dimension</label>
            <input type="text" placeholder="Enter mould dimension" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Material to Use</label>
            <input type="text" placeholder="Enter material" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Material Manufacturer</label>
            <input type="text" placeholder="Enter manufacturer" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Colour</label>
            <input type="text" placeholder="Enter colour" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Machine To Be Used</label>
            <input type="text" placeholder="Enter machine details" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Number of Pieces Required</label>
            <input type="text" placeholder="Enter number of pieces" className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-bold">Date</label>
            <input type="date" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Trial Date</label>
            <input type="date" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Raw Material Own / Customer</label>
            <input type="text" placeholder="Enter details" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Trial Number</label>
            <input type="text" placeholder="Enter trial number" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Core Requirement (Yes/No)</label>
            <input type="text" placeholder="Yes or No" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Grade</label>
            <input type="text" placeholder="Enter grade" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Preheating At and For</label>
            <input type="text" placeholder="Enter preheating details" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">M.B. Dosage</label>
            <input type="text" placeholder="Yes or No" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Insert Requirement (Yes/No)</label>
            <input type="text" placeholder="Yes or No" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Number of Cavities</label>
            <input type="text" placeholder="Enter number of cavities" className="w-full border rounded p-2" />
          </div>
        </div>

        {/* Full Width */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <div>
            <label className="font-bold">Core Sequence</label>
            <input type="text" placeholder="Enter core sequence" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Jigs/Fixtures Required</label>
            <input type="text" placeholder="Enter jigs/fixtures" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Period of Jigs and Fixture Insertion</label>
            <input type="text" placeholder="Enter period" className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="font-bold">Inspection Details</label>
            <textarea placeholder="Enter inspection details" className="w-full border rounded p-2" rows="3" />
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TrialRequisitionNote;
