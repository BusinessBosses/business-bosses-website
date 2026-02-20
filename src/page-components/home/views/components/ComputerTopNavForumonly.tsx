import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useLocation, useRouter } from "next/navigation";
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
import AppConstants from "../../../../constants/consts";

interface Props {
  // currentIndex: number;
  // onTabClick: (index: number) => void;
  currentRoute: string;
  unseenChat?: boolean;
  unseenNotification?: boolean;
  onTapButton?: () => void;
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
  industry: string;
  handleOpenModal: () => void;

}


const ComputerTopNavForumonly = ({
  // currentIndex,
  // onTabClick,
  onTapButton,
  currentRoute,
  unseenChat,
  unseenNotification,
  partnerData,
  partnerDatatile,
  industry,
  handleOpenModal,
}: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const primaryColor = "#F21C29";
  const strokeColor = "#232324";
  const router = useRouter();
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
        router.push(RoutesPath.home);
        break;
      case 1:
        router.push("/communities");
        break;
      case 2:
        router.push(RoutesPath.marketPlace);
        break;
      case 3:
        router.push(RoutesPath.chats);
        break;
      case 4:
        router.push(RoutesPath.notifications);
        break;
    }
  };


  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      router.push(RoutesPath.login)
    } else {

    }
  };


  const renderButton = (index: number) => {
    switch (index) {
      case 0:
        return (
          <button
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
              handleButtonClick : () => router.push(RoutesPath.createPost)}
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
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
              handleButtonClick : () => {
                if (onTapButton) {
                  if (industry === AppConstants.LEARNINGID) {
                    handleOpenModal()

                  } else {
                    handleOpenModal()


                  }
                }
              }
            }
            className={`p-3 ${"bg-primary"} rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">
              {industry === AppConstants.LEARNINGID
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
            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
              handleButtonClick : openPopup}
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


    }
  };

  return (
    <div className="flex flex-grow justify-between computer-content">
      <div className="flex justify-center" style={{ width: "58%", flexGrow: 0 }}>
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
                  ? "text-primary font-semibold text-base"
                  : "text-[#232324] text-base"
              }
            >
              Home
            </p>
          </div>
        </div>
        <div className="w-5"></div>

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
                  ? "text-primary font-semibold text-base"
                  : "text-[#232324] text-base"
              }
            >
              Boss Up
            </p>
          </div>
        </div>
        <div className="w-5"></div>

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
                  ? "text-primary font-semibold text-base"
                  : "text-[#232324] text-base"
              }
            >
              Marketplace
            </p>
          </div>
        </div>
        <div className="w-5"></div>

        <div
          className={`tab ${currentIndex === 3 ? "selected-tab" : ""}`}
          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick : () => handleTabClick(3)}
        >
          <div className="flex flex-col items-center relative">
            {currentIndex === 3 ? (
              <Assets.Activemessage
                stroke={currentIndex === 3 ? primaryColor : strokeColor}
                style={{ width: "24px", height: "24px" }}
              />
            ) : (
              <Assets.Messagenoback
                stroke={currentIndex === 3 ? primaryColor : strokeColor}
                style={{ width: "24px", height: "24px" }}
              />
            )}

            {unseenChat ? (
              <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
            ) : null}
            <p
              className={
                currentIndex === 3
                  ? "text-primary font-semibold text-base"
                  : "text-[#232324] text-base"
              }
            >
              Messages
            </p>
          </div>
        </div>
        <div className="w-5"></div>

        <div
          className={`tab ${currentIndex === 4 ? "selected-tab" : ""}`}
          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick : () => handleTabClick(4)}
        >
          <div className="flex flex-col items-center relative">
            {currentIndex === 4 ? (
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
                currentIndex === 4
                  ? "text-primary font-semibold text-base"
                  : "text-[#232324] text-base"
              }
            >
              Notifications
            </p>
          </div>
        </div>
      </div>
      <div className="pb-3 pl-5 mr-5 lg:mr-20 pr-0 mb-0">
        {renderButton(currentIndex)}
        {isPopupOpen && (
          <div className="overlay">
            <div className="popup">
              <div className="computer-only">
                {currentIndex === 0 ? (
                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center">
                        {" "}
                        {/* Wrapping div */}
                        <button
                          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                            handleButtonClick : () => closePopup()}
                          className="flex items-center mr-5"
                        >
                          <Assets.Backbutton />
                        </button>
                        <p className="text-2xl font-bold">Create Post</p>
                      </div>
                      <div />
                    </div>
                    <CreatePost partnerData={partnerData} partnerDatatile={partnerDatatile} />
                  </div>
                ) : currentIndex === 1 ? (
                  currentRoute === "/communities" ? (
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                        <div className="flex items-center">
                          {" "}
                          {/* Wrapping div */}
                          <button
                            onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                              handleButtonClick : () => closePopup()}
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
                              handleButtonClick : () => closePopup()}
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
                              handleButtonClick : () => closePopup()}
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
                ) : currentIndex === 2 ? (
                  <div>
                    <div className="computer-only bg-white pb-5 px-4 mt-10 flex items-center justify-between">
                      <div className="flex items-center">
                        {" "}
                        {/* Wrapping div */}
                        <button
                          onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                            handleButtonClick : () => closePopup()}
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
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerTopNavForumonly;
