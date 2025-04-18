import React from 'react';
import { XCircle } from 'lucide-react';

const FileUploader = ({ 
  selectedFiles, 
  setSelectedFiles, 
  fileInputKey, 
  setFileInputKey 
}) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'step', '3ds', 'dae', 'fbx', 'obj', 'stl', 'gltf', 'glb', 'iges', 'dxf', 'vrml', 'tif', 'tiff', 'gif', 'bmp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const newFiles = files.map(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        return { file, status: 'error', message: 'Invalid file type' };
      }
      if (file.size > maxSize) {
        return { file, status: 'error', message: 'File too large (max 5MB)' };
      }
      return { file, status: 'success', message: 'Ready to upload', url: URL.createObjectURL(file) };
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
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
        <p className="mt-1 text-sm text-gray-500">
          Max file size: 5MB. Allowed formats: PDF, images, and 3D files.
        </p>
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`p-2 rounded-md text-sm flex justify-between items-center ${
                  file.status === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                }`}
              >
                <span>{file.file.name} - {file.message}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;