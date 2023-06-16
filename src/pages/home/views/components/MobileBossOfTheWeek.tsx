import React from "react";
import Assets from "../../../../assets";
import { IoIosMore } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
const MobileBossOfTheWeek = () => {
  return (
    <div className="bg-[#EAEAEA] p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={Assets.Logo} className="w-8 h-8" alt="" />
          <p className="text-[#333333] text-2xl  font-semibold">
            Boss of the week
          </p>
        </div>
        <IoIosMore size={23} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <UserAvatar
          imageSize="h-24 w-24"
          isRanked
          imageURL="https://cdn.pixabay.com/photo/2023/06/02/14/12/woman-8035772_640.jpg"
        />
        <div className="w-1/2">
          <p className="text-lg text-[#333333] font-medium">Isaac Akin</p>
          <p className="text-sm text-[#333333]">Manufacturer</p>
          <p className="text-xs text-[#777777]">
            For you to be effective at networking you should make it a hobby
          </p>
          <div className="flex items-center gap-3 mt-1">
            <FilledButton
              onClick={() => {}}
              text="Connect"
              className="px-2 py-1.5"
            />
            <OutlinedButton
              onClick={() => {}}
              text="Refer"
              className="px-2 py-1.5"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
        <small className="text-xs text-[#545151]">Boss Up by</small>
        <p className="text-[#545151] text-sm">
          Business Bosses Company Limited
        </p>
        <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
      </div>
    </div>
  );
};

export default MobileBossOfTheWeek;
