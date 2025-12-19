import React, { useState, useEffect } from "react";
import setupItems from "./components/setupItems";
import SetupList from "./components/SetupList";
import SetupDetail from "./components/SetupDetail";
import SetupTabs from "./components/SetupTabs";

type SetupItem = {
  id: string;
  // Add other properties as needed, e.g. title: string;
};

const Setup: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string>(setupItems[0].id);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Find the active item
  const activeItem =
    setupItems.find((item: SetupItem) => item.id === activeItemId) || null;

  // Effect to handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="md:container w-full md:p-0 h-[calc(100vh-4rem)]">
      {/* Mobile Tabs */}
      {isMobile && (
        <div className="pb-4">
          <SetupTabs
            items={setupItems}
            activeItemId={activeItemId}
            onTabSelect={setActiveItemId}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex h-full gap-6">
        {/* Left Column (hidden on mobile) */}
        {!isMobile && (
          <div className="w-1/3 h-full">
            <SetupList
              items={setupItems}
              activeItemId={activeItemId}
              onItemSelect={setActiveItemId}
            />
          </div>
        )}

        {/* Right Column (full width on mobile) */}
        <div
          className={`${
            isMobile ? "w-full" : "w-2/3"
          } h-full transition-all duration-300`}
        >
          <SetupDetail item={activeItem} />
        </div>
      </div>
    </div>
  );
};

export default Setup;
