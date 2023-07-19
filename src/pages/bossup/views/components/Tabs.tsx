interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}
const Tabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (
    <div className="sticky bg-white z-50">
      <div className="flex items-center justify-between" style={{paddingLeft:20, paddingRight:20}}>
        <button
          onClick={() => onChangeRoute(0)}
          className={`${
            currentIndex === 0
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2"
              : "text-[#A9A9A9] pb-2 pt-2"
          }`}
        >
          Challenge
        </button>
        <button
          onClick={() => onChangeRoute(1)}
          className={`${
            currentIndex === 1
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2"
              : "text-[#A9A9A9] pb-2 pt-2"
          }`}
        >
          Learning
        </button>
        <button
          onClick={() => onChangeRoute(2)}
          className={`${
            currentIndex === 2
              ? "text-[#333333] font-semibold border-b-2 border-b-primary pb-2 pt-2"
              : "text-[#A9A9A9] pb-2 pt-2"
          }`}
        >
          Opportunities
        </button>
      </div>
    </div>
  );
};

export default Tabs;
