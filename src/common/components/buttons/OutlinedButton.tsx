import React from "react";
interface Props {
  onClick: VoidFunction;
  text: string;
  className?: string;
}
const OutlinedButton = ({ onClick, text, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white border-2 border-primary rounded-xl text-primary w-full p-2 ${className}`}
    >
      {text}
    </button>
  );
};

export default OutlinedButton;
