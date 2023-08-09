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
      className={`bg-[#f9f9f9] border border-[#E5E5E5] gap-1 rounded-lg flex items-center justify-center text-black p-2 px-4 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default Outlinegrey;
