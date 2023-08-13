interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}
const Tabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (<div className="sticky">
    <div className="mobile-only" style={{ height: "1px", width: "100%", background: "#f4f4f4" }}></div>
    <div className=" top-12 bg-[#f9f9f9] z-50">
      <div className="grid grid-cols-3 items-center justify-between" >
        <button
          onClick={() => onChangeRoute(0)}
          className={`${currentIndex === 0
              ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary pb-3 pt-3 text-xs font-bold lg:text-base"
              : "text-[#A9A9A9] pb-3 pt-3 text-xs lg:text-base"
            }`}
        >
          About
        </button>

        <button
          onClick={() => onChangeRoute(1)}
          className={`${currentIndex === 1
            ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary pb-3 pt-3 text-xs font-bold lg:text-base"
            : "text-[#A9A9A9] pb-3 pt-3 text-xs lg:text-base"
            }`}
        >
          Posts
        </button>
        <button
          onClick={() => onChangeRoute(2)}
          className={`${currentIndex === 2
            ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary pb-3 pt-3 text-xs font-bold lg:text-base"
            : "text-[#A9A9A9] pb-3 pt-3 text-xs lg:text-base"
            }`}
        >
          Store
        </button>
      </div>
    </div>
    <div className="mobile-only" style={{ height: "1px", width: "100%", background: "#f4f4f4" }}></div>
  </div>
  );
};

export default Tabs;
