import React from "react";
import { FiMapPin, FiClock } from "react-icons/fi";
import OptionsButton from "../../../../tasks/components/optionsbutton";
import { Service } from "../types/Service";

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  myShop?: boolean;
  marketplace?: boolean;
  isMyService?: boolean;
  onEdit?: () => void;
  onBoost?: () => void;
  onDelete?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onClick,
  myShop = false,
  marketplace = false,
  isMyService = false,
  onEdit,
  onBoost,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}m`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}k`;
    } else {
      return price.toFixed(2);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this service?")) {
      onDelete && onDelete();
    }
  };

  const getCurrencySymbol = (location: string) => {
    const currencyMap: { [key: string]: string } = {
      "United States": "$",
      "United Kingdom": "£",
      "European Union": "€",
      Nigeria: "₦",
      default: "₦",
    };

    return currencyMap[location] || currencyMap.default;
  };

  const discountedPrice = service.discount
    ? service.price * (1 - service.discount / 100)
    : service.price;

  return (
    <div
      className="p-2.5 bg-white rounded-2xl border border-black/10 flex flex-col h-full"
      onClick={onClick}
    >
      {/* Service Image */}
      {service.images && service.images.length > 0 && (
        <div className="h-32 w-full mb-1.5">
          <div className="h-full w-full rounded-xl overflow-hidden">
            <img
              src={service.images[0]}
              alt={service.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-grow">
        {/* Service Name and Price */}
        <div className="flex flex-col mb-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-bold text-gray-800 truncate">
              {service.name}
            </h3>
            {service.isAppointment && (
              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                Appointment
              </span>
            )}
          </div>

          {service.discount ? (
            <div className="flex items-center">
              <span className="text-sm font-bold">
                {getCurrencySymbol(service.location || "Nigeria")}
                {formatPrice(discountedPrice)}
              </span>
              <span className="ml-1 text-xs line-through text-purple-700">
                {getCurrencySymbol(service.location || "Nigeria")}
                {formatPrice(service.price)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold">
              {getCurrencySymbol(service.location || "Nigeria")}
              {formatPrice(service.price)}
            </span>
          )}
        </div>

        {/* Description and buttons */}
        <div className="flex justify-between items-start flex-grow">
          <p className="text-xs line-clamp-2 flex-grow">
            {service.description}
          </p>

          {/* Edit/Boost/Delete buttons for myShop */}
          {myShop && (
            <div className="flex space-x-1 ml-1">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-xs p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
              {onBoost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBoost();
                  }}
                  className="text-xs p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button onClick={handleDelete} className="text-xs p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Service details section */}
        <div className="flex flex-wrap gap-1 mt-1">
          {service.serviceType && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {service.serviceType}
            </span>
          )}
          {service.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {service.category}
            </span>
          )}
          {service.serviceDuration && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full flex items-center">
              <FiClock className="mr-0.5 h-3 w-3" />
              {service.serviceDuration} min
            </span>
          )}
        </div>

        {/* Location and action button section */}
        <div className="flex justify-between items-center mt-1.5">
          {/* Location for marketplace */}
          {marketplace && (
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 text-gray-500" />
              <span className="ml-1 text-xs font-bold">
                {service.location || "Nigeria"}
              </span>
            </div>
          )}

          {/* Empty div for spacing when no location is shown */}
          {!marketplace && <div className="flex-grow"></div>}

          {/* Options or Book button */}
          {isMyService ? (
            <OptionsButton />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle booking
              }}
              className="px-1.5 py-0.5 border border-purple-700 rounded-md text-xs font-bold text-purple-700"
            >
              {service.isAppointment ? "Book" : "Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
