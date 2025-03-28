import React from "react";

interface ProCustomButtonProps {
  text: string;
  icon?: React.ReactNode;
  onPressed: () => void;
  back?: boolean;
  loading?: boolean;
  color?: string;
  padding?: string;
  disabled?: boolean;
}

const ProCustomButton: React.FC<ProCustomButtonProps> = ({
  text,
  icon,
  onPressed,
  back = false,
  loading = false,
  color = "bg-blue-600", // Default color - adjust to match your theme
  padding = "15px",
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <div
      className={`${back ? "" : "px-4"}`}
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <button
        onClick={!isDisabled ? onPressed : undefined}
        disabled={isDisabled}
        className={`
          w-full h-12 flex items-center justify-center
          ${color} hover:${color.replace(/-\d+$/, "-700")} 
          text-white font-bold py-3 px-6 rounded-lg
          transition-colors duration-200
          ${isDisabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"}
        `}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            {!back && icon && <div className="flex-shrink-0">{icon}</div>}
            <span className="text-base font-bold">{text}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ProCustomButton;
