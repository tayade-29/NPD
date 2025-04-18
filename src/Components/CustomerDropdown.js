import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader } from 'lucide-react';

const CustomerDropdown = ({ 
  selectedCustomer, 
  onCustomerSelect, 
  customers = [], 
  isLoading,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCustomerSelect = (customer) => {
    onCustomerSelect({
      id: customer.DataValueField,
      name: customer.DataTextField
    });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        disabled={isLoading}
      >
        <span className={`${!selectedCustomer ? 'text-gray-500' : 'text-gray-900'}`}>
          {selectedCustomer || 'Select Customer'}
        </span>
        <div className="flex items-center">
          {isLoading ? (
            <Loader className="h-4 w-4 text-gray-400 animate-spin" />
          ) : isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
          {error ? (
            <div className="p-3 text-red-500 text-sm">
              Failed to load customers. Please try again.
            </div>
          ) : customers.length === 0 && !isLoading ? (
            <div className="p-3 text-gray-500 text-sm">
              No customers available
            </div>
          ) : (
            customers.map((customer, index) => (
              <div
                key={customer.DataValueField || index}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm transition-colors duration-150"
                onClick={() => handleCustomerSelect(customer)}
              >
                {customer.DataTextField}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;