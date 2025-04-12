import React, { useState } from 'react';

const EnquiryForm = () => {
    const [page, setPage] = useState('form');
    const [enquiries, setEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const initialFormData = {
        srNo: '',
        customerName: '',
        projectVehicleProgram: '',
        partCode: '',
        partName: '',
        rawMaterial: '',
        sop: '',
        designFiles: [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEnquiry = { 
            ...formData, 
            id: Date.now(),
            designFiles: selectedFiles.filter(f => f.status === 'success')
        };
        setEnquiries([...enquiries, newEnquiry]);
        setFormData(initialFormData);
        setSelectedFiles([]);
        setFileInputKey(prev => prev + 1);
        alert('Enquiry registered successfully!');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'step', '3ds', 'dae', 'fbx', 'obj', 'stl', 'gltf', 'glb', 'iges', 'dxf', 'vrml', 'tif', 'tiff', 'gif', 'bmp'];
        const maxSize = 5 * 1024 * 1024;

        const newFiles = files.map(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return { file, status: 'error', message: 'Invalid file type' };
            }
            if (file.size > maxSize) {
                return { file, status: 'error', message: 'File too large' };
            }
            return { file, status: 'success', message: 'Uploaded', url: URL.createObjectURL(file) };
        });

        setSelectedFiles(prev => [...prev, ...newFiles.filter(f => f.status === 'success')]);
    };

    const filteredEnquiries = enquiries.filter(enquiry =>
        Object.values(enquiry).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Navigation Tabs */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setPage('form')}
                            className={`pb-4 px-1 text-sm font-medium ${
                                page === 'form' 
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Register Enquiry
                        </button>
                        <button
                            onClick={() => setPage('table')}
                            className={`pb-4 px-1 text-sm font-medium ${
                                page === 'table' 
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            View Enquiries
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div>
                    {page === 'form' ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                                Enquiry Registration Form
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Enquiry ID
                                            </label>
                                            <input
                                                type="text"
                                                name="srNo"
                                                value={formData.srNo}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Project/Vehicle Program
                                            </label>
                                            <input
                                                type="text"
                                                name="projectVehicleProgram"
                                                value={formData.projectVehicleProgram}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Part Details Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Part Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Part Code
                                            </label>
                                            <input
                                                type="text"
                                                name="partCode"
                                                value={formData.partCode}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Part Name
                                            </label>
                                            <input
                                                type="text"
                                                name="partName"
                                                value={formData.partName}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Raw Material
                                            </label>
                                            <input
                                                type="text"
                                                name="rawMaterial"
                                                value={formData.rawMaterial}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Design Files</h3>
                                    <div>
                                        <input
                                            key={fileInputKey}
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png,.step,.3ds,.dae,.fbx,.obj,.stl,.gltf,.glb,.iges,.dxf,.vrml,.tif,.tiff,.gif,.bmp"
                                            onChange={handleFileUpload}
                                            className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {selectedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-2 rounded-md text-sm ${
                                                            file.status === 'success'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {file.file.name} - {file.message}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SOP Date Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Dates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                SOP Date
                                            </label>
                                            <input
                                                type="date"
                                                name="sop"
                                                value={formData.sop}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Save Enquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search by any field..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enquiry ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SOP Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Files</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEnquiries.map((enquiry, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.srNo}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.customerName}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.projectVehicleProgram}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.partCode}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.sop}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {enquiry.designFiles.length} files
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredEnquiries.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No enquiries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnquiryForm;