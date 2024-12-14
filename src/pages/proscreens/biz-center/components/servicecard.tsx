import React from "react";

interface ServiceCardProps {
  imageUrl: string;
  title: string;
  price: number;
  discount?: number;
  description: string;
  onCardClick: () => void;
  onOrderClick: () => void;
  currencySymbol?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
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
      className="border rounded-lg p-2.5 shadow-xs cursor-pointer hover:shadow-sm transition"
      onClick={onCardClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          className="w-full h-48 object-cover mb-4 rounded-xl"
        />
      )}
      <div className="text-xs font-semibold ">{title}</div>
      <div className="flex items-baseline">
        {discountedPrice !== null && (
          <p className="text-blue-500 font-medium text-xs mb-2 mr-2">
            {currencySymbol}
            {discountedPrice.toFixed(2)}
          </p>
        )}
        <p
          className={`text-sm  mb-2 ${
            discountedPrice !== null
              ? "text-gray-500 line-through"
              : "text-blue-500 font-medium"
          }`}
        >
          {currencySymbol}
          {price.toFixed(2)}
        </p>
      </div>

      <div>
        <p className="text-gray-700 text-xs line-clamp-2 mb-4">{description}</p>

        <button
          className="px-2.5 py-1 text-[10px] fill-white font-bold hover:text-black text-white bg-black rounded-full hover:bg-white hover:border-white border-[1.5px] "
          onClick={(e) => {
            e.stopPropagation();
            onOrderClick();
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
