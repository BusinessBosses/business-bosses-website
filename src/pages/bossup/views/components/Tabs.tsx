interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}
const Tabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (
    <div className="mt-20 sticky top-16 bg-white z-50">
      <div className="flex items-center justify-between p-5">
        <button
          onClick={() => onChangeRoute(0)}
          className={`${
            currentIndex === 0
              ? "text-[#333333] font-semibold border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Challenge
        </button>
        <button
          onClick={() => onChangeRoute(1)}
          className={`${
            currentIndex === 1
              ? "text-[#333333] font-semibold border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Learning
        </button>
        <button
          onClick={() => onChangeRoute(2)}
          className={`${
            currentIndex === 2
              ? "text-[#333333] font-semibold border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Opportunity
        </button>
      </div>
    </div>
  );
};

export default Tabs;
