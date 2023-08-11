interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}
const Tabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (
    <div className="sticky bg-white z-50">
      <div className="grid grid-cols-3 items-center justify-between">
        <button
          onClick={() => onChangeRoute(0)}
          className={`${
            currentIndex === 0
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2 text-sm"
              : "text-[#A9A9A9] pb-2 pt-2 text-sm"
          }`}
        >
          Challenge
        </button>
        <button
          onClick={() => onChangeRoute(1)}
          className={`${
            currentIndex === 1
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2 text-sm"
              : "text-[#A9A9A9] pb-2 pt-2 text-sm"
          }`}
        >
          Learning
        </button>
        <button
          onClick={() => onChangeRoute(2)}
          className={`${
            currentIndex === 2
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2 text-sm"
              : "text-[#A9A9A9] pb-2 pt-2 text-sm"
          }`}
        >
          Opportunities
        </button>
      </div>
    </div>
  );
};

export default Tabs;
