import React, { useState } from "react";
import { Pencil, Save, PlusCircle, XCircle } from "lucide-react";

const initialCustomers = [
  {
    id: "CUST001",
    name: "John Doe",
    address: "123 Street, New York",
    contactPerson: "Michael Smith",
    mobile: "+1 234 567 890",
    email: "johndoe@example.com",
  },
  {
    id: "CUST002",
    name: "Jane Smith",
    address: "456 Avenue, Los Angeles",
    contactPerson: "Sarah Johnson",
    mobile: "+1 987 654 321",
    email: "janesmith@example.com",
  },
];

const CustomerPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editId, setEditId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    id: "",
    name: "",
    address: "",
    contactPerson: "",
    mobile: "",
    email: "",
  });

  // Handle input changes for editing
  const handleChange = (e, field, id) => {
    setEditedCustomer({
      ...editedCustomer,
      [id]: {
        ...editedCustomer[id],
        [field]: e.target.value,
      },
    });
  };

  // Save updates
  const handleSave = (id) => {
    setCustomers(customers.map((cust) => (cust.id === id ? { ...cust, ...editedCustomer[id] } : cust)));
    setEditId(null);
  };

  // Handle new customer input
  const handleNewCustomerChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Add new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.address || !newCustomer.contactPerson || !newCustomer.mobile || !newCustomer.email) {
      alert("Please fill all fields!");
      return;
    }
    setCustomers([...customers, { ...newCustomer, id: `CUST00${customers.length + 1}` }]);
    setNewCustomer({ id: "", name: "", address: "", contactPerson: "", mobile: "", email: "" });
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customer List</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Customer
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="py-3 px-4 text-left">Customer ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Contact Person</th>
              <th className="py-3 px-4 text-left">Mobile No.</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b transition-all bg-gray-50 hover:bg-gray-100">
                <td className="py-3 px-4">{customer.id}</td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <input type="text" className="border p-2 w-full rounded" value={editedCustomer[customer.id]?.name || customer.name} onChange={(e) => handleChange(e, 'name', customer.id)} />
                  ) : (
                    customer.name
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <input type="text" className="border p-2 w-full rounded" value={editedCustomer[customer.id]?.address || customer.address} onChange={(e) => handleChange(e, 'address', customer.id)} />
                  ) : (
                    customer.address
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <input type="text" className="border p-2 w-full rounded" value={editedCustomer[customer.id]?.contactPerson || customer.contactPerson} on onChange={(e) => handleChange(e, 'contactPerson', customer.id)} />
                  ) : (
                    customer.contactPerson
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <input type="text" className="border p-2 w-full rounded" value={editedCustomer[customer.id]?.mobile || customer.mobile} onChange={(e) => handleChange(e, 'mobile', customer.id)} />
                  ) : (
                    customer.mobile
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <input type="text" className="border p-2 w-full rounded" value={editedCustomer[customer.id]?.email || customer.email} onChange={(e) => handleChange(e, 'email', customer.id)} />
                  ) : (
                    customer.email
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === customer.id ? (
                    <button onClick={() => handleSave(customer.id)} className="bg-green-500 text-white px-3 py-2 rounded shadow-md hover:bg-green-600">
                      <Save className="w-4 h-4 inline-block mr-1" /> Save
                    </button>
                  ) : (
                    <button onClick={() => setEditId(customer.id)} className="bg-yellow-400 text-white px-3 py-2 rounded shadow-md hover:bg-yellow-300">
                      <Pencil className="w-4 h-4 inline-block mr-1" /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Add New Customer</h2>
              <button onClick={() => setShowForm(false)}>
                <XCircle className="w-6 h-6 text-gray-600 hover:text-red-600" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(newCustomer).map((field, index) =>
                field !== "id" ? (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      name={field}
                      placeholder={`Enter ${field}`}
                      className="border p-2 w-full rounded mb-2"
                      value={newCustomer[field]}
                      onChange={handleNewCustomerChange}
                    />
                  </div>
                ) : null
              )}
            </div>
            <button onClick={handleAddCustomer} className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4 hover:bg-blue-700">Add Customer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;