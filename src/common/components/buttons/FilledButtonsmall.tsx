import React from "react";
interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}
const FilledButtonsmall = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary rounded-xl py-2 text-white text-sm flex items-center justify-center font-bold p-2 px-4 ${className}`}
    >
      {text}
      <div className="w-2"></div>
      {icon}
    </button>
  );
};

export default FilledButtonsmall;
