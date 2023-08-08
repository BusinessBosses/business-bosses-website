import React from "react";

interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}

const OutlinedButton = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#fff] border border-primary gap-1 py-2 rounded-xl flex items-center justify-center text-primary p-2 px-4 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default OutlinedButton;
