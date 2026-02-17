import React, { useState, useEffect } from "react";

interface CustomTabBarWidgetProps<T> {
  activeTab: number;
  setActiveTab: (index: number) => void;
  scrollToSection: (index: number) => void;
  proprimaryColor: string;
  backgroundColor: string[]; // Array of background colors for inactive tabs
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
    <div className="w-full">
      <div className="w-full px-4 py-2.5 bg-white border border-bg-gray-100 rounded-xl">
        <div className="flex overflow-x-auto scrollbar-hidden w-full">
          {listofitems.map((item, index) => (
            <div key={index} className="flex-shrink-0 mr-2 last:mr-0">
              <button
                onClick={() => handleTabClick(index)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === index
                    ? `text-white bg-${proprimaryColor}` // Use primary color for active tab
                    : `text-gray-800 ${backgroundColor[index] || "bg-gray-100"}` // Use provided background color or default
                }`}
                style={{
                  backgroundColor:
                    activeTab === index
                      ? proprimaryColor
                      : backgroundColor[index] || "#f3f4f6", // Fallback to gray-100 if not provided
                }}
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
