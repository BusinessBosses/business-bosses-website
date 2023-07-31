interface Props {
  currentIndex: number;
  onChangeRoute: Function;
}
const Tabs = ({ currentIndex, onChangeRoute }: Props) => {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff', borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}>
      <div className="grid grid-cols-3 items-center justify-between p-0">
        <button
          onClick={() => onChangeRoute(0)}
          className={`${
            currentIndex === 0
              ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => onChangeRoute(1)}
          className={`${
            currentIndex === 1
              ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Connecteds
        </button>
        <button
          onClick={() => onChangeRoute(2)}
          className={`${
            currentIndex === 2
              ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary"
              : "text-[#A9A9A9]"
          }`}
        >
          Suggested
        </button>
      </div>
    </div>
  );
};

export default Tabs;
