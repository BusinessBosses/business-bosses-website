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
      <div className="flex items-center space-x-2">
        {discount && discount > 0 ? (
          <>
            <div className="font-bold text-sm text-red-500">
              {currencySymbol}
              {(price * (1 - discount / 100) * 100).toFixed(2)}
            </div>
            <div className="text-gray-500 line-through">
              {currencySymbol}
              {price.toFixed(2)}
            </div>
          </>
        ) : (
          <div className="font-bold text-sm">
            {currencySymbol}
            {price?.toFixed(2)}
          </div>
        )}
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
          Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
