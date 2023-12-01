import React from "react";

interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}

const Outlinegrey = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#fff] border border-[#E5E5E5] text-sm  rounded-lg flex items-center font-medium justify-center text-black p-1.5 px-3 ${className}`}
    >
      {text}
      <div className="w-2"></div>
      {icon}
    </button>
  );
};

export default Outlinegrey;
