import React, { useState } from "react";
import { Pencil, Save, PlusCircle, XCircle } from "lucide-react";
import { useAddCustomerMutation } from '../features/api/apiSlice';
import { useAuth } from '../context/AuthContext';

const initialCustomers = [
  {
    id: "CUST001",
    name: "John Doe",
    address: "123 Street, New York",
    contactPerson: "Michael Smith",
    mobile: "+1 234 567 890",
    email: "johndoe@example.com",
    status: "active",
  },
  {
    id: "CUST002",
    name: "Jane Smith",
    address: "456 Avenue, Los Angeles",
    contactPerson: "Sarah Johnson",
    mobile: "+1 987 654 321",
    email: "janesmith@example.com",
    status: "inactive",
  },
];

const CustomerPage = () => {
  const { userData } = useAuth();
  const [customers, setCustomers] = useState(initialCustomers);
  const [editId, setEditId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    pPkCustomerId: 0,
    pFkClientID: userData?.clientId || 0, // Get clientId from userData
    pFkPlantId: userData?.plantId || 0,   // Get plantId from userData
    pCustomerCode: "",
    pCustomerName: "",
    pAddress: "",
    pContactPerson: "",
    pPhoneNo: "",
    pEmailId: "",
    pCreatedBy: userData?.userId || 1,    // Get userId from userData
    pIsActive: 1
  });

  const [addCustomer, { isLoading }] = useAddCustomerMutation();

  const handleChange = (e, field, id) => {
    setEditedCustomer({
      ...editedCustomer,
      [id]: {
        ...editedCustomer[id],
        [field]: e.target.value,
      },
    });
  };

  const handleSave = (id) => {
    setCustomers(
      customers.map((cust) =>
        cust.id === id ? { ...cust, ...editedCustomer[id] } : cust
      )
    );
    setEditId(null);
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setNewCustomer(prev => ({
      ...prev,
      pIsActive: e.target.value === "active" ? 1 : 0
    }));
  };

  const handleAddCustomer = async () => {
    if (!userData) {
      alert("Authentication data not available. Please log in again.");
      return;
    }

    if (
      !newCustomer.pCustomerName ||
      !newCustomer.pAddress ||
      !newCustomer.pContactPerson ||
      !newCustomer.pPhoneNo ||
      !newCustomer.pEmailId
    ) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      // Generate a simple customer code
      const customerCode = `CUST${Math.floor(Math.random() * 10000)}`;
      
      const response = await addCustomer({
        ...newCustomer,
        pCustomerCode: customerCode,
        pFkClientID: userData.clientId,
        pFkPlantId: userData.plantId,
        pCreatedBy: userData.userId
      }).unwrap();

      console.log('Customer added successfully:', response);

      // Add the new customer to the local state
      const newCustomerEntry = {
        id: customerCode,
        name: newCustomer.pCustomerName,
        address: newCustomer.pAddress,
        contactPerson: newCustomer.pContactPerson,
        mobile: newCustomer.pPhoneNo,
        email: newCustomer.pEmailId,
        status: newCustomer.pIsActive === 1 ? 'active' : 'inactive'
      };

      setCustomers([...customers, newCustomerEntry]);
      
      // Reset form and close modal
      setNewCustomer({
        pPkCustomerId: 0,
        pFkClientID: userData.clientId,
        pFkPlantId: userData.plantId,
        pCustomerCode: "",
        pCustomerName: "",
        pAddress: "",
        pContactPerson: "",
        pPhoneNo: "",
        pEmailId: "",
        pCreatedBy: userData.userId,
        pIsActive: 1
      });
      setShowForm(false);
      
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Failed to add customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  };

  const RadioGroup = ({ value, onChange, name, disabled = false }) => (
    <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-lg w-fit">
      <label className={`flex items-center space-x-1 cursor-pointer ${disabled && 'cursor-not-allowed'}`}>
        <input
          type="radio"
          name={name}
          value="active"
          checked={value === "active"}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${value === "active" ? "bg-green-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"} ${disabled && 'opacity-50'}`}>
          Active
        </div>
      </label>

      <label className={`flex items-center space-x-1 cursor-pointer ${disabled && 'cursor-not-allowed'}`}>
        <input
          type="radio"
          name={name}
          value="inactive"
          checked={value === "inactive"}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${value === "inactive" ? "bg-red-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"} ${disabled && 'opacity-50'}`}>
          Inactive
        </div>
      </label>
    </div>
  );

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Please log in to access the customer list</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customer List</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Customer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === customer.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedCustomer[customer.id]?.name || customer.name}
                          onChange={(e) => handleChange(e, 'name', customer.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{customer.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === customer.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedCustomer[customer.id]?.address || customer.address}
                          onChange={(e) => handleChange(e, 'address', customer.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{customer.address}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === customer.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedCustomer[customer.id]?.contactPerson || customer.contactPerson}
                          onChange={(e) => handleChange(e, 'contactPerson', customer.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{customer.contactPerson}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === customer.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedCustomer[customer.id]?.mobile || customer.mobile}
                          onChange={(e) => handleChange(e, 'mobile', customer.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{customer.mobile}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === customer.id ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={editedCustomer[customer.id]?.email || customer.email}
                          onChange={(e) => handleChange(e, 'email', customer.id)}
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{customer.email}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-sm rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editId === customer.id ? (
                        <button
                          onClick={() => handleSave(customer.id)}
                          className="flex items-center text-white bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditId(customer.id)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Customer</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  name="pCustomerName"
                  value={newCustomer.pCustomerName}
                  onChange={handleNewCustomerChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Customer Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="pAddress"
                  value={newCustomer.pAddress}
                  onChange={handleNewCustomerChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="pContactPerson"
                  value={newCustomer.pContactPerson}
                  onChange={handleNewCustomerChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Contact Person"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                <input
                  type="text"
                  name="pPhoneNo"
                  value={newCustomer.pPhoneNo}
                  onChange={handleNewCustomerChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Phone No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  name="pEmailId"
                  value={newCustomer.pEmailId}
                  onChange={handleNewCustomerChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Email ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <RadioGroup
                  name="status"
                  value={newCustomer.pIsActive === 1 ? "active" : "inactive"}
                  onChange={handleStatusChange}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;