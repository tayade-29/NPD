import React from 'react';

const PreDispatchInspection = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Pre-Dispatch Inspection Report</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Sr. No.</th>
              <th className="border px-4 py-2 text-left">Parameter</th>
              <th className="border px-4 py-2 text-left">Specification</th>
              <th className="border px-4 py-2 text-left">Checking Instrument/L.C.</th>
              <th className="border px-4 py-2 text-left">Observation 1</th>
              <th className="border px-4 py-2 text-left">Observation 2</th>
              <th className="border px-4 py-2 text-left">Observation 3</th>
              <th className="border px-4 py-2 text-left">Observation 4</th>
              <th className="border px-4 py-2 text-left">Observation 5</th>
              <th className="border px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty rows for now, to be filled dynamically later if needed */}
            <tr>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PreDispatchInspection;
