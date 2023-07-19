import { ChangeEventHandler } from "react";
interface Props {
  defaultValue?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLInputElement>;
  label?: string;
  data: string[];
}
const FilledSelect = ({
  onchange,
  className,
  defaultValue,
  label,
  data,
}: Props) => {
  return (
    <div className="my-5">
      {label ? (
        <label className="text-[#333333] text-sm font-[700]">{label}</label>
      ) : null}

      <select
        defaultValue={defaultValue}
        id={label}
        className="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
      >
        {data.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FilledSelect;
