import React, { useState } from 'react';
import { Pencil, PlusCircle, XCircle, FileText } from 'lucide-react';
import { useGetEmployeesQuery, useAddEmployeeMutation } from '../features/api/apiSlice';
import { useAuth } from '../context/AuthContext';

function App() {
  const { userData } = useAuth();
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [documentName, setDocumentName] = useState('');
  
  const generateEmployeeCode = () => {
    return "0";
  };

  const [newEmployee, setNewEmployee] = useState({
    pPkEmployeeId: 0,
    pEmployeeCode: generateEmployeeCode(),
    pFkClientId: userData?.ClientId || 1,
    pFkPlantId: userData?.PlantId || 1,
    pFkLocationId: userData?.LocationId || 1,
    pFkRoleId: userData?.RoleId || 157,
    pFullName: '',
    pContactNumber: '',
    pEmailAddress: '',
    pUserName: '',
    pPassword: '',
    pConfirmPassword: '',
    pPhoto: '',
    pDocument: '',
    pSkill: '',
    pCreatedBy: userData?.EmployeeId || 157,
    pAllowLogin: false,
    pIsActive: true
  });

  const {
    data: employees = [],
    isLoading,
    error,
    refetch
  } = useGetEmployeesQuery({
    pAction: 0,
    pLookUpId: 0,
    pFkClientId: parseInt(userData?.ClientId) || 1,
    pFkPlantId: parseInt(userData?.PlantId) || 1
  });

  const [addEmployee, { isLoading: isAddingEmployee }] = useAddEmployeeMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setNewEmployee(prev => ({ ...prev, pPhoto: base64String }));
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setNewEmployee(prev => ({ ...prev, pDocument: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee.EmployeeId);
    setNewEmployee({
      pPkEmployeeId: employee.EmployeeId,
      pEmployeeCode: employee.EmployeeCode,
      pFkClientId: parseInt(userData?.ClientId) || 1,
      pFkPlantId: parseInt(userData?.PlantId) || 1,
      pFkLocationId: parseInt(userData?.LocationId) || 1,
      pFkRoleId: parseInt(userData?.RoleId) || 157,
      pFullName: employee.FullName || '',
      pContactNumber: employee.ContactNumber || '',
      pEmailAddress: employee.EmailAddress || '',
      pUserName: employee.UserName || '',
      pPhoto: employee.Photo || '',
      pDocument: employee.Document || '',
      pSkill: employee.Skill || '',
      pCreatedBy: parseInt(userData?.EmployeeId) || 157,
      pAllowLogin: employee.AllowLogin === 1 || employee.AllowLogin === "1" || employee.AllowLogin === true,
      pIsActive: employee.IsActive === 1 || employee.IsActive === "1" || employee.IsActive === true
    });
    setShowForm(true);
    if (employee.Photo) {
      setPhotoPreview(`data:image/jpeg;base64,${employee.Photo}`);
    }
    if (employee.Document) {
      setDocumentName('Current Document');
    }
  };

  const handleAddEmployee = async () => {
    try {
      if (!newEmployee.pFullName || !newEmployee.pContactNumber || !newEmployee.pEmailAddress) {
        alert("Please fill all required fields!");
        return;
      }

      if (!editId && newEmployee.pPassword !== newEmployee.pConfirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const employeeData = {
        ...newEmployee,
        pPkEmployeeId: editId || 0,
        pFkClientId: parseInt(userData?.ClientId) || 1,
        pFkPlantId: parseInt(userData?.PlantId) || 1,
        pFkLocationId: parseInt(userData?.LocationId) || 1,
        pFkRoleId: parseInt(userData?.RoleId) || 157,
        pCreatedBy: parseInt(userData?.EmployeeId) || 157,
        pAllowLogin: newEmployee.pAllowLogin ? 1 : 0,
        pIsActive: newEmployee.pIsActive ? 1 : 0
      };

      const result = await addEmployee(employeeData).unwrap();

      if (result?.success === false) {
        throw new Error(result.message || 'Operation failed');
      }

      setNewEmployee({
        pPkEmployeeId: 0,
        pEmployeeCode: generateEmployeeCode(),
        pFkClientId: userData?.ClientId || 1,
        pFkPlantId: userData?.PlantId || 1,
        pFkLocationId: userData?.LocationId || 1,
        pFkRoleId: userData?.RoleId || 157,
        pFullName: '',
        pContactNumber: '',
        pEmailAddress: '',
        pUserName: '',
        pPassword: '',
        pConfirmPassword: '',
        pPhoto: '',
        pDocument: '',
        pSkill: '',
        pCreatedBy: userData?.EmployeeId || 157,
        pAllowLogin: false,
        pIsActive: true
      });

      setShowForm(false);
      setEditId(null);
      setPhotoPreview(null);
      setDocumentName('');
      await refetch();

      alert(editId ? "Employee updated successfully!" : "Employee added successfully!");
    } catch (error) {
      console.error("Employee operation failed:", error);
      alert(error.message || 'Operation failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading employees...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-800">Error loading employees</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employee Management</h2>
          <button
            onClick={() => {
              setEditId(null);
              setNewEmployee({
                pPkEmployeeId: 0,
                pEmployeeCode: generateEmployeeCode(),
                pFkClientId: userData?.ClientId || 1,
                pFkPlantId: userData?.PlantId || 1,
                pFkLocationId: userData?.LocationId || 1,
                pFkRoleId: userData?.RoleId || 157,
                pFullName: '',
                pContactNumber: '',
                pEmailAddress: '',
                pUserName: '',
                pPassword: '',
                pConfirmPassword: '',
                pPhoto: '',
                pDocument: '',
                pSkill: '',
                pCreatedBy: userData?.EmployeeId || 157,
                pAllowLogin: false,
                pIsActive: true
              });
              setShowForm(true);
              setPhotoPreview(null);
              setDocumentName('');
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Employee
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="overflow-hidden">
            <div className="max-h-[calc(100vh-250px)] overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-16">Sr No.</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Code</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Full Name</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Contact</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Username</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Document</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) => {
                    const isActive = employee.IsActive === 1 || employee.IsActive === "1" || employee.IsActive === true;
                    return (
                      <tr key={employee.EmployeeId || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm w-16">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.EmployeeCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.FullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.ContactNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.EmailAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {employee.Document && (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {editId ? 'Edit Employee' : 'New Employee'}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Code
                    </label>
                    <input
                      type="text"
                      name="pEmployeeCode"
                      value={newEmployee.pEmployeeCode}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pFullName"
                      value={newEmployee.pFullName}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="pContactNumber"
                      value={newEmployee.pContactNumber}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="pEmailAddress"
                      value={newEmployee.pEmailAddress}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="pUserName"
                      value={newEmployee.pUserName}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {!editId && (
                    <>
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          name="pPassword"
                          value={newEmployee.pPassword}
                          onChange={handleChange}
                          className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="pConfirmPassword"
                          value={newEmployee.pConfirmPassword}
                          onChange={handleChange}
                          className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="mt-2 h-20 w-20 object-cover rounded-md"
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {documentName && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <FileText className="w-4 h-4 mr-2" />
                        {documentName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pAllowLogin"
                        checked={newEmployee.pAllowLogin}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Allow Login</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pIsActive"
                        checked={newEmployee.pIsActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    disabled={isAddingEmployee}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                      isAddingEmployee ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {isAddingEmployee
                      ? 'Saving...'
                      : editId
                        ? 'Update Changes'
                        : 'Create Employee'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
