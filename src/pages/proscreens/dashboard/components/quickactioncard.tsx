import React from "react";

interface QuickActionCardProps {
  cardName: string;
  value?: string; // Optional since not used in render
  assetLocation: string;
  color?: string; // Can be hex color or Tailwind color class
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  cardName,
  assetLocation,
  color = "black",
}) => {
  // Default color classes if using Tailwind colors
  const colorClasses: Record<string, string> = {
    black: "text-black bg-gray-100",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    // Add more colors as needed
  };

  // Use custom color if provided and not in Tailwind classes
  const customColorStyle =
    color && !colorClasses[color]
      ? { color: color, backgroundColor: `${color}10` }
      : {};

  return (
    <button className="flex flex-col items-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          colorClasses[color] || ""
        }`}
        style={customColorStyle}
      >
        <img
          src={assetLocation}
          alt={cardName}
          className="w-6 h-6"
          style={{
            filter:
              color && !colorClasses[color]
                ? `brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`
                : undefined,
          }}
        />
      </div>
      <p className="mt-2 text-xs font-bold text-center">{cardName}</p>
    </button>
  );
};

export default QuickActionCard;
