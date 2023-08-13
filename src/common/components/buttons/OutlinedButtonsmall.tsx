import React from "react";

interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}

const OutlinedButtonsmall = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#fff] font-bold border border-primary gap-1 py-2 rounded-xl flex items-center text-sm justify-center text-primary p-2 px-4 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default OutlinedButtonsmall;
