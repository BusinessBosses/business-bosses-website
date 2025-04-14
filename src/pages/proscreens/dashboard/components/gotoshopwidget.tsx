import React from "react";
import { useNavigate } from "react-router-dom";
import { Shop } from "../../../../common/interfaces/Shop";


interface GotoshopWidgetProps {
  shop: Shop,
}

const GotoshopWidget: React.FC<GotoshopWidgetProps> = ({ shop }) => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/pro/my-shop"); 
  };

  return (
    <div className="pr-4">
      {" "}
      <div
        onClick={handleShopClick}
        className="px-3 py-2 bg-white rounded-lg cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center flex-1">
          {/* Shop Image */}
          <div className="relative h-9 w-9 rounded-lg overflow-hidden">
            {shop?.image ? (
              <img
                src={shop.image}
                alt="Shop"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {shop?.name || "My Shop"}
            </p>
            <div className="inline-flex items-center bg-gray-100 rounded px-2 py-0.5 mt-0.5">
              <span className="text-xs font-semibold text-gray-700">
                View Biz-Center
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-gray-700 ml-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side icons (commented out in original) */}
        <div className="flex items-center">
          {/* Availability button would go here */}
          {/* Add button would go here */}
        </div>
      </div>
    </div>
  );
};

export default GotoshopWidget;
