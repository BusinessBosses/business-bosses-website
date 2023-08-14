import { ChangeEventHandler, LegacyRef, useEffect, useState } from "react";
interface Props {
  defaultValue?: string;
  className?: string;
  onchange: ChangeEventHandler<HTMLInputElement>;
  label?: string;
  data: string[];
  inputRef?: LegacyRef<HTMLSelectElement>;
}
const FilledSelect = ({
  onchange,
  className,
  defaultValue,
  label,
  data,
  inputRef,
}: Props) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const handleScreenWidthChange = () => {
    setScreenWidth(window.innerWidth);
    // Perform any actions or updates based on the screen width change
  };
  useEffect(() => {
    // Event listener for screen resize
    window.addEventListener("resize", handleScreenWidthChange);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("resize", handleScreenWidthChange);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="my-5 ">
      {label ? (
        <label className="text-[#333333] text-sm font-[700]">{label}</label>
      ) : null}

      {screenWidth <= 576 && (
        <select
          ref={inputRef}
          defaultValue={defaultValue}
          id={label}
          className="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-5 mobile-only"
        >
          {data.map((item, index) => {
            return (
              <option key={index} selected={label === item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      )}

      {screenWidth >= 576 && (
        <select
          defaultValue={defaultValue}
          id={label}
          className="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-5 computer-only"
        >
          {data.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default FilledSelect;
