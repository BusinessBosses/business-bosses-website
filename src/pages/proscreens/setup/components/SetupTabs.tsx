import React from 'react';
import { SetupItemType } from './setupItems';


interface SetupTabsProps {
  items: SetupItemType[];
  activeItemId: string;
  onTabSelect: (id: string) => void;
}

const SetupTabs: React.FC<SetupTabsProps> = ({ items, activeItemId, onTabSelect }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            className={`flex items-center px-4 py-3 whitespace-nowrap font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeItemId === item.id
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
            onClick={() => onTabSelect(item.id)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SetupTabs;