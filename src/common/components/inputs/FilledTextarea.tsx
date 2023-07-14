import { ChangeEventHandler } from "react";
interface Props {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLTextAreaElement>;
  label?: string;
}
const FilledTextarea = ({
  onchange,
  className,
  defaultValue,
  label,
  placeholder,
}: Props) => {
  return (
    <div className="my-5">
      {label ? (
        <label className="text-[#333333] text-sm font-[700]">{label}</label>
      ) : null}
      <textarea
        className="border-none bg-[#F4F4F4] text-[#232324CC] outline-none w-full p-3 rounded-lg resize-none"
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

export default FilledTextarea;
