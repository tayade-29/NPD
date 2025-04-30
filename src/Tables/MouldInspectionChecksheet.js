import React, { useState } from 'react';
import CoreCavity from './CoreCavityTable';
import FeedingSystem from './FeedingSystemTable';
import GeneralTable from './GeneralTable';
import MouldMaterial from './MouldMaterialRelated';

const MouldInspectionChecksheet = () => {
  const [activeTab, setActiveTab] = useState('corecavity');
  
  const tabs = [
    { id: 'corecavity', label: 'Core & Cavity', component: <CoreCavity /> },
    { id: 'feedingsystem', label: 'Feeding System', component: <FeedingSystem /> },
    { id: 'general', label: 'General', component: <GeneralTable /> },
    { id: 'mouldmaterial', label: 'Mould Material', component: <MouldMaterial /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-medium text-gray-800 mb-6 text-center">Mould Inspection Checksheet</h1>

        {/* Centered Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1.5 shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'text-gray-900 bg-gray-100 border-b-2 border-gray-700'
                    : 'text-gray-600 hover:bg-gray-50'}
                  focus:outline-none focus:ring-2 focus:ring-gray-300 first:rounded-l-md last:rounded-r-md`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                {tabs.find(tab => tab.id === activeTab)?.component || (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a tab to view content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MouldInspectionChecksheet;