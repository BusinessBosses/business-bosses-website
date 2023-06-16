import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
interface Props {
  currentIndex: number;
}
const MobileBottomNav = ({ currentIndex }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();
  return (
    <div className="fixed w-full bottom-0 bg-white shadow-2xl px-5 pb-5 pt-1">
      <div className="flex w-full justify-between items-end">
        <button
          onClick={() => {
            navigate(RoutesPath.home);
          }}
        >
          <Assets.Home
            stroke={currentIndex === 0 ? primaryColor : strokeColor}
          />
        </button>
        <button onClick={() => navigate("/bossup")}>
          <Assets.BossupIcon
            stroke={currentIndex === 1 ? primaryColor : strokeColor}
          />
        </button>

        <button
          onClick={() => navigate(RoutesPath.createPost)}
          className="p-4 bg-primary rounded-full text-white"
        >
          <BsPlusLg color="white" />
        </button>
        <button onClick={() => navigate(RoutesPath.marketPlace)}>
          <Assets.MarketPlace
            fill={currentIndex === 2 ? primaryColor : strokeColor}
          />
        </button>
        <Assets.ProfileIcon
          stroke={currentIndex === 3 ? primaryColor : strokeColor}
        />
      </div>
    </div>
  );
};

export default MobileBottomNav;
