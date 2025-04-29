import React, { useState } from 'react';
import { Pencil, PlusCircle, XCircle, Search } from 'lucide-react';
import { useAddEmployeeMutation, useGetEmployeeQuery, useCheckDuplicateEmployeeMutation, useGetRolesQuery } from '../features/api/apiSlice';
import { useAuth } from '../context/AuthContext';

function EmployeePage() {
  const { userData } = useAuth();
  const [initialValues, setInitialValues] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
                                                     

  const [newEmployee, setNewEmployee] = useState({
    pEmployeeCode: 0,
    pFkClientId: userData?.ClientId || 1,
    pFkPlantId: userData?.PlantId || 1,
    pFkLocationId: userData?.LocationId || 0,
    pFkRoleId: 0,
    pFullName: "",
    pContactNumber: "",
    pEmailAddress: "",
    pAllowLogin: 1,
    pUserName: "",
    pPassword: "",
    pSkill: "",
    pCreatedBy: userData?.RoleId || 1,
    pIsActive: 1,
    pPhoto: ""
  });

  // Fetch roles
  const { data: roles = [] } = useGetRolesQuery({
    pClientId: userData?.ClientId || 1,
    pPlantId: userData?.PlantId || 1,
    pLocationId: userData?.LocationId || 1
  });

  const {
    data: employees = [],
    isLoading,
    error,
    refetch
  } = useGetEmployeeQuery({
    pAction: 0,
    pLookUpId: 0,
    pFkClientId: userData?.ClientId || 1,
    pFkPlantId: userData?.PlantId || 1,
    pFkLocationId: userData?.LocationId || 0
  });

  const [addEmployee, { isLoading: isAddingEmployee }] = useAddEmployeeMutation();
  const [checkDuplicate] = useCheckDuplicateEmployeeMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
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

  const handleEdit = (employee) => {
    setEditId(employee.EmployeeCode);

    // Set role based on employee's role ID
    if (employee.RoleId === 1) {
      setNewEmployee(prev => ({ ...prev, pFkPlantId: employee.FkPlantId }));
    }
    if (employee.RoleId === 1 || employee.RoleId === 157) {
      setNewEmployee(prev => ({ ...prev, pFkLocationId: employee.FkLocationId }));
    }

    setNewEmployee({
      pEmployeeCode: employee.EmployeeCode,
      pFkClientId: userData?.ClientId || 1,
      pFkPlantId: userData?.PlantId || 1,
      pFkLocationId: userData?.LocationId || 0,
      pFkRoleId: employee.RoleId,
      pFullName: employee.FullName,
      pContactNumber: employee.ContactNumber,
      pEmailAddress: employee.EmailAddress,
      pAllowLogin: 1,
      pUserName: employee.UserName,
      pPassword: employee.Password,
      pSkill: employee.Skill || "",
      pCreatedBy: userData?.RoleId || 1,
      pIsActive: employee.IsActive === "Active" || employee.IsActive === 1 || employee.IsActive === "1" ? 1 : 0,
      pPhoto: employee.Photo || ""
    });

    setInitialValues({
      FullName: employee.FullName,
      ContactNumber: employee.ContactNumber,
      EmailAddress: employee.EmailAddress,
      Skill: employee.Skill,
      UserName: employee.UserName,
      FkRoleId: employee.RoleId,
      AllowLogin: employee.AllowLogin === "Allowed",
      IsActive: employee.IsActive === "Active",
      FkPlantId: employee.FkPlantId,
      FkLocationId: employee.FkLocationId,
      Password: employee.Password
    });

    setShowForm(true);
  };

  const handleAddEmployee = async () => {
    try {
      if (!editId) {
        const duplicateCheck = await checkDuplicate({
          pEmployeeCode: newEmployee.pEmployeeCode,
          pFkClientId: newEmployee.pFkClientId,
          pFkLocationId: newEmployee.pFkLocationId,
          pFkRoleId: newEmployee.pFkRoleId,
          pFullName: newEmployee.pFullName,
          pUserName: newEmployee.pUserName,
          pPassword: newEmployee.pPassword,
          pPlantId: newEmployee.pFkPlantId
        }).unwrap();

        const existingEmployee = employees.find(employee =>
          employee.FullName === newEmployee.pFullName &&
          employee.UserName === newEmployee.pUserName &&
          employee.ContactNumber === newEmployee.pContactNumber &&
          employee.EmailAddress === newEmployee.pEmailAddress
        );

        if (existingEmployee) {
          alert('An employee with exactly the same details already exists!');
          return;
        }
      }

      const result = await addEmployee(newEmployee).unwrap();

      if (result?.success === false) {
        throw new Error(result.message || 'Operation failed');
      }

      setNewEmployee({
        pEmployeeCode: 0,
        pFkClientId: userData?.ClientId || 1,
        pFkPlantId: userData?.PlantId || 1,
        pFkLocationId: userData?.LocationId || 0,
        pFkRoleId: 0,
        pFullName: "",
        pContactNumber: "",
        pEmailAddress: "",
        pAllowLogin: 1,
        pUserName: "",
        pPassword: "",
        pSkill: "",
        pCreatedBy: userData?.RoleId || 1,
        pIsActive: 1,
        pPhoto: ""
      });

      setShowForm(false);
      setEditId(null);
      await refetch();

      alert(editId ? "Employee updated successfully!" : "Employee added successfully!");
    } catch (error) {
      console.error("Employee operation failed:", error);
      alert(error.message || 'Operation failed. Please try again.');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (isLoading || isLoadingRoles) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //         <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading...</h2>
  //       </div>
  //     </div>
  //   );
  // }

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
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-800">Users</h2>

          {/* Search Bar - centered and wider */}
          <div className="flex-1 mx-40">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search employees by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-10 text-blue-600" />
            </div>
          </div>
          <button
            onClick={() => {
              setEditId(null);
              setNewEmployee({
                pEmployeeCode: 0,
                pFkClientId: userData?.ClientId || 1,
                pFkPlantId: userData?.PlantId || 1,
                pFkLocationId: userData?.LocationId || 0,
                pFkRoleId: 0,
                pFullName: "",
                pContactNumber: "",
                pEmailAddress: "",
                pAllowLogin: 1,
                pUserName: "",
                pPassword: "",
                pSkill: "",
                pCreatedBy: userData?.RoleId || 1,
                pIsActive: 1,
                pPhoto: ""
              });
              setShowForm(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New user
          </button>
        </div>
        {/* </div>
        </div> */}

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="overflow-hidden">
            <div className="max-h-[calc(100vh-250px)] overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Sr No.</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Full Name</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Contact Number</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Username</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Role</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee, index) => {
                    const isActive = employee.IsActive === "Active" || employee.IsActive === 1 || employee.IsActive === "1";
                    console.log('Employee RoleId:', employee.RoleId, typeof employee.RoleId);
                    console.log('Roles:', roles);
                    const role = roles.find(r => Number(r.value) === Number(employee.RoleId));



                    return (
                      <tr key={employee.EmployeeCode}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.FullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.ContactNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.EmailAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {role?.label || 'N/A'}
                        </td>


                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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

        {/* Add/Edit Employee Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {editId ? 'Edit User' : 'New User'}
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
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="pFkRoleId"
                      value={newEmployee.pFkRoleId}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, pFkRoleId: parseInt(e.target.value, 10) }))}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
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

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pAllowLogin"
                        checked={newEmployee.pAllowLogin === 1}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'pAllowLogin',
                            value: e.target.checked ? 1 : 0
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Allow Login</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="pIsActive"
                        checked={newEmployee.pIsActive === 1}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'pIsActive',
                            value: e.target.checked ? 1 : 0
                          }
                        })}
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
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isAddingEmployee ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
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

export default EmployeePage;