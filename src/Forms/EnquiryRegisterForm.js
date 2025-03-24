import React, { useState } from 'react';
import EnquiryTable from '../Pages/EnquiryTable';

const EnquiryForm = () => {
    const [page, setPage] = useState('form');
    const [enquiries, setEnquiries] = useState([]);

    const initialFormData = {
        srNo: '',
        customerName: '',
        projectVehicleProgram: '',
        partCode: '',
        partName: '',
        rawMaterial: '',
        sop: '',
        estimatedAnnualVolume: '',
        enquiryReceivedDate: '',
        partColour: '',
        dateQuoted: '',
        status: 'UD',
        reasonForLoss: '',
        nextStep: '',
        partCostEstimate: '',
        toolCostEstimate: '',
        annualBusinessPotential: '',
        customerPODate: '',
        poNo: '',
        feasibilityCommitment: 'feasible',
        designFiles: [], // Store uploaded files here
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnquiries([...enquiries, formData]);
        setFormData(initialFormData);
        setSelectedFiles([]); // Clear the selected files
        alert('Enquiry registered successfully!');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'step', '3ds', 'dae', 'fbx', 'obj', 'stl', 'gltf', 'glb', 'iges', 'dxf', 'vrml', 'tif', 'tiff', 'gif', 'bmp'];
        const maxSize = 5 * 1024 * 1024; // 5MB limit

        const newFiles = files.map(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return { file, status: 'error', message: 'Invalid file type' };
            } else if (file.size > maxSize) {
                return { file, status: 'error', message: 'File size exceeds 5MB limit' };
            } else {
                return { file, status: 'success', message: 'Successfully uploaded', url: URL.createObjectURL(file) };
            }
        });

        const validFiles = newFiles.filter(fileObj => fileObj.status === 'success');
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

        // Update formData with the valid files
        setFormData(prev => ({
            ...prev,
            designFiles: [...prev.designFiles, ...validFiles], // Store valid files in formData
        }));
    };

    return (
        <>
            <nav className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Enquiry Register</h1>
                        <div className="space-x-4">
                            <button
                                onClick={() => setPage('form')}
                                className={`nav-button ${page === 'form' ? 'nav-button-active' : 'nav-button-inactive'}`}
                            >
                                New Enquiry
                            </button>
                            <button
                                onClick={() => setPage('table')}
                                className={`nav-button ${page === 'table' ? 'nav-button-active' : 'nav-button-inactive'}`}
                            >
                                View Enquiries
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto">
                {page === 'form' ? (
                    <>
                        <div className="bg-blue-50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-blue-900">New Enquiry Registration</h2>
                            <p className="text-blue-700 mt-1">Fill in the details below to register a new enquiry</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <section className="form-section">
                                <h3>Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="srNo">Sr. No.</label>
                                        <input
                                            className='input-field'
                                            id="srNo"
                                            type="text"
                                            name="srNo"
                                            value={formData.srNo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="customerName">Customer Name</label>
                                        <input
                                            id="customerName"
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="projectVehicleProgram">Project/Vehicle Program</label>
                                        <input
                                            id="projectVehicleProgram"
                                            type="text"
                                            name="projectVehicleProgram"
                                            value={formData.projectVehicleProgram}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Part Details */}
                            <section className="form-section">
                                <h3>Part Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="partCode">Part Code</label>
                                        <input
                                            id="partCode"
                                            type="text"
                                            name="partCode"
                                            value={formData.partCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="partName">Part Name</label>
                                        <input
                                            id="partName"
                                            type="text"
                                            name="partName"
                                            value={formData.partName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="rawMaterial">Raw Material</label>
                                        <input
                                            id="rawMaterial"
                                            type="text"
                                            name="rawMaterial"
                                            value={formData.rawMaterial}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="partColour">Part Colour</label>
                                        <input
                                            id="partColour"
                                            type="text"
                                            name="partColour"
                                            value={formData.partColour}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="designUpload" className="block text-lg font-semibold mb-2">Upload Design Files</label>
                                        <input
                                            id="designUpload"
                                            type="file"
                                            name="designFiles"
                                            multiple
                                            accept=".pdf, .jpg, .jpeg, .png, .step, .3ds, .dae, .fbx, .obj, .stl, .gltf, .glb, .iges, .dxf, .vrml, .tif, .tiff, .gif, .bmp"
                                            onChange={handleFileUpload}
                                            className="border border-gray-300 p-2 rounded-lg w-full"
                                        />

                                        {selectedFiles.length > 0 && (
                                            <ul className="mt-3">
                                                {selectedFiles.map((fileObj, index) => (
                                                    <li
                                                        key={index}
                                                        className={`p-2 rounded-lg my-1 ${fileObj.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                    >
                                                        {fileObj.file.name} - {fileObj.message}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Dates and Volume */}
                            <section className="form-section">
                                <h3>Dates & Volume</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="sop">SOP</label>
                                        <input
                                            id="sop"
                                            type="date"
                                            name="sop"
                                            value={formData.sop}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="enquiryReceivedDate">Enquiry Received Date</label>
                                        <input
                                            id="enquiryReceivedDate"
                                            type="date"
                                            name="enquiryReceivedDate"
                                            value={formData.enquiryReceivedDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="dateQuoted">Date Quoted</label>
                                        <input
                                            id="dateQuoted"
                                            type="date"
                                            name="dateQuoted"
                                            value={formData.dateQuoted}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="customerPODate">Customer P.O Date</label>
                                        <input
                                            id="customerPODate"
                                            type="date"
                                            name="customerPODate"
                                            value={formData.customerPODate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="estimatedAnnualVolume">Estimated Annual Volume</label>
                                        <input
                                            id="estimatedAnnualVolume"
                                            type="number"
                                            name="estimatedAnnualVolume"
                                            value={formData.estimatedAnnualVolume}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Status and Costs */}
                            <section className="form-section">
                                <h3>Status & Costs</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="capitalize"
                                        >
                                            <option value="Won">Won</option>
                                            <option value="Lost">Lost</option>
                                            <option value="UD">Under Discussion</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="feasibilityCommitment">Feasibility Commitment</label>
                                        <select
                                            id="feasibilityCommitment"
                                            name="feasibilityCommitment"
                                            value={formData.feasibilityCommitment}
                                            onChange={handleChange}
                                            className="capitalize"
                                        >
                                            <option value="feasible">Feasible</option>
                                            <option value="not feasible">Not Feasible</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="partCostEstimate">Part Cost Estimate (₹)</label>
                                        <input
                                            id="partCostEstimate"
                                            type="number"
                                            name="partCostEstimate"
                                            value={formData.partCostEstimate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="toolCostEstimate">Tool Cost Estimate (₹)</label>
                                        <input
                                            id="toolCostEstimate"
                                            type="number"
                                            name="toolCostEstimate"
                                            value={formData.toolCostEstimate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="annualBusinessPotential">Annual Business Potential (lacs)</label>
                                        <input
                                            id="annualBusinessPotential"
                                            type="number"
                                            name="annualBusinessPotential"
                                            value={formData.annualBusinessPotential}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="poNo">P.O. No.</label>
                                        <input
                                            id="poNo"
                                            type="text"
                                            name="poNo"
                                            value={formData.poNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Additional Information */}
                            <section className="form-section">
                                <h3>Additional Information</h3>
                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label htmlFor="reasonForLoss">Reason for Loss</label>
                                        <textarea
                                            id="reasonForLoss"
                                            name="reasonForLoss"
                                            value={formData.reasonForLoss}
                                            onChange={handleChange}
                                            rows="3"
                                            className={formData.status === 'Lost' ? 'border-red-300' : ''}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nextStep">Next Step</label>
                                        <textarea
                                            id="nextStep"
                                            name="nextStep"
                                            value={formData.nextStep}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <button type="submit" className="btn-primary">
                                    Save Enquiry
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <EnquiryTable enquiries={enquiries} />
                )}
            </main>
        </>
    );
};

export default EnquiryForm;