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
      className={`bg-primary rounded-lg text-white flex items-center justify-center font-bold gap-2 p-2 px-3 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default FilledButton;
