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
import { profile } from "console";
import { PartnerData } from "../../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../../common/interfaces/partnerdatatile";
import { toast } from "react-toastify";

interface Props {
  // currentIndex: number;
  // onTabClick: (index: number) => void;
  currentRoute: string;
  unseenChat?: boolean;
  unseenNotification?: boolean;
  onTapButton?: () => void;
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;

}

const ComputerTopNav = ({
  // currentIndex,
  // onTabClick,
  onTapButton,
  currentRoute,
  unseenChat,
  unseenNotification,
  partnerData,
  partnerDatatile,
}: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
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


  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
     navigate(RoutesPath.login)
    } else {
     
    }
  };


  const renderButton = (index: string) => {
    switch (index) {
      case "/" :
        return (
          <button
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick :()=>navigate(RoutesPath.createPost)}
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
      case "/communities":
        return (
          <button
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick: () => {
              if (onTapButton) {
                if (currentRoute === "/communities") {
                  navigate(RoutesPath.CreateBossup);
                } else if (currentRoute === "/communities/learning") {
                  toast.error("You need to choose a category first ")

                } else if (currentRoute === "/communities/opportunities") {
                  toast.error("You need to choose a category first ")

                } else if (currentRoute === "/forum" ){

                } 
              }
            }
          }            
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
      case "/market":
        return (
          <button
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick :openPopup}
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
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick : ()=>navigate(RoutesPath.createPost)}
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
    <div className="flex justify-between" style={{ gap: "15px" }}>
      <div
        className={`tab ${currentRoute === "/" ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(0)}
      >
        <div className="flex flex-col items-center">
          <Assets.Home
            stroke={currentRoute === "/"  ? primaryColor : strokeColor}
            style={{ width: "25px", height: "22px" }}
          />
          <p
            className={
              currentRoute === "/" 
                ? "text-primary font-semibold text-base"
                : "text-[#232324] text-base"
            }
          >
            Home
          </p>
        </div>
      </div>

      <div
        className={`tab ${ currentRoute === "/communities" ||  currentRoute === "/communities/learning" || currentRoute === "/communities/opportunities"  || currentRoute === "/forum" ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(1)}
      >
        <div className="flex flex-col items-center">
          <Assets.BossupIcon
            fill={currentRoute === "/communities" ||  currentRoute === "/communities/learning" || currentRoute === "/communities/opportunities"  || currentRoute === "/forum"  ? primaryColor : strokeColor}
            style={{ width: "33px", height: "23px" }}
          />
          <p
            className={
              currentRoute === "/communities" ||  currentRoute === "/communities/learning" || currentRoute === "/communities/opportunities" || currentRoute === "/forum" 
                ? "text-primary font-semibold text-base"
                : "text-[#232324] text-base"
            }
          >
            Boss Up
          </p>
        </div>
      </div>

      <div
        className={`tab ${currentRoute === "/market"  ? "selected-tab" : ""}`}
        onClick={() => handleTabClick(2)}
      >
        <div className="flex flex-col items-center">
          <Assets.MarketPlace
            fill={currentRoute === "/market"  ? primaryColor : strokeColor}
          />
          <p
            className={
              currentRoute === "/market" 
                ? "text-primary font-semibold text-base"
                : "text-[#232324] text-base"
            }
          >
            Marketplace
          </p>
        </div>
      </div>

      <div
        className={`tab ${currentRoute === "/chats"  ? "selected-tab" : ""}`}
        onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
        handleButtonClick: () => handleTabClick(3)}
      >
        <div className="flex flex-col items-center relative">
          {currentRoute === "/chats"  ? (
            <Assets.Activemessage
              stroke={currentRoute === "/chats"? primaryColor : strokeColor}
              style={{ width: "24px", height: "24px" }}
            />
          ) : (
            <Assets.Messagenoback
              stroke={currentRoute === "/chats"  ? primaryColor : strokeColor}
              style={{ width: "24px", height: "24px" }}
            />
          )}

          {unseenChat ? (
            <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}
          <p
            className={
              currentRoute === "/chats" 
                ? "text-primary font-semibold text-base"
                : "text-[#232324] text-base"
            }
          >
            Messages
          </p>
        </div>
      </div>

      <div
        className={`tab ${currentRoute === "/notifications"  ? "selected-tab" : ""}`}
        onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
        handleButtonClick:() => handleTabClick(4)}
      >
        <div className="flex flex-col items-center relative">
          {currentRoute === "/notifications" ? (
            <Assets.ActiveNotification
              style={{ width: "24px", height: "25px" }}
            />
          ) : (
            <Assets.Notifnoback style={{ width: "24px", height: "25px" }} />
          )}

          {unseenNotification ? (
            <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}
          <p
            className={
              currentRoute === "/notifications" 
                ? "text-primary font-semibold text-base"
                : "text-[#232324] text-base"
            }
          >
            Notifications
          </p>
        </div>
      </div>
      <div className="pb-3">
        {renderButton(currentRoute)}
        {isPopupOpen && (
          <div className="overlay">
            <div className="popup">
              <div className="computer-only">
                {currentRoute === "/" ? (
                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center">
                        {" "}
                        {/* Wrapping div */}
                        <button
                          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                          handleButtonClick:() => closePopup()}
                          className="flex items-center mr-5"
                        >
                          <Assets.Backbutton />
                        </button>
                        <p className="text-2xl font-bold">Create Post</p>
                      </div>
                      <div />
                    </div>
                    <CreatePost partnerData={partnerData}   partnerDatatile={partnerDatatile} />
                  </div>
                ) : currentRoute === "/communities" ||  currentRoute === "/communities/learning" || currentRoute === "/communities/opportunities"? (
                  currentRoute === "/communities" ? (
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="flex items-center">
                          {" "}
                          {/* Wrapping div */}
                          <button
                            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                            handleButtonClick:() => closePopup()}
                            className="flex items-center mr-5"
                          >
                            <Assets.Backbutton />
                          </button>
                          <p className="text-2xl font-bold">
                            Introduce your Business
                          </p>
                        </div>
                        <div />
                      </div>
                      <CreateBossup partnerData={partnerData} partnerDatatile={partnerDatatile} />
                    </div>
                  ) : currentRoute === "/communities/learning" ? (
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="flex items-center">
                          {" "}
                          {/* Wrapping div */}
                          <button
                            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                            handleButtonClick:() => closePopup()}
                            className="flex items-center mr-5"
                          >
                            <Assets.Backbutton />
                          </button>
                          <p className="text-2xl font-bold">Start a Topic</p>
                        </div>
                        <div />
                      </div>
                    </div>
                  ) : (
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="flex items-center">
                          {" "}
                          {/* Wrapping div */}
                          <button
                            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                            handleButtonClick:() => closePopup()}
                            className="flex items-center mr-5"
                          >
                            <Assets.Backbutton />
                          </button>
                          <p className="text-2xl font-bold">
                            Share Opportunities
                          </p>
                        </div>
                        <div />
                      </div>
                    </div>
                  )
                ) : currentRoute === "/market" ? (
                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center">
                        {" "}
                        {/* Wrapping div */}
                        <button
                          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                          handleButtonClick:() => closePopup()}
                          className="flex items-center mr-5"
                        >
                          <Assets.Backbutton />
                        </button>
                        <p className="text-2xl font-bold">Create Listing</p>
                      </div>
                      <div />
                    </div>
                    <CreateListing />
                  </div>
                ): null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerTopNav;
