import React, { useState } from 'react';
import { Pencil, Save, PlusCircle, XCircle } from 'lucide-react';

const initialUsers = [
  {
    id: "USR001",
    locationName: "Location 1",
    fullName: "John Doe",
    mobileNumber: "+1 234 567 890",
    emailAddress: "john@example.com",
    userName: "johndoe",
    role: "admin",
    photo: null,
    allowLogin: true,
    isActive: true
  },
  {
    id: "USR002",
    locationName: "Location 2",
    fullName: "Jane Smith",
    mobileNumber: "+1 987 654 321",
    emailAddress: "jane@example.com",
    userName: "janesmith",
    role: "user",
    photo: null,
    allowLogin: true,
    isActive: true
  },
];

const initialFormData = {
  locationName: '',
  fullName: '',
  mobileNumber: '',
  emailAddress: '',
  userName: '',
  role: '',
  password: '',
  confirmPassword: '',
  photo: null,
  allowLogin: false,
  isActive: true
};

const UserPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [editId, setEditId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e, field, id) => {
    setEditedUser({
      ...editedUser,
      [id]: {
        ...editedUser[id],
        [field]: e.target.value
      }
    });
  };

  const handleSave = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...editedUser[id] } : user
    ));
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = () => {
    if (!formData.fullName || !formData.mobileNumber || !formData.emailAddress || !formData.userName || !formData.role || !formData.password) {
      alert("Please fill all required fields!");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newId = `USR${String(users.length + 1).padStart(3, '0')}`;
    setUsers([...users, { ...formData, id: newId }]);
    setShowForm(false);
    setFormData(initialFormData);
    setPhotoPreview(null);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setPhotoPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employee List</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Employee
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.locationName || user.locationName}
                          onChange={(e) => handleChange(e, 'locationName', user.id)}
                        >
                          <option value="">All Location</option>
                          <option value="Location 1">Location 1</option>
                          <option value="Location 2">Location 2</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">{user.locationName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.fullName || user.fullName}
                          onChange={(e) => handleChange(e, 'fullName', user.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{user.fullName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.mobileNumber || user.mobileNumber}
                          onChange={(e) => handleChange(e, 'mobileNumber', user.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{user.mobileNumber}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <input
                          type="email"
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.emailAddress || user.emailAddress}
                          onChange={(e) => handleChange(e, 'emailAddress', user.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{user.emailAddress}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.userName || user.userName}
                          onChange={(e) => handleChange(e, 'userName', user.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{user.userName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={editedUser[user.id]?.role || user.role}
                          onChange={(e) => handleChange(e, 'role', user.id)}
                        >
                          <option value="">Select Role</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editId === user.id ? (
                        <button
                          onClick={() => handleSave(user.id)}
                          className="flex items-center text-white bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditId(user.id)}
                          className="flex items-center text-gray-600 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-6">
              {/* Employee Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location Name
                  </label>
                  <select
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Location</option>
                    <option value="Location 1">Location 1</option>
                    <option value="Location 2">Location 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Full Name"
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Mobile Number"
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Enter Email Address"
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* User Access Section */}
              <div className="pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Access</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Enter User Name"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select User Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Please Enter Password"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Enter Confirm Password"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Choose File
                      </label>
                      <span className="text-sm text-gray-500">
                        {formData.photo ? formData.photo.name : 'No file chosen'}
                      </span>
                    </div>
                    {photoPreview && (
                      <div className="mt-2">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="allowLogin"
                        checked={formData.allowLogin}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Allow Login</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Is Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;