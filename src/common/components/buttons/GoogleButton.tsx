import React from "react";
import Assets from "../../../assets";
interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
}
const GoogleButton = ({ onClick, text, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white border-2 border-primary rounded-xl flex items-center justify-center text-primary p-2 ${className}`}
    >
      <Assets.Google />
      <div className="w-2"></div>
      <p className="text-[#232324] font-[700]">{text}</p>
    </button>
  );
};

export default GoogleButton;
