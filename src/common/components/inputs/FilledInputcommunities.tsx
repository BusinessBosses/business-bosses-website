import React, {
  ChangeEventHandler,
  LegacyRef,
  useEffect,
  useState,
} from "react";
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
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const handleScreenWidthChange = () => {
    setScreenWidth(window.innerWidth);
    // Perform any actions or updates based on the screen width change
  };
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    // Event listener for screen resize
    window.addEventListener("resize", handleScreenWidthChange);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("resize", handleScreenWidthChange);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div>
      {screenWidth <= 576 && (
        <div className="my-5 xl:hidden lg:hidden md:hidden sm:block xs:block">
          {label ? (
            <label className="text-[#333333] text-sm font-[700]">{label}</label>
          ) : null}

          <div className="bg-[#fff] rounded-lg p-3 flex items-center gap-2">
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
      )}

      {screenWidth >= 576 && (
        <div className="my-5 xl:block lg:block md:block sm:hidden xs:hidden">
          {label ? (
            <label className="text-[#333333] text-sm font-[700]">{label}</label>
          ) : null}

          <div className="bg-[#f1f1f1] rounded-lg p-5 flex items-center gap-2">
            <input
              className={`border-none text-[#232324CC] outline-none w-full bg-transparent ${className}`}
              type={type ?? "text"}
              ref={inputRef}
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
      )}
    </div>
  );
};

export default FilledInput;
