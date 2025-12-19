import React, { useState } from "react";

import { ChevronLeft } from "@mui/icons-material";
import { FiCrosshair, FiFilter, FiPlusCircle, FiSearch } from "react-icons/fi";
import ServiceCard from "../../components/servicecard";
import CreateService from "./components/CreateService";
import ProCustomButton from "../../components/procustombutton";
import Assets from "../../../../../assets";

const MyService: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  const filterOptions = [
    "All Services",
    "Low Stock",
    "Out of Stock",
    "Most Popular",
    "Newest First",
  ];

  const handleFilterSelect = (option: string) => {
    console.log(`Filter selected: ${option}`);
    setFilterMenuOpen(false);
  };

  const [filteredServices] = useState([
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      ],
      name: "Service A",
      stock: 10,
      popular: true,
      createdAt: new Date("2024-01-01"),
      price: 19.99,
      description: "A great service A",
      category: "Category 1",
      itemType: "Type 1",
      isActive: true,
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      ],
      name: "Service B",
      stock: 0,
      popular: false,
      createdAt: new Date("2024-02-01"),
      price: 29.99,
      description: "A great service B",
      category: "Category 2",
      itemType: "Type 2",
      isActive: false,
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      ],
      name: "Service C",
      stock: 2,
      popular: true,
      createdAt: new Date("2024-03-01"),
      price: 39.99,
      description: "A great service C",
      category: "Category 3",
      itemType: "Type 3",
      isActive: true,
    },
  ]);

  return (
    <div className="min-h-screen scrollbar-hidden flex flex-col border border-backgroundcolor rounded-xl">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hidden">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Service
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiCrosshair className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <CreateService onComplete={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* App Bar */}
      <div className="bg-white rounded-t-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-gray-900">
              Services ({filteredServices.length})
            </h1>
          </div>
          <ProCustomButton
            text="+ Add Service"
            onPressed={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 pb-3 bg-white border-b">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <div className="pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 pl-2 w-full bg-gray-50 focus:outline-none text-gray-700"
            />
            <div className="relative">
              <button
                onClick={handleFilterClick}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 transition-colors border-l border-gray-200"
              >
                <img
                  src={Assets.filterprosections}
                  alt="Filter"
                  className="h-5 w-5 filter"
                />
              </button>

              {filterMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 border border-gray-200">
                  {filterOptions.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                      onClick={() => handleFilterSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service List */}
      <div className="flex-1 overflow-auto scrollbar-hidden">
        <div className="max-w-6xl mx-auto p-4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  isMyService={true}
                  key={service.id}
                  imageUrl={service.images[0]}
                  title={service.name}
                  price={service.price}
                  description={service.description}
                  onCardClick={() =>
                    console.log(`Service clicked: ${service.id}`)
                  }
                  onOrderClick={() =>
                    console.log(`Order clicked: ${service.id}`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-400 mb-4">
                <FiSearch className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No Services Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Add new services to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Service
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyService;
