import React, { ChangeEventHandler, LegacyRef } from "react";
interface Props {
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLInputElement>;
  suffixIcon?: any;
  onPressSuffixIcon?: VoidFunction;
  label?: string;
  inputRef?: LegacyRef<HTMLInputElement>;
}
const FilledInput = ({
  onchange,
  className,
  defaultValue,
  placeholder,
  suffixIcon,
  type,
  label,
  onPressSuffixIcon,
  inputRef,
}: Props) => {
  return (
    <div className="my-5 ">
      {label ? (
        <label className="text-[#333333] text-sm font-[700]">{label}</label>
      ) : null}

      <div className="bg-[#F4F4F4] rounded-lg p-3 flex items-center gap-2">
        <input
          ref={inputRef}
          className={`border-none text-[#232324CC] outline-none w-full bg-transparent ${className}`}
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
    </div>
  );
};

export default FilledInput;
