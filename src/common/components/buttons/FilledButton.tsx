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
      className={`bg-primary rounded-xl py-2.5 text-white flex items-center justify-center font-bold gap-2 p-2 px-4 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default FilledButton;
