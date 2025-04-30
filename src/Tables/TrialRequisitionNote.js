import React, { useState, useEffect } from "react";
import { useSubmitTrialRequisitionMutation } from "../features/api/apiSliceChecklist";
import { useGetEnquiriesQuery } from "../features/api/apiSliceenquiry"; // Adjust path if needed

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md p-2 text-sm"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="3"
      className="border border-gray-300 rounded-md p-2 text-sm"
    />
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="col-span-full mt-4 mb-2">
    <h2 className="text-[18px] font-semibold text-gray-700 border-b pb-1">
      {title}
    </h2>
  </div>
);

const TrialRequisitionNote = () => {
  const [formData, setFormData] = useState({
    pPkNPDTrialRequisitionNoteId: 0,
    pFkEnquiryMasterId: "", // Corrected line
    pTrialFor: "",
    pTrialDate: "",
    pTrialNo: "",
    pNameOfMould: "",
    pMouldDimension: "",
    pCoreRequired: "",
    pCoreSequence: "",
    pMaterialToUse: "",
    pGrade: "",
    pMaterialManufacturer: "",
    pPreheatingAtAndFor: "",
    pColour: "",
    pM_B_Dosage: "",
    pMachineToBeUsed: "",
    pNoOfPcsRequired: "",
    pInsertRequired: "",
    pJigs_FixturesRequired: "",
    pNoOfCavities: "",
    pPeriodofjigsandFixtureInsertion: "",
    pInspectionDetails: "",
    pRemark: "",
  });
  

  const {
    data: enquiryData = [],
    isLoading: isEnquiryLoading,
  } = useGetEnquiriesQuery();

  const [submitForm, { isLoading }] = useSubmitTrialRequisitionMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.pFkEnquiryMasterId) {
      alert("Please select an Enquiry");
      return;
    }
  
    const parsedData = {
      ...formData,
      pFkEnquiryMasterId: parseInt(formData.pFkEnquiryMasterId, 10),
      pPkNPDTrialRequisitionNoteId: parseInt(formData.pPkNPDTrialRequisitionNoteId, 10),
      pNoOfPcsRequired: parseInt(formData.pNoOfPcsRequired, 10) || 0,
      pNoOfCavities: parseInt(formData.pNoOfCavities, 10) || 0,
    };
  
    try {
      const res = await submitForm(parsedData).unwrap();
      console.log("Success:", res);
      alert("Trial Requisition submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed.");
    }
  };
  
  

  return (
    <form
      onSubmit={handleSubmit}
      className="grid px-6 py-2 grid-cols-1 md:grid-cols-3 gap-6 text-gray-800 text-sm"
    >
      <SectionTitle title="General Details" />

      {/* Enquiry Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Select Enquiry
        </label>
        <select
          name="pFkEnquiryMasterId"
          value={formData.pFkEnquiryMasterId}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 text-sm"
        >
          <option value="">-- Select Enquiry --</option>
          {enquiryData.map((enquiry) => (
            <option
              key={enquiry.PkEnquiryMasterId}
              value={enquiry.PkEnquiryMasterId}
            >
              {`${enquiry.EnquiryRegisterNo} - ${enquiry.PartName} (${enquiry.CustomerName})`}
            </option>
          ))}
        </select>
      </div>

      <InputField
        label="Trial For"
        name="pTrialFor"
        value={formData.pTrialFor}
        onChange={handleChange}
        placeholder="Enter trial for"
      />
      <InputField
        label="Name of Mould"
        name="pNameOfMould"
        value={formData.pNameOfMould}
        onChange={handleChange}
        placeholder="Enter mould name"
      />
      <InputField
        label="Mould Dimension"
        name="pMouldDimension"
        value={formData.pMouldDimension}
        onChange={handleChange}
        placeholder="Enter mould dimension"
      />
      <InputField
        label="Material to Use"
        name="pMaterialToUse"
        value={formData.pMaterialToUse}
        onChange={handleChange}
        placeholder="Enter material"
      />
      <InputField
        label="Material Manufacturer"
        name="pMaterialManufacturer"
        value={formData.pMaterialManufacturer}
        onChange={handleChange}
        placeholder="Enter manufacturer"
      />
      <InputField
        label="Colour"
        name="pColour"
        value={formData.pColour}
        onChange={handleChange}
        placeholder="Enter colour"
      />
      <InputField
        label="Machine To Be Used"
        name="pMachineToBeUsed"
        value={formData.pMachineToBeUsed}
        onChange={handleChange}
        placeholder="Enter machine details"
      />
      <InputField
        label="Number of Pieces Required"
        name="pNoOfPcsRequired"
        value={formData.pNoOfPcsRequired}
        onChange={handleChange}
        placeholder="Enter number of pieces"
      />

      <SectionTitle title="Trial Information" />
      <InputField
        label="Trial Date"
        name="pTrialDate"
        type="date"
        value={formData.pTrialDate}
        onChange={handleChange}
      />
      <InputField
        label="Trial Number"
        name="pTrialNo"
        value={formData.pTrialNo}
        onChange={handleChange}
        placeholder="Enter trial number"
      />
      <InputField
        label="Core Required"
        name="pCoreRequired"
        value={formData.pCoreRequired}
        onChange={handleChange}
        placeholder="Yes or No"
      />
      <InputField
        label="Grade"
        name="pGrade"
        value={formData.pGrade}
        onChange={handleChange}
        placeholder="Enter grade"
      />
      <InputField
        label="Preheating At and For"
        name="pPreheatingAtAndFor"
        value={formData.pPreheatingAtAndFor}
        onChange={handleChange}
        placeholder="Enter preheating details"
      />
      <InputField
        label="M.B. Dosage"
        name="pM_B_Dosage"
        value={formData.pM_B_Dosage}
        onChange={handleChange}
        placeholder="Enter dosage info"
      />
      <InputField
        label="Insert Required"
        name="pInsertRequired"
        value={formData.pInsertRequired}
        onChange={handleChange}
        placeholder="Yes or No"
      />
      <InputField
        label="Number of Cavities"
        name="pNoOfCavities"
        value={formData.pNoOfCavities}
        onChange={handleChange}
        placeholder="Enter number of cavities"
      />

      <SectionTitle title="Additional Requirements" />
      <InputField
        label="Core Sequence"
        name="pCoreSequence"
        value={formData.pCoreSequence}
        onChange={handleChange}
        placeholder="Enter core sequence"
      />
      <InputField
        label="Jigs/Fixtures Required"
        name="pJigs_FixturesRequired"
        value={formData.pJigs_FixturesRequired}
        onChange={handleChange}
        placeholder="Enter jigs/fixtures"
      />
      <InputField
        label="Period of Jigs and Fixture Insertion"
        name="pPeriodofJigsandFixtureInsertion"
        value={formData.pPeriodofjigsandFixtureInsertion}
        onChange={handleChange}
        placeholder="Enter period"
      />
      <TextAreaField
        label="Inspection Details"
        name="pInspectionDetails"
        value={formData.pInspectionDetails}
        onChange={handleChange}
        placeholder="Enter inspection details"
      />
      <TextAreaField
        label="Remarks"
        name="pRemark"
        value={formData.pRemark}
        onChange={handleChange}
        placeholder="Enter remarks"
      />

      <div className="col-span-full flex justify-end mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default TrialRequisitionNote;
