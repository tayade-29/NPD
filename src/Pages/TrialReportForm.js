import React from 'react';

const TrialReportForm = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
        <h2 className="text-2xl font-semibold">Trial Report Form</h2>

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Part Name</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="Enter part name" />
          </div>
          <div>
            <label className="block font-medium mb-1">Customer Name</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="Enter customer name" />
          </div>
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input type="date" className="w-full p-2 border rounded-xl" />
          </div>
        </div>

        {/* Section 2: Material Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Material Type</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. LDPE" />
          </div>
          <div>
            <label className="block font-medium mb-1">Supplier</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. Reliance" />
          </div>
        </div>

        {/* Section 3: Trial Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium mb-1">Cycle Time</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. 60 sec" />
          </div>
          <div>
            <label className="block font-medium mb-1">Mould Type</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. Cold" />
          </div>
          <div>
            <label className="block font-medium mb-1">Mould Temp (Inlet)</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. 50°C" />
          </div>
          <div>
            <label className="block font-medium mb-1">Mould Temp (Outlet)</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. 40°C" />
          </div>
        </div>

        {/* Section 4: Observations */}
        <div>
          <label className="block font-medium mb-1">Tool Observations</label>
          <textarea className="w-full p-2 border rounded-xl" rows="3" placeholder="e.g. Visual OK, Dimensional OK"></textarea>
        </div>

        {/* Section 5: Material Consumption */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Material Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Opening Shot</label>
              <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. 15Kg" />
            </div>
            <div>
              <label className="block font-medium mb-1">Closing Shot</label>
              <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. 13Kg" />
            </div>
          </div>
        </div>

        {/* Section 6: Cooling Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Cooling With</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. Coolant, Water" />
          </div>
          <div>
            <label className="block font-medium mb-1">Cooling Method</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="e.g. Manual with Safety" />
          </div>
        </div>

        {/* Section 7: Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Trial Conducted By</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-medium mb-1">Approved By</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
          <div>
            <label className="block font-medium mb-1">Customer Representative</label>
            <input type="text" className="w-full p-2 border rounded-xl" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition">Submit</button>
        </div>

      </div>
    </div>
  );
};

export default TrialReportForm;