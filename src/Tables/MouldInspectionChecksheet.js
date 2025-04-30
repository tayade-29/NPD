import React from 'react';
import { Link } from 'react-router-dom'; // make sure you're using react-router-dom

const MouldInspectionChecksheet = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-600 mb-6">Mould Inspection Checksheet</h1>

      <div className="space-y-4">
        <Link to="/core-cavity" className="block bg-gray-200 text-black text-center py-3 rounded-xl shadow-md hover:bg gray-600">
          Core & Cavity Table
        </Link>

        <Link to="/feeding-system" className="block bg-gray-200 text-black text-center py-3 rounded-xl shadow-md hover:bg-gray-600">
          Feeding System Table
        </Link>

        <Link to="/general" className="block bg-gray-200 text-black text-center py-3 rounded-xl shadow-md hover:bg-gray-600">
          General Table
        </Link>

        <Link to="/mouldmaterialrelated" className="block bg-gray-200 text-black text-center py-3 rounded-xl shadow-md hover:bg-gray-600">
          Mould Material Related Table
        </Link>
      </div>
    </div>
  );
};

export default MouldInspectionChecksheet;
