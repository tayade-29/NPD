import React, { useState } from 'react';
import CoreCavityTable from '../Tables/CoreCavityTable';
import FeedingSystemTable from '../Tables/FeedingSystemTable';
import MouldMaterialRelatedTable from '../Tables/MouldMaterialRelated';
import GeneralTable from '../Tables/GeneralTable';

const MouldInspectionChecksheet = () => {
  const [openTable, setOpenTable] = useState(null);

  const toggleTable = (tableName) => {
    setOpenTable(prev => (prev === tableName ? null : tableName));
  };

  // Reusable button style
  const buttonClass =
    "bg-blue-900 text-white text-center py-3 px-6 rounded-xl shadow-md cursor-pointer hover:bg-blue-700 transition-colors duration-200";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-600 mb-6">Mould Inspection Checksheet</h1>

      <div className="space-y-4">

        {/* Core & Cavity */}
        <div className={buttonClass} onClick={() => toggleTable("coreCavity")}>
          Core & Cavity Table
        </div>
        {openTable === "coreCavity" && (
          <div className="transition-all duration-300 ease-in-out">
            <CoreCavityTable />
          </div>
        )}

        {/* Feeding System */}
        <div className={buttonClass} onClick={() => toggleTable("feedingSystem")}>
          Feeding System Table
        </div>
        {openTable === "feedingSystem" && (
          <div className="transition-all duration-300 ease-in-out">
            <FeedingSystemTable />
          </div>
        )}

        {/* General Table */}
        <div className={buttonClass} onClick={() => toggleTable("general")}>
          General Table
        </div>
        {openTable === "general" && (
          <div className="transition-all duration-300 ease-in-out">
            <GeneralTable />
          </div>
        )}

        {/* Mould Material Related */}
        <div className={buttonClass} onClick={() => toggleTable("mouldMaterial")}>
          Mould Material Related Table
        </div>
        {openTable === "mouldMaterial" && (
          <div className="transition-all duration-300 ease-in-out">
            <MouldMaterialRelatedTable />
          </div>
        )}

      </div>
    </div>
  );
};

export default MouldInspectionChecksheet;
