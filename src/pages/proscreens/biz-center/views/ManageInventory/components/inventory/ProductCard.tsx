import React from "react";

import { Product } from "../../types/Product";
import { FiMapPin } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  myShop?: boolean;
  marketplace?: boolean;
  onEdit?: () => void;
  onBoost?: () => void;
  onDelete?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  myShop = false,
  marketplace = false,
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete && onDelete();
    }
  };

  const getCurrencySymbol = (location: string) => {
    const currencyMap: { [key: string]: string } = {
      "United States": "$",
      "United Kingdom": "£",
      "European Union": "€",
      // Add more currency mappings as needed
      default: "$",
    };

    return currencyMap[location] || currencyMap.default;
  };

  return (
    <div
      className="p-2.5 bg-white rounded-2xl border border-black/10 flex flex-col"
      onClick={onClick}
    >
      {/* Product Image */}
      {product.images && (
        <div className="h-32 w-full mb-1.5">
          <div className="h-full w-full rounded-xl overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {/* Product Name and Price */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 truncate">
            {product.name}
          </h3>

          {/* {product.comparePrice ? (
            <div className="flex items-center">
              <span className="text-sm font-bold">
                {getCurrencySymbol(product.location || "default")}
                {formatPrice(
                  product.price * (1 - (product.discountPercentage || 0) / 100)
                )}
              </span>
              <span className="ml-1 text-xs line-through text-purple-700">
                {getCurrencySymbol(product.location || "default")}
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold">
              {getCurrencySymbol(product.location || "default")}
              {formatPrice(product.price)}
            </span>
          )} */}
        </div>

        {/* Description or Location/Rating */}
        {!myShop ? (
          <div className="flex justify-between items-center">
            <p className="text-xs line-clamp-2 flex-grow">
              {product.description}
            </p>
            {!marketplace && (
              <button className="px-1.5 py-0.5 border border-purple-700 rounded-md text-xs font-bold text-purple-700">
                Order
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <p className="text-xs line-clamp-2 flex-grow">
              {product.description}
            </p>
            <div className="flex space-x-1">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
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
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Location, Rating and Order Button for Marketplace */}
        {marketplace && (
          <div className="flex justify-between items-center mt-1.5">
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 text-gray-500" />
              <span className="ml-1 text-xs font-bold">
                {product.location || "N/A"}
              </span>
            </div>

            {/* <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="ml-1 text-xs font-bold">
                {product.rating?.toFixed(1) || "0.0"}
              </span>
            </div> */}

            <button
              onClick={(e) => {
                e.stopPropagation(); /* Handle order */
              }}
              className="px-1.5 py-0.5 border border-purple-700 rounded-md text-xs font-bold text-purple-700"
            >
              Order
            </button>
          </div>
        )}

        {/* Order Button for non-marketplace shops when not myShop */}
        {!myShop && !marketplace && (
          <div className="flex justify-end mt-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation(); /* Handle order */
              }}
              className="px-1.5 py-0.5 border border-purple-700 rounded-md text-xs font-bold text-purple-700"
            >
              Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
