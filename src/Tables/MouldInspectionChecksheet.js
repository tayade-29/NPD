import React, { useState } from 'react';
import {useMouldInspectionChecksheekFillQuery, useLazyMouldInspectionCheckSheetTableQuery} from '../features/api/apiSliceChecklist';
import ChecksheetTable from './ChecksheetTable';

const MouldInspectionChecksheet = () => {
  const [openTable, setOpenTable] = useState(null);
  const userData = { clientId: 1, plantId: 1, locationId: 1 }; // Default user data
  
  // Fetch checksheet types for buttons
  const { 
    data: checksheetTypes, 
    isLoading: isTypesLoading, 
    error: typesError 
  } = useMouldInspectionChecksheekFillQuery(userData);

  // Lazy query for table data
  const [
    getTableData, 
    { 
      data: tableData, 
      isLoading: isTableLoading, 
      error: tableError,
      isFetching: isTableFetching
    }
  ] = useLazyMouldInspectionCheckSheetTableQuery();

  const toggleTable = (dataValueField, dataTextField) => {
    if (openTable === dataValueField) {
      setOpenTable(null);
    } else {
      setOpenTable(dataValueField);
      getTableData({ userData, lookupId: dataValueField });
    }
  };

  // Get current table title
  const getCurrentTableTitle = () => {
    if (!checksheetTypes) return '';
    const currentType = checksheetTypes.find(type => type.DataValueField === openTable);
    return currentType ? currentType.DataTextField : '';
  };

  // Reusable button style
  const buttonClass = "bg-gray-700 text-white text-center py-3 px-6 rounded-md shadow-md cursor-pointer hover:bg-gray-600 transition-colors duration-200 flex justify-between items-center";

  if (isTypesLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mould Inspection Checksheet</h1>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-300 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (typesError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mould Inspection Checksheet</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading checksheet types. Please refresh the page and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mould Inspection Checksheet</h1>

      <div className="space-y-4">
        {checksheetTypes && checksheetTypes.length > 0 && checksheetTypes
          .filter(type => type.DataValueField !== 0) // Filter out the 'Select' option
          .map((type) => (
            <div key={type.DataValueField}>
              <div 
                className={buttonClass} 
                onClick={() => toggleTable(type.DataValueField, type.DataTextField)}
              >
                <span>{type.DataTextField}</span>
                <span>{openTable === type.DataValueField ? '▲' : '▼'}</span>
              </div>
              
              {openTable === type.DataValueField && (
                <div className="border border-gray-300 rounded-b-lg p-4 mb-4 bg-white shadow-inner animate-slide-down">
                  <ChecksheetTable 
                    data={tableData} 
                    title={type.DataTextField}
                    isLoading={isTableLoading || isTableFetching}
                    error={tableError}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
      
      {(!checksheetTypes || checksheetTypes.length === 0) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No checksheet types available. Please check your configuration.
        </div>
      )}
    </div>
  );
};

export default MouldInspectionChecksheet;