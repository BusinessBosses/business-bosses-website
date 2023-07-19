import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";

interface Props {
  currentIndex: number;
  onTabClick: (index: number) => void;
}

const ComputerTopNav = ({ currentIndex, onTabClick }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    onTabClick(index);
    switch (index) {
      case 0:
        navigate(RoutesPath.home);
        break;
      case 1:
        navigate("/bossup");
        break;
      case 2:
        navigate(RoutesPath.marketPlace);
        break;
      case 3:
        navigate(RoutesPath.chats);
        break;
      case 4:
        navigate(RoutesPath.notifications);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-between" style={{ gap: '20px' }}>
      <div
        className={`tab ${currentIndex === 0 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(0)}
      >
        <div className="flex flex-col items-center">
          <Assets.Home
            stroke={currentIndex === 0 ? primaryColor : strokeColor}
            style={{ width: '20px', height: '19px' }}
          />
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
      </div>

      <div
        className={`tab ${currentIndex === 1 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(1)}
      >
        <div className="flex flex-col items-center">
          <Assets.BossupIcon
            stroke={currentIndex === 1 ? primaryColor : strokeColor}
          />
          <p
            className={
              currentIndex === 1
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Boss Up
          </p>
        </div>
      </div>

      <div
        className={`tab ${currentIndex === 2 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(2)}
      >
        <div className="flex flex-col items-center">
          <Assets.MarketPlace
            fill={currentIndex === 2 ? primaryColor : strokeColor}
          />
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
      </div>

      <div
        className={`tab ${currentIndex === 3 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(3)}
      >
        <div className="flex flex-col items-center">
          <Assets.Messagenoback
            stroke={currentIndex === 3 ? primaryColor : strokeColor}
            style={{ width: '22px', height: '22px' }}
          />
          <p
            className={
              currentIndex === 3
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Messages
          </p>
        </div>
      </div>

      <div
        className={`tab ${currentIndex === 4 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(4)}
      >
        <div className="flex flex-col items-center">
          <Assets.Notifnoback
            stroke={currentIndex === 4 ? primaryColor : strokeColor}
            style={{ width: '22px', height: '22px' }}
          />
          <p
            className={
              currentIndex === 4
                ? "text-primary font-semibold"
                : "text-gray-500"
            }
          >
            Notifications
          </p>
        </div>
      </div>
      <div className="pb-3">
      <button
        onClick={() => navigate(RoutesPath.createPost)}
        className="p-3 bg-primary rounded-xl text-white flex items-center"
        style={{ marginLeft: 100 }}
      >
        <p className="text-white font-semibold mr-2">Create Post</p>
        <BsPlusLg
          strokeWidth={1.2}
          color="white"
          className="mr-2"
          style={{ width: '18px', height: '18px' }}
        />
      </button>
      </div>
    </div>
  );
};

export default ComputerTopNav;
