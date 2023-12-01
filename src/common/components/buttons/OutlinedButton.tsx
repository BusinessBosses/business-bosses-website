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
      className={`bg-[#fff] border border-primary py-2.5 rounded-xl flex items-center text-sm justify-center text-primary p-2 px-4 ${className}`}
      style={{
        border: '1.5px solid #F21C29',
        color: '#F21C29',
      }}>
      {text}
      <div className="w-1"></div>
      {icon}
    </button>
  );
};

export default OutlinedButton;
