import React, { ChangeEventHandler } from "react";
interface Props {
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLInputElement>;
  suffixIcon?: any;
  onPressSuffixIcon?: VoidFunction;
}
const FilledInput = ({
  onchange,
  className,
  defaultValue,
  placeholder,
  suffixIcon,
  type,
  onPressSuffixIcon,
}: Props) => {
  return (
    <div className="bg-[#F4F4F4] my-5 rounded-lg p-3 flex items-center gap-2">
      <input
        className="border-none outline-none w-full bg-transparent"
        type={type ?? "text"}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onchange}
      />
      {suffixIcon ? (
        <button type="button" onClick={onPressSuffixIcon}>
          {suffixIcon}
        </button>
      ) : null}
    </div>
  );
};

export default FilledInput;
