import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import CreatePost from "../../../CreatePost/views/CreatePost";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { onChangeRoute } from "../../../../redux/slices/RouteSlice";
import CreateBossup from "../../../communities/views/CreateBossup";
import CreateListing from "../../../marketplace/views/CreateListing";
import Forum from "../../../forum/views/Forum";
import { Socket } from "socket.io-client";

interface Props {
  // currentIndex: number;
  // onTabClick: (index: number) => void;
  currentRoute: string;
  unseenChat?: boolean;
  unseenNotification?: boolean;
}

const ComputerTopNav = ({
  // currentIndex,
  // onTabClick,
  currentRoute,
  unseenChat,
  unseenNotification,
}: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#232324";
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentIndex = useAppSelector((state) => state.route.currentIndex);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleTabClick = (index: number) => {
    dispatch(onChangeRoute(index));
    switch (index) {
      case 0:
        navigate(RoutesPath.home);
        break;
      case 1:
        navigate("/communities");
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
    }
  };

  const renderButton = (index: number) => {
    switch (index) {
      case 0:
        return (
          <button
            onClick={openPopup}
            className={`p-3 ${"bg-primary"} rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">{"Create Post"}</p>
            <BsPlusLg
              strokeWidth={1.2}
              color="white"
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        );
      case 1:
        return (
          <button
            onClick={openPopup}
            className={`p-3 ${"bg-primary"} rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">
              {currentRoute === "/communities"
                ? "Enter Challenge"
                : currentRoute === "/communities/learning"
                  ? "Start A Topic"
                  : "Share opportunities"}
            </p>

            <BsPlusLg
              strokeWidth={1.2}
              color="white"
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        );
      case 2:
        return (
          <button
            onClick={openPopup}
            className={`p-3 ${"bg-primary"} rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">{"Sell"}</p>
            <BsPlusLg
              strokeWidth={1.2}
              color="white"
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        );

      default:
        return (
          <button
            onClick={openPopup}
            className={`p-3 ${"bg-primary"} rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">{"Create Post"}</p>
            <BsPlusLg
              strokeWidth={1.2}
              color="white"
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        );
    }
  };

  return (
    <div className="flex justify-between" style={{ gap: "20px" }}>
      <div
        className={`tab ${currentIndex === 0 ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(0)}
      >
        <div className="flex flex-col items-center">
          <Assets.Home
            stroke={currentIndex === 0 ? primaryColor : strokeColor}
            style={{ width: "25px", height: "22px" }}
          />
          <p
            className={
              currentIndex === 0
                ? "text-primary font-semibold"
                : "text-[#232324]"
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
            fill={currentIndex === 1 ? primaryColor : strokeColor}
            style={{ width: "33px", height: "23px" }}
          />
          <p
            className={
              currentIndex === 1
                ? "text-primary font-semibold"
                :  "text-[#232324]"
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
                :  "text-[#232324]"
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
        <div className="flex flex-col items-center relative">
          {currentIndex ===3?<Assets.Activemessage
            stroke={currentIndex === 3 ? primaryColor : strokeColor}
            style={{ width: "24px", height: "24px" }}
          />:<Assets.Messagenoback
          stroke={currentIndex === 3 ? primaryColor : strokeColor}
          style={{ width: "24px", height: "24px" }}
        />}
          
          {unseenChat ? (
            <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}
          <p
            className={
              currentIndex === 3
                ? "text-primary font-semibold"
                :  "text-[#232324]"
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
        <div className="flex flex-col items-center relative">
         
          {currentIndex === 4?<Assets.ActiveNotification
            style={{ width: "24px", height: "25px" }}
          />:<Assets.Notifnoback
          style={{ width: "24px", height: "25px" }}
        />}
         
          
          {unseenNotification ? (
            <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}
          <p
            className={
              currentIndex === 4
                ? "text-primary font-semibold"
                : "text-[#232324]"
            }
          >
            Notifications
          </p>
        </div>
      </div>
      <div className="pb-3">
        {renderButton(currentIndex)}
        {isPopupOpen && (
          <div className="overlay">
            <div className="popup">
              <div className="computer-only">
                {currentIndex === 0 ? (
                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center"> {/* Wrapping div */}
                        <button onClick={() => closePopup()} className="flex items-center mr-5">
                          <Assets.Backbutton />
                        </button>
                        <p className="text-2xl font-bold">Create Post</p>
                      </div>
                      <div />
                    </div>
                    <CreatePost /></div>
                ) : currentIndex === 1 ? (
                  currentRoute === "/communities"
                    ? <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="flex items-center"> {/* Wrapping div */}
                          <button onClick={() => closePopup()} className="flex items-center mr-5">
                            <Assets.Backbutton />
                          </button>
                          <p className="text-2xl font-bold">Introduce your Business</p>
                        </div>
                        <div />
                      </div>
                      <CreateBossup /></div>
                    : currentRoute === "/communities/learning"
                      ? <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                          <div className="flex items-center"> {/* Wrapping div */}
                            <button onClick={() => closePopup()} className="flex items-center mr-5">
                              <Assets.Backbutton />
                            </button>
                            <p className="text-2xl font-bold">Start a Topic</p>
                          </div>
                          <div />
                        </div>
                      </div>
                      : <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                          <div className="flex items-center"> {/* Wrapping div */}
                            <button onClick={() => closePopup()} className="flex items-center mr-5">
                              <Assets.Backbutton />
                            </button>
                            <p className="text-2xl font-bold">Share Opportunities</p>
                          </div>
                          <div />
                        </div>
                      </div>
                ) : currentIndex === 2 ? (
                  <div>
                  <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                    <div className="flex items-center"> {/* Wrapping div */}
                      <button onClick={() => closePopup()} className="flex items-center mr-5">
                        <Assets.Backbutton />
                      </button>
                      <p className="text-2xl font-bold">Create Listing</p>
                    </div>
                    <div />
                  </div>
                  <CreateListing /></div>
                ) : (

                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center"> {/* Wrapping div */}
                        <button onClick={() => closePopup()} className="flex items-center mr-5">
                          <Assets.Backbutton />
                        </button>
                        <p className="text-2xl font-bold">Create Post</p>
                      </div>
                      <div />
                    </div>
                    <CreatePost /></div>
                )}

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerTopNav;
