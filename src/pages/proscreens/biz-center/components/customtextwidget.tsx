import React from "react";

interface CustomTextWidgetProps {
  caption: string;
  iconName: string;
  text?: string;
  hasHint?: boolean;
  backgroundColor?: string;
  padding?: string;
  textPadding?: string;
  isSupplier?: boolean;
  buttonText?: string;
  selectedArea?: React.ReactNode;
  iconColor?: string;
  onButtonClick?: () => void;
}

const CustomTextWidget: React.FC<CustomTextWidgetProps> = ({
  caption,
  iconName,
  text = "",
  hasHint = false,
  backgroundColor = "bg-white",
  padding = "0px",
  textPadding = "5px",
  isSupplier = false,
  buttonText,
  selectedArea,
  iconColor,
  onButtonClick,
}) => {
  return (
    <div
      className={`px-4`}
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <div className={`${backgroundColor} rounded-lg p-4`}>
        <div className="flex flex-col space-y-4">
          {/* Caption */}
          <p className="text-sm font-semibold text-gray-800">{caption}</p>

          {/* Content row */}
          <div className="flex items-center justify-between">
            {/* Text content */}
            <p className="text-sm text-gray-800 flex-1">
              {text || (hasHint ? "" : " ")}
            </p>

            {/* Right side - either button or icon */}
            {isSupplier ? (
              <button
                onClick={onButtonClick}
                className={`
                  h-12 px-5 py-2 bg-blue-600 hover:bg-blue-700
                  text-white text-base rounded-lg
                  transition-colors duration-200
                  flex items-center justify-center
                `}
              >
                {buttonText}
              </button>
            ) : (
              <img
                src={iconName}
                alt="icon"
                className="w-5 h-5"
                style={iconColor ? { color: iconColor } : {}}
              />
            )}
          </div>

          {/* Selected area */}
          {selectedArea && <div className="mt-2">{selectedArea}</div>}
        </div>
      </div>
    </div>
  );
};

export default CustomTextWidget;
