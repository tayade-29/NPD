import React from 'react';

const InputField = ({ label, type = "text", placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} placeholder={placeholder} className="border border-gray-300 rounded-md p-2 text-sm" />
  </div>
);

const TextAreaField = ({ label, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea placeholder={placeholder} rows="3" className="border border-gray-300 rounded-md p-2 text-sm" />
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="col-span-full text-lg font-semibold text-gray-800 border-b pb-1 mt-6">{title}</h2>
);

const TrialRequisitionNote = () => {
  return (
    <div className="h-800px flex flex-col bg-white max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden">

      {/* Sticky Header */}
      <div className="px-6 py-4 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Trial Requisition Note</h1>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800 text-sm">

          <SectionTitle title="General Details" />
          <InputField label="Department" placeholder="Enter department" />
          <InputField label="Trial For" placeholder="Enter trial for" />
          <InputField label="Customer Name" placeholder="Enter customer name" />
          <InputField label="Name of Mould" placeholder="Enter mould name" />
          <InputField label="Mould Dimension" placeholder="Enter mould dimension" />
          <InputField label="Material to Use" placeholder="Enter material" />
          <InputField label="Material Manufacturer" placeholder="Enter manufacturer" />
          <InputField label="Colour" placeholder="Enter colour" />
          <InputField label="Machine To Be Used" placeholder="Enter machine details" />
          <InputField label="Number of Pieces Required" placeholder="Enter number of pieces" />

          <SectionTitle title="Trial Information" />
          <InputField label="Date" type="date" />
          <InputField label="Trial Date" type="date" />
          <InputField label="Raw Material Own / Customer" placeholder="Enter details" />
          <InputField label="Trial Number" placeholder="Enter trial number" />
          <InputField label="Core Requirement (Yes/No)" placeholder="Yes or No" />
          <InputField label="Grade" placeholder="Enter grade" />
          <InputField label="Preheating At and For" placeholder="Enter preheating details" />
          <InputField label="M.B. Dosage" placeholder="Enter dosage info" />
          <InputField label="Insert Requirement (Yes/No)" placeholder="Yes or No" />
          <InputField label="Number of Cavities" placeholder="Enter number of cavities" />

          <SectionTitle title="Additional Requirements" />
          <InputField label="Core Sequence" placeholder="Enter core sequence" />
          <InputField label="Jigs/Fixtures Required" placeholder="Enter jigs/fixtures" />
          <InputField label="Period of Jigs and Fixture Insertion" placeholder="Enter period" />
          <TextAreaField label="Inspection Details" placeholder="Enter inspection details" />

        </form>
      </div>

      {/* Sticky Footer */}
      <div className="p-4 bg-white border-t sticky bottom-0 z-10 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Submit
        </button>
      </div>
    </div>
  );
}

export default TrialRequisitionNote;
