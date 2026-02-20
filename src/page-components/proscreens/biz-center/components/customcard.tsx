import React from "react";

interface CustomCardProps {
  caption: string;
  subText: string;
  buttonText: string;
  onPressed: () => void;
  imagePath: string | { default: string };
  iconPath?: string;
  buttonVisible?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
  caption,
  subText,
  buttonText,
  onPressed,
  imagePath,
  iconPath,
  buttonVisible = true,
}) => {
  // Determine the image component based on the imagePath
  const renderImage = () => {
    if (!imagePath) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">No Image</span>
        </div>
      );
    }

    // Handle blob URLs (from file selection) and regular URLs
    if (
      typeof imagePath === "string" &&
      (imagePath.startsWith("blob:") ||
        imagePath.startsWith("http") ||
        imagePath.startsWith("/") ||
        imagePath.startsWith("./"))
    ) {
      return (
        <img
          src={imagePath}
          alt={caption}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = "placeholder-image-url";
          }}
        />
      );
    }

    // Handle imported assets (like Assets.shopplaceholder)
    if (typeof imagePath === "object" && "default" in imagePath) {
      return (
        <img
          src={imagePath.default}
          alt={caption}
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback for other cases
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">Image</span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-grey-100 border-opacity-50">
      <div className="flex items-start">
        <div className="flex-1 mr-4">
          <h3 className="text-sm font-semibold">{caption}</h3>
          <p className="text-xs text-gray-500 mt-1">{subText}</p>

          {buttonVisible && (
            <button
              onClick={onPressed}
              className="mt-3 flex shadow-md items-center bg-white px-4 py-3 rounded-md text-primary"
            >
              {iconPath && (
                <img src={iconPath} alt="" className="w-4 h-4 mr-2" />
              )}
              <span>{buttonText}</span>
            </button>
          )}
        </div>

        <div className="w-24 h-24 rounded-lg border border-grey-100 border-opacity-50 overflow-hidden">
          {renderImage()}
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
