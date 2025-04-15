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
    <div className="relative">
      <div className="px-2.5 pb-2.5 ml-2.5 mr-2.5">
        <div className="w-full px-2.5 py-2.5 bg-white border border-backgroundcolor rounded-[10px]">
          <div className="flex overflow-x-auto scrollbar-hide">
            {listofitems.map((item, index) => (
              <div key={index} className="mr-2 last:mr-10">
                <button
                  onClick={() => handleTabClick(index)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                    activeTab === index
                      ? index === 0
                        ? "bg-gray-700 text-white"
                        : `bg-[${backgroundColor[index]}] text-white`
                      : `bg-[${backgroundColor[index]}] text-gray-800`
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === index
                        ? index === 0
                          ? "#6b7280" 
                          : backgroundColor[index]
                        : `${backgroundColor[index]}80`, 
                    color: activeTab === index ? "black" : "#1f2937", 
                  }}
                >
                  {index === 0 ? "All" : itemToString(item)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTabBarWidget;
