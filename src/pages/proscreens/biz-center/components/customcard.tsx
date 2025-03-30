import React from "react";

interface CustomCardProps {
  caption: string;
  subText: string;
  buttonText: string;
  onPressed: () => void;
  imagePath: string;
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
    if (imagePath.startsWith("http")) {
      return (
        <img
          src={imagePath}
          alt={caption}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = "placeholder-image-url"; // Add your placeholder image URL
          }}
        />
      );
    } else if (imagePath.startsWith("/") || imagePath.startsWith("./")) {
      // For local images (assuming they're in the public folder or imported)
      return (
        <img
          src={imagePath}
          alt={caption}
          className="w-full h-full object-cover"
        />
      );
    } else {
      // For file paths (this would need additional handling in React)
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">Image</span>
        </div>
      );
    }
  };

  return (
    <div className="px-4">
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
    </div>
  );
};

export default CustomCard;
