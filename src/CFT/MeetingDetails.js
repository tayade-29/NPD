import React, { useState, useEffect } from 'react';
import { format } from '../utils/dateUtils';
import { Save, X, Upload, File, Trash2 } from 'lucide-react';

const MeetingDetails = ({ date, meeting, onSave, onCancel }) => {
  const [mom, setMom] = useState('');
  const [documents, setDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (meeting) {
      setMom(meeting.mom || '');
      setDocuments(meeting.documents || []);
    } else {
      setMom('');
      setDocuments([]);
    }
    setUploadedFiles([]);
  }, [meeting, date]);

  const handleSave = () => {
    const meetingData = {
      mom,
      documents: [
        ...documents,
        ...uploadedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        }))
      ]
    };
    onSave(meetingData);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index, isUploaded = true) => {
    if (isUploaded) {
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    } else {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  return (
    <div className=" text-gray-100   p-5 border border-gray-800 animate-fadeIn max-w-2xl mx-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-400">
          Meeting - {format(date, 'MMMM d, yyyy')}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-200 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Minutes of Meeting (MOM)
        </label>
        <textarea
          value={mom}
          onChange={(e) => setMom(e.target.value)}
          className="w-full min-h-[160px] p-3  text-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter the minutes of the meeting..."
        ></textarea>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Documents Discussed
        </label>

        {documents.length > 0 && (
          <ul className="space-y-1 mb-3">
            {documents.map((doc, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <File size={16} className="text-blue-500" />
                  <span>{doc.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index, false)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove file"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {uploadedFiles.length > 0 && (
          <ul className="space-y-1 mb-3">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <File size={16} className="text-blue-400" />
                  <span>{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove file"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="relative group cursor-pointer">
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 z-10"
          />
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-md p-4  text-gray-400  text-sm">
            <Upload size={20} className="mb-1 text-gray-500" />
            Drag files here or click to upload
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md text-sm hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
};

export default MeetingDetails;
