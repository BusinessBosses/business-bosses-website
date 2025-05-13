import React from 'react';
import { SetupItemType } from './setupItems';


interface SetupDetailProps {
  item: SetupItemType | null;
}

const SetupDetail: React.FC<SetupDetailProps> = ({ item }) => {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Select an item to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="text-blue-500">{item.icon}</div>
        <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          {item.content}
        </div>
      </div>
    </div>
  );
};

export default SetupDetail;