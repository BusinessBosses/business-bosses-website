import React from "react";
import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";

interface Props {
  currentIndex: number;
}

const ComputerTopNav = ({ currentIndex }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();

  return (
    <div className="flex justify-between" style={{ gap: '20px' }}>
      <button onClick={() => navigate(RoutesPath.home)}>
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
      </button>

      <button onClick={() => navigate("/bossup")}>
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
      </button>
      <button onClick={() => navigate(RoutesPath.marketPlace)}>
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
      </button>
      <button onClick={() => navigate(RoutesPath.myProfile)}>
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
      </button>
      <button onClick={() => navigate(RoutesPath.notifications)}>
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
      </button>
      <button
        onClick={() => navigate(RoutesPath.createPost)}
        className="p-3 bg-primary rounded-xl text-white flex items-center" style={{ marginLeft: 100 }}
      >
        <p className="text-white font-semibold mr-2" >Create Post</p>
        <BsPlusLg strokeWidth={1.2} color="white" className="mr-2" style={{ width: '18px', height: '18px' }} />

      </button>
    </div>
  );
};

export default ComputerTopNav;
