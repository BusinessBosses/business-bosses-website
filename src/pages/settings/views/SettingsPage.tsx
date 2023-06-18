import React from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Assets from "../../../assets";

const SettingsPage = () => {
  return (
    <div className="bg-[#f4f4f4] min-h-screen h-full">
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Settings" />
      </div>
      <div className="my-16"></div>
      <div className="p-5">
        <Tab onClick={() => {}} text="Community Rules" />
        <Tab onClick={() => {}} text="Invite a friends terms & conditions" />
        <Tab onClick={() => {}} text="Contact Us" />
        <Tab onClick={() => {}} text="Change Password" />
        <Tab onClick={() => {}} text="Delete Account" />
        <div className="my-10"></div>
        <Tab onClick={() => {}} text="Sign Out" />
        <div className="my-20 flex items-center justify-center">
          <img src={Assets.Logo} className="h-20 w-20" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

interface Props {
  onClick: VoidFunction;
  text: string;
}
const Tab = ({ onClick, text }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-white flex p-3 rounded-lg my-3 items-center justify-between w-full "
    >
      <p className="text-sm">{text}</p>
      <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
    </button>
  );
};
