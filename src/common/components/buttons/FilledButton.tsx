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
      className={`bg-primary rounded-xl text-white flex items-center justify-center font-semibold gap-2 p-2 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default FilledButton;
