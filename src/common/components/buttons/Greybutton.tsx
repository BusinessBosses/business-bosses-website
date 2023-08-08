import React from "react";
interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}
const GreyButton = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#E5E5E5] rounded-lg text-black text-sm flex items-center justify-center font-medium gap-2 p-1.5 px-3 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default GreyButton;
