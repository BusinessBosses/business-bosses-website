import React, { useEffect, useState } from "react";
import Assets from "../../../../assets"; // Adjust path as needed

type CustomDropdownProps = {
  caption: string;
  iconName?: string;
  items: string[];
  initialValue?: string;
  onChanged?: (value: string | null) => void;
  hintText?: string;
  validator?: (value: string | null) => string | undefined;
  secondarySection?: React.ReactNode;
  padding?: string;
  isOrder?: boolean;
  iconColor?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  caption,
  iconName,
  items,
  initialValue,
  onChanged,
  hintText,
  validator,
  secondarySection,
  padding = "0px",
  isOrder = false,
  iconColor,
}) => {
   const [selectedItem, setSelectedItem] = useState<string | null>(null);

 // whenever initialValue changes, re-sync it into state
 useEffect(() => {
   if (initialValue && items.includes(initialValue)) {
     setSelectedItem(initialValue);
  }
 }, [initialValue, items]);
  const [error, setError] = useState<string | undefined>();

  const handleChange = (value: string | null) => {
    setSelectedItem(value);
    if (onChanged) {
      onChanged(value);
    }
    if (validator) {
      setError(validator(value));
    }
  };

  return (
    <div
      className={`${isOrder ? "" : "px-0"}`}
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <div className="bg-white rounded-lg p-4">
        {isOrder ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold">{caption}</p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <select
                  value={selectedItem || ""}
                  onChange={(e) =>
                    handleChange(e.target.value ? e.target.value : null)
                  }
                  className="w-full appearance-none text-sm outline-none bg-transparent pr-8"
                >
                  {hintText && (
                    <option value="" disabled hidden>
                      {hintText}
                    </option>
                  )}
                  {items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <img src={Assets.Logo} className="w-20 h-20" alt="" />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold">{caption}</p>
            <div className="relative">
              <select
                value={selectedItem || ""}
                onChange={(e) =>
                  handleChange(e.target.value ? e.target.value : null)
                }
                className="w-full appearance-none text-sm outline-none bg-transparent pr-8 border-b border-transparent focus:border-transparent"
              >
                {hintText && (
                  <option value="" disabled hidden>
                    {hintText}
                  </option>
                )}
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {/* Replace with your SVG icon component */}
                <img src={Assets.dropdown} className="h-1.5" alt="" />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {secondarySection && secondarySection}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
