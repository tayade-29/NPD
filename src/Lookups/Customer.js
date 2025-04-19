import React, { useState } from 'react';
import { Pencil, PlusCircle, XCircle, Search } from 'lucide-react';
import { useAddCustomerMutation, useGetCustomerQuery, useCheckDuplicateCustomerMutation } from '../features/api/apiSlice';
import { useAuth } from '../context/AuthContext';

function App() {
  const { userData } = useAuth();
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    pPkCustomerId: 0,
    pFkClientID: userData?.ClientId || 1,
    pFkPlantId: userData?.PlantId || 1,
    pCustomerCode: "",
    pCustomerName: "",
    pAddress: "",
    pContactPerson: "",
    pPhoneNo: "",
    pEmailId: "",
    pCreatedBy: userData?.RoleId || 1,
    pIsActive: 1
  });

  const {
    data: customers = [],
    isLoading,
    error,
    refetch
  } = useGetCustomerQuery({
    pAction: 0,
    pLookUpId: 0,
    pFkClientId: userData?.ClientId || 1,
    pFkPlantId: userData?.PlantId || 1
  });

  const [addCustomer, { isLoading: isAddingCustomer }] = useAddCustomerMutation();
  const [checkDuplicate] = useCheckDuplicateCustomerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.checked ? 1 : 0;
    setNewCustomer(prev => ({ ...prev, pIsActive: value }));
  };

  const handleEdit = (customer) => {
    setEditId(customer.pPkCustomerId);
    setNewCustomer({
      pPkCustomerId: customer.pPkCustomerId,
      pFkClientID: userData?.ClientId || 1,
      pFkPlantId: userData?.PlantId || 1,
      pCustomerCode: customer.CustomerCode || "",
      pCustomerName: customer.CustomerName || "",
      pAddress: customer.Address || "",
      pContactPerson: customer.ContactPerson || "",
      pPhoneNo: customer.PhoneNo || "",
      pEmailId: customer.EmailId || "",
      pCreatedBy: userData?.RoleId || 1,
      pIsActive: customer.IsActive === "Active" || customer.IsActive === 1 || customer.IsActive === "1" ? 1 : 0
    });
    setShowForm(true);
  };

  const handleAddCustomer = async () => {
    try {
      // Only check for duplicates when adding a new customer
      if (!editId) {
        const duplicateCheck = await checkDuplicate({
          pPkCustomerId: newCustomer.pPkCustomerId,
          pFkClientId: newCustomer.pFkClientID,
          pFkPlantId: newCustomer.pFkPlantId,
          pCustomerCode: newCustomer.pCustomerCode,
          pCustomerName: newCustomer.pCustomerName,
          pAddress: newCustomer.pAddress,
          pContactPerson: newCustomer.pContactPerson,
          pPhoneNo: newCustomer.pPhoneNo,
          pEmailId: newCustomer.pEmailId
        }).unwrap();

        // Check if ALL fields match exactly
        const existingCustomer = customers.find(customer =>
          customer.CustomerCode === newCustomer.pCustomerCode &&
          customer.CustomerName === newCustomer.pCustomerName &&
          customer.Address === newCustomer.pAddress &&
          customer.ContactPerson === newCustomer.pContactPerson &&
          customer.PhoneNo === newCustomer.pPhoneNo &&
          customer.EmailId === newCustomer.pEmailId
        );

        if (existingCustomer) {
          alert('A customer with exactly the same details already exists!');
          return;
        }
      }

      const result = await addCustomer(newCustomer).unwrap();

      if (result?.success === false) {
        throw new Error(result.message || 'Operation failed');
      }

      setNewCustomer({
        pPkCustomerId: 0,
        pFkClientID: userData?.ClientId || 1,
        pFkPlantId: userData?.PlantId || 1,
        pCustomerCode: "",
        pCustomerName: "",
        pAddress: "",
        pContactPerson: "",
        pPhoneNo: "",
        pEmailId: "",
        pCreatedBy: userData?.RoleId || 1,
        pIsActive: 1
      });

      setShowForm(false);
      setEditId(null);
      await refetch();

      alert(editId ? "Customer updated successfully!" : "Customer added successfully!");
    } catch (error) {
      console.error("Customer operation failed:", error);
      alert(error.message || 'Operation failed. Please try again.');
    }
  };


  const filteredCustomers = customers.filter(customer =>
    [customer.CustomerName, customer.CustomerCode, customer.ContactPerson]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );



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
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customer Management</h2>
          <div className="flex-1 mx-10">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search customer by name"
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
              setNewCustomer({
                pPkCustomerId: 0,
                pFkClientID: userData?.ClientId || 1,
                pFkPlantId: userData?.PlantId || 1,
                pCustomerCode: "",
                pCustomerName: "",
                pAddress: "",
                pContactPerson: "",
                pPhoneNo: "",
                pEmailId: "",
                pCreatedBy: userData?.RoleId || 1,
                pIsActive: 1
              });
              setShowForm(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Customer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="overflow-hidden">
            <div className="max-h-[calc(100vh-250px)] overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-16">Sr No.</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-32">Code</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-48">Name</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-48">Address</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-40">Contact</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-32">Phone</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-48">Email</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-24">Status</th>
                    <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {filteredCustomers.map((customer, index) => {

                    const isActive = customer.IsActive === "Active" || customer.IsActive === 1 || customer.IsActive === "1";
                    return (
                      <tr key={customer.pPkCustomerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm w-16">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm w-32">{customer.CustomerCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-48">
                          {customer.CustomerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-48">{customer.Address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-40">{customer.ContactPerson}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-32">{customer.PhoneNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-48">{customer.EmailId}</td>
                        <td className="px-6 py-4 whitespace-nowrap w-24">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm w-24">
                          <button
                            onClick={() => handleEdit(customer)}
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
                    {editId ? 'Edit Customer' : 'New Customer'}
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
                      Customer Code
                    </label>
                    <input
                      type="text"
                      name="pCustomerCode"
                      value={newCustomer.pCustomerCode}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="pCustomerName"
                      value={newCustomer.pCustomerName}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="pAddress"
                      value={newCustomer.pAddress}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="pContactPerson"
                      value={newCustomer.pContactPerson}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="pPhoneNo"
                      value={newCustomer.pPhoneNo}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="pEmailId"
                      value={newCustomer.pEmailId}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="form-group">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status"
                        checked={newCustomer.pIsActive === 1}
                        onChange={handleStatusChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="status" className="ml-2 block text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
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
                    onClick={handleAddCustomer}
                    disabled={isAddingCustomer}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isAddingCustomer ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                  >
                    {isAddingCustomer
                      ? 'Saving...'
                      : editId
                        ? 'Update Changes'
                        : 'Create Customer'}
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