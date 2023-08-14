interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}

const BossupSearchTabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (
    <div className="sticky top-0 bg-white z-50">
      <div className="grid grid-cols-2 items-center justify-between mt-3">
        <button
          onClick={() => onChangeRoute(0)}
          className={`${
            currentIndex === 0
              ? "text-[#333333] w-full font-bold flex-grow border-b-2 pb-2 border-b-primary"
              : "text-[#A9A9A9] pb-2"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => onChangeRoute(1)}
          className={`${
            currentIndex === 1
              ? "text-[#333333] w-full font-bold flex-grow border-b-2 pb-2 border-b-primary"
              : "text-[#A9A9A9] pb-2"
          }`}
        >
          Topics
        </button>
      </div>
    </div>
  );
};

export default BossupSearchTabs;
