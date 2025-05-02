import React, { useState, useEffect } from "react";

interface CustomTabBarWidgetProps<T> {
  activeTab: number;
  setActiveTab: (index: number) => void;
  scrollToSection: (index: number) => void;
  proprimaryColor: string;
  backgroundColor: string[];
  listofitems: T[];
  itemToString: (item: T) => string;
  selectedFilter?: string;
  filterOptions?: string[];
  initialposition?: number;
  filterontap?: () => void;
  onFilterSelected?: (filter: string | null) => void;
}

const CustomTabBarWidget = <T,>({
  activeTab,
  setActiveTab,
  scrollToSection,
  proprimaryColor,
  backgroundColor,
  listofitems,
  itemToString,
  selectedFilter,
  filterOptions,
  initialposition,
  filterontap,
  onFilterSelected,
}: CustomTabBarWidgetProps<T>) => {
  const [localSelectedFilter, setLocalSelectedFilter] =
    useState(selectedFilter);

  useEffect(() => {
    if (initialposition !== undefined) {
      setActiveTab(initialposition);
    }
  }, [initialposition, setActiveTab]);

  useEffect(() => {
    setLocalSelectedFilter(selectedFilter);
  }, [selectedFilter]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    scrollToSection(index);
  };

  return (
    <div className=" w-full">
      <div className="w-full px-4 py-2.5 bg-white border border-bg-gray-100 rounded-xl">
        <div className="flex overflow-x-auto scrollbar-hidden w-full">
          {listofitems.map((item, index) => (
            <div key={index} className="flex-shrink-0 mr-2 last:mr-0">
              <button
                onClick={() => handleTabClick(index)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === index
                    ? "text-white bg-gray-600"
                    : "text-gray-800 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {index === 0 ? "All" : itemToString(item)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTabBarWidget;
