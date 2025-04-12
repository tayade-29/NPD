import React, { useState } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useAddCustomerMutation, useGetCustomerQuery } from '../features/api/apiSlice';

const CustomerPage = () => {
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    pPkCustomerId: 0,
    pFkClientID: 1,
    pFkPlantId: 1,
    pCustomerCode: "",
    pCustomerName: "",
    pAddress: "",
    pContactPerson: "",
    pPhoneNo: "",
    pEmailId: "",
    pCreatedBy: 1,
    pIsActive: 0
  });

  // Query for getting all customers
  const { 
    data: customers = [], 
    isLoading, 
    error,
    refetch 
  } = useGetCustomerQuery({
    pLookUpId: 0,
    pFkClientId: 1,
    pFkPlantId: 1
  });

  // Mutation for adding/updating customer
  const [addCustomer, { isLoading: isAddingCustomer }] = useAddCustomerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    setNewCustomer(prev => ({
      ...prev,
      pIsActive: e.target.value === "active" ? 1 : 0
    }));
  };

  const handleEdit = (customer) => {
    setEditId(customer.pPkCustomerId);
    setNewCustomer({
      ...customer,
      pFkClientID: 1,
      pFkPlantId: 1,
      pCreatedBy: 1,
    });
    setShowForm(true);
  };

  const handleAddCustomer = async () => {
    try {
      const result = await addCustomer(newCustomer).unwrap();
      
      if (result?.success === false) {
        throw new Error(result.message || 'Operation failed');
      }

      // Reset form
      setNewCustomer({
        pPkCustomerId: 0,
        pFkClientID: 1,
        pFkPlantId: 1,
        pCustomerCode: "",
        pCustomerName: "",
        pAddress: "",
        pContactPerson: "",
        pPhoneNo: "",
        pEmailId: "",
        pCreatedBy: 1,
        pIsActive: 0
      });
      
      setShowForm(false);
      setEditId(null);
      
      // Refresh the customer list
      await refetch();
      
      alert(editId ? "Customer updated successfully!" : "Customer added successfully!");
    } catch (error) {
      console.error("Customer operation failed:", error);
      alert(error.message || 'Operation failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Loading customers...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-800">
            Error loading customers
          </h2>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customer Management</h2>
          <button
            onClick={() => {
              setEditId(null);
              setNewCustomer({
                pPkCustomerId: 0,
                pFkClientID: 1,
                pFkPlantId: 1,
                pCustomerCode: "",
                pCustomerName: "",
                pAddress: "",
                pContactPerson: "",
                pPhoneNo: "",
                pEmailId: "",
                pCreatedBy: 1,
                pIsActive: 0
              });
              setShowForm(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.pPkCustomerId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.pCustomerCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.CustomerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.Address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.ContactPerson}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.PhoneNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.EmailId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.IsActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editId ? 'Edit Customer' : 'New Customer'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Code
                </label>
                <input
                  type="text"
                  name="pCustomerCode"
                  value={newCustomer.pCustomerCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="pCustomerName"
                  value={newCustomer.pCustomerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="pAddress"
                  value={newCustomer.pAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />A
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="pContactPerson"
                  value={newCustomer.pContactPerson}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="pPhoneNo"
                  value={newCustomer.pPhoneNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="pEmailId"
                  value={newCustomer.pEmailId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newCustomer.pIsActive ? "active" : "inactive"}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={isAddingCustomer}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                  isAddingCustomer ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isAddingCustomer ? 'Saving...' : editId ? 'Save Changes' : 'Create Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;