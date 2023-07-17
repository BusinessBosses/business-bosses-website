import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import { MdPadding } from "react-icons/md";
interface Props {
  currentIndex: number;
}
const MobileBottomNav = ({ currentIndex }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();
  return (
    <div className="fixed w-full bottom-0 bg-white px-5 pb-4 pt-1 pt-2" style={{ fontSize: "12px", boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}>
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              navigate(RoutesPath.home);
            }}
          >
            <Assets.Home
              stroke={currentIndex === 0 ? primaryColor : strokeColor}
            /> </button>
          <p
            className={
              currentIndex === 0
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Home
          </p>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/bossup")}
          >
            <Assets.BossupIcon
              stroke={currentIndex === 1 ? primaryColor : strokeColor}
            /> </button>
          <p
            className={
              currentIndex === 1
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Bossup
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "30px", // Adjust this value as needed to position the button correctly
            left: "50%", // Center the button horizontally
            transform: "translateX(-50%)", // Center the button horizontally
            zIndex: 1, // Ensure the button is above the MobileBottomNav
          }}
        >
          <button
            onClick={() => navigate(RoutesPath.createPost)}
            className="p-4 bg-primary rounded-full text-white flex items-center justify-center" style={{ width: 55, height: 55 }}
          >
            <BsPlusLg color="white" size={20} style={{ strokeWidth: 1 }} />
          </button>

        </div>
        <div className="flex flex-col items-center" style={{paddingLeft:50}} >
          <button
            onClick={() => {
              navigate(RoutesPath.marketPlace);
            }}
          >
            <Assets.MarketPlace
              fill={currentIndex === 2 ? primaryColor : strokeColor}
            /> </button>
          <p
            className={
              currentIndex === 2
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Marketplace
          </p>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              navigate(RoutesPath.myProfile);
            }}
          >
            <Assets.ProfileIcon
              stroke={currentIndex === 3 ? primaryColor : strokeColor}
            /> </button>
          <p
            className={
              currentIndex === 3
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
