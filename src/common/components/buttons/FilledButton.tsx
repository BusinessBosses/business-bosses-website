import React from "react";
interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
  icon?: any;
}
const FilledButton = ({ onClick, text, className, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold p-2 px-4 ${className}`}
    >
      {text}
      <div className="w-2"></div>
      {icon}
    </button>
  );
};

export default FilledButton;
