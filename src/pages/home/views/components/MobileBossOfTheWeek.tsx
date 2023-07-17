import React from "react";
import Assets from "../../../../assets";
import { IoIosMore } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";

const MobileBossOfTheWeek = () => {
  return (
    <div
      className="bg-[#EAEAEA]"
      style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 10, paddingTop: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={Assets.Logo} className="w-10 h-10" alt="" />
          <p className="text-[#333333] text-2xl font-extrabold" style={{ fontWeight: "900", fontSize: 20 }}>
            Boss of the week
          </p>
        </div>
        <IoIosMore size={23} />
      </div>
      <div className="flex items-center gap-3">
        {/* Display UserAvatar as a perfect circle */}
        <div className="h-20 w-20" style={{ borderRadius: "50%", overflow: "hidden" }}>
          <UserAvatar
            imageSize="h-20 w-20"
            isRanked
            imageURL="https://cdn.pixabay.com/photo/2023/06/02/14/12/woman-8035772_640.jpg"
          />
        </div>

        <div className="">
          <p className="text-[#333333]" style={{ fontSize: 15, fontWeight: 600 }}>Isaac Akin</p>
          <p className="text-[#555555]" style={{ fontSize: 13, fontWeight: "semi-bold" }}>Manufacturer</p>
          <p className="text-[#777777]" style={{ fontSize: 12 }}>
            For you to be effective at networking you should make it a hobby
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span style={{ fontSize: '13px' }}>
              <FilledButton
                onClick={() => { }}
                text="Connect"
                className="px-3 py-2"
              />
            </span>

            <span style={{ fontSize: '13px' }}>
              <OutlinedButton
                onClick={() => { }}
                text="Refer"
                className="px-3.5 py-1.5"
              />
            </span>
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
