import React from 'react';
import SetupItem from './SetupItem';
import { SetupItemType } from './setupItems';


interface SetupListProps {
  items: SetupItemType[];
  activeItemId: string;
  onItemSelect: (id: string) => void;
}

const SetupList: React.FC<SetupListProps> = ({ 
  items, 
  activeItemId, 
  onItemSelect 
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Setup</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) => (
          <SetupItem
            key={item.id}
            id={item.id}
            title={item.title}
            icon={item.icon}
            isActive={activeItemId === item.id}
            onClick={() => onItemSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SetupList;