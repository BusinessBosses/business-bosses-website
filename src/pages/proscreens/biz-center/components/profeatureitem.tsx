import React from "react";
import Assets from "../../../../assets";

interface ProFeatureItem {
  iconPath: string;
  caption: string;
  subtext?: string;
  color?: string;
  iconcolor?: string;
}

interface ProfeatureTileProps {
  feature: ProFeatureItem;
  backgroundColor?: string;
}

const ProfeatureTile: React.FC<ProfeatureTileProps> = ({
  feature,
  backgroundColor = "bg-white",
}) => {
  return (
    <div className={`${backgroundColor} rounded-md w-full`}>
      <div className="flex items-start gap-2 w-full">
        {/* Fixed width icon container */}
        <div className="flex-shrink-0">
          <div
            className={`${feature.color || "bg-gray-200"} rounded-md p-1`}
            style={{
              backgroundColor: feature.color,
              width: "28px", // Fixed width
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Assets.checkfilled}
              alt={feature.caption}
              className="h-[15px] max-w-[15px]"
            />
          </div>
        </div>

        <div className="min-w-0">
          {" "}
          <p className="font-bold text-sm truncate">{feature.caption}</p>
          {feature.subtext && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {feature.subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfeatureTile;
