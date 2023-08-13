import { ChangeEventHandler, LegacyRef } from "react";
interface Props {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLTextAreaElement>;
  label?: string;
  inputRef?: LegacyRef<HTMLTextAreaElement>;
}
const FilledTextareacommunities = ({
  onchange,
  className,
  defaultValue,
  label,
  placeholder,
  inputRef,
}: Props) => {
  return (
    <div className="my-5">
      {label ? (
        <label className="text-[#333333] text-sm font-[700]">{label}</label>
      ) : null}
      <textarea
        ref={inputRef}
        className={`border-none bg-[#fff] text-[#232324CC] outline-none w-full p-3 rounded-lg resize-none ${className}`}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onchange}
        name=""
        id=""
        rows={5}
      ></textarea>
    </div>
  );
};

export default FilledTextareacommunities;
