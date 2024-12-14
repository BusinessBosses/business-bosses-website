import React from "react";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  discount?: number;
  description: string;
  onCardClick: () => void;
  onOrderClick: () => void;
  currencySymbol?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  discount,
  description,
  onCardClick,
  onOrderClick,
  currencySymbol = "CAD",
}) => {
  const discountedPrice = discount ? price - (price * discount) / 100 : null;

  return (
    <div
      className="border rounded-lg p-4 shadow-xs cursor-pointer hover:shadow-md transition"
      onClick={onCardClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          className="w-full h-48 object-cover mb-4 rounded-xl"
        />
      )}
      <div className="text-md font-semibold ">{title}</div>
      <div className="flex items-baseline">
        <p className="text-blue-500 font-medium mb-2 mr-2">
          {currencySymbol}
          {price}
        </p>
        {discountedPrice && (
          <p className="text-sm text-gray-500 line-through mb-2">
            {currencySymbol}
            {price}
          </p>
        )}
      </div>

      {discountedPrice && (
        <p className="text-sm text-green-500 mb-2">
          Discounted Price: {currencySymbol}
          {discountedPrice.toFixed(2)} ({discount}% off)
        </p>
      )}

      <p className="text-gray-700 text-sm line-clamp-2 mb-4">{description}</p>

      <button
        className="px-2.5 py-1 text-xs hover:text-white text-primary bg-transparent rounded-full hover:bg-red-600 border-primary border-[1.5px] focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onOrderClick();
        }}
      >
        Order
      </button>
    </div>
  );
};

export default ProductCard;
