import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import { MdPadding } from "react-icons/md";
import React from "react";

interface Props {
  currentIndex: number;
}

const MobileBottomNav = ({ currentIndex }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();

  return (
    <div
      className="fixed w-full bottom-0 bg-white px-5 pb-4 pt-1 pt-2"
      style={{ fontSize: "12px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex w-full justify-between items-center">
        {/* Home */}
        <button
          onClick={() => {
            navigate(RoutesPath.home);
          }}
          className="flex flex-col items-center"
        >
          <Assets.Home
            stroke={currentIndex === 0 ? primaryColor : strokeColor}
          />
          <p
            className={
              currentIndex === 0 ? "text-primary font-semibold" : "text-gray-500"
            }
          >
            Home
          </p>
        </button>

        {/* Bossup */}
        <div className=""style={{
            position: "relative",
            bottom: "0px",
            right: "4%",
            transform: "translateX(0%)",
            zIndex: 1}}>
        <button
          onClick={() => navigate("/communities")}
          className="flex flex-col items-center "
        >
          <Assets.BossupIcon
            stroke={currentIndex === 1 ? primaryColor : strokeColor}
          />
          <p
            className={
              currentIndex === 1 ? "text-primary font-semibold" : "text-gray-500"
            }
          >
            Bossup
          </p>
        </button>
        </div>

        {/* Create Post */}
        <div className=""
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <button
            onClick={() => navigate(RoutesPath.createPost)}
            className="p-4 bg-primary rounded-full  text-white flex items-center justify-center"
            style={{ width: 55, height: 55 }}
          >
            <BsPlusLg color="white" size={20} style={{ strokeWidth: 1 }} />
          </button>
        </div>

        {/* Marketplace */}
        <div style={{
            position: "relative",
            bottom: "0px",
            left: "16%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}>
          <button
            onClick={() => {
              navigate(RoutesPath.marketPlace);
            }}
            className="flex flex-col items-center"
          >
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
          </button>
        </div>

        {/* Profile */}
        <button
          onClick={() => {
            navigate(RoutesPath.myProfile);
          }}
          className="flex flex-col items-center"
        >
          <Assets.ProfileIcon
            stroke={currentIndex === 3 ? primaryColor : strokeColor}
          />
          <p
            className={
              currentIndex === 3 ? "text-primary font-semibold" : "text-gray-500"
            }
          >
            Profile
          </p>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
