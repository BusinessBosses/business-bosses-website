import React from "react";
import { CiSearch } from "react-icons/ci";
import Assets from "../../../../assets";

const MobileHeader = () => {
  return (
    <div className="fixed bg-white top-0 w-full z-50">
      <div className="flex items-center justify-between p-5">
        <div className="bg-white shadow-lg p-2 rounded-lg relative ">
          <img src={Assets.MessageIcon} alt="" />

          <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
        </div>
        <div className="flex items-center gap-2 bg-[#F4F4F4] py-2 px-6 rounded-lg">
          <CiSearch className="text-[#A9A9A9]" />
          <p className="text-[#A9A9A9] text-sm">Search people & posts</p>
        </div>
        <div className="bg-white shadow-lg p-2 rounded-lg relative ">
          <img src={Assets.NotificationIcon} alt="" />

          <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
