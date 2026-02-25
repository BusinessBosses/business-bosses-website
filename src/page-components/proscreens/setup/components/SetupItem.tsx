import { ChevronRight } from "@mui/icons-material";
import React from "react";

interface SetupItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SetupItem: React.FC<SetupItemProps> = ({
  title,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "hover:bg-gray-50 text-gray-700 border-l-4 border-transparent"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`${isActive ? "text-blue-500" : "text-gray-500"}`}>
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <ChevronRight
        className={`h-4 w-4 transition-transform duration-200 ${
          isActive ? "text-blue-500" : "text-gray-400"
        }`}
      />
    </div>
  );
};

export default SetupItem;
