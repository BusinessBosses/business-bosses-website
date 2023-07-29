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
      className={`bg-white border-2 border-primary gap-1 rounded-xl flex items-center justify-center text-primary p-2 ${className}`} style={{fontSize:14}}
    >
      {text}
      {icon}
    </button>
  );
};

export default OutlinedButton;
