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
        designFiles: [], // Store uploaded files here
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0); // Key to reset the file input

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnquiries([...enquiries, formData]); // Add the current form data to the enquiries array
        setFormData(initialFormData); // Reset form data to initial values
        setSelectedFiles([]); // Clear the selected files
        setFileInputKey(prevKey => prevKey + 1); // Change the key to reset the file input
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
        setSelectedFiles(validFiles); // Only store valid files

        // Update formData with the valid files
        setFormData(prev => ({
            ...prev,
            designFiles: [...validFiles], // Store valid files in formData
        }));
    };

    return (
        <>
            <main className="max-w-7xl mx-auto">
                {page === 'form' ? (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <section className="form-section">
                                <h3>Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="srNo">EnquiryId</label>
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
                                        <label htmlFor="designUpload" className="block text-lg font-semibold mb-2">Upload Design Files</label>
                                        <input
                                            key={fileInputKey} // Use key to reset the input
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
                                <h3>Dates</h3>
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