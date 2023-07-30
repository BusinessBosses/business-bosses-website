import { BsPlusLg } from "react-icons/bs";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import CreatePost from "../../../CreatePost.tsx/views/CreatePost";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";


interface Props {
  currentIndex: number;
  onTabClick: (index: number) => void;
  currentRoute: string;
  unseenChat?: boolean;
  unseenNotification?: boolean;

}



const ComputerTopNav = ({ currentIndex, onTabClick, currentRoute, unseenChat, unseenNotification }: Props) => {
  const primaryColor = "#F21C29";
  const strokeColor = "#A9A9A9";
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);






  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }
  }, [isPopupOpen]);


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };





  const handleTabClick = (index: number) => {
    onTabClick(index);
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
            className={`p-3 ${"bg-primary"
              } rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">
              {"Create Post"}
            </p>
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
            className={`p-3 ${"bg-primary"
              } rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">
              {currentRoute === '/communities'
                ? 'Enter Challenge'
                : currentRoute === '/communities/learning'
                  ? 'Start A Topic'
                  : 'Share opportunities'}
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
            className={`p-3 ${"bg-primary"
              } rounded-xl text-white flex items-center`}
            style={{ marginLeft: 100 }}
            key={index}
          >
            <p className="text-white font-semibold mr-2">
              {"Sell"}
            </p>
            <BsPlusLg
              strokeWidth={1.2}
              color="white"
              className="mr-2"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        );


      default:
        return (<button
          onClick={openPopup}
          className={`p-3 ${"bg-primary"
            } rounded-xl text-white flex items-center`}
          style={{ marginLeft: 100 }}
          key={index}
        >
          <p className="text-white font-semibold mr-2">
            {"Create Post"}
          </p>
          <BsPlusLg
            strokeWidth={1.2}
            color="white"
            className="mr-2"
            style={{ width: "18px", height: "18px" }}
          />
        </button>);
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
          stroke="currentIndex === 1 ? primaryColor : strokeColor"
            style={{ width: '25px', height: '22px'}}
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
            fill={currentIndex === 1 ? primaryColor : strokeColor}
            style={{ width: '35px', height: '20px'}}

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
        <div className="flex flex-col items-center relative"> {/* Add 'relative' class here */}

          <Assets.Messagenoback
            stroke={currentIndex === 3 ? primaryColor : strokeColor}
            style={{ width: '22px', height: '22px' }}
          />

          {unseenChat ? (

            < div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}

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
        <div className="flex flex-col items-center relative"> {/* Add 'relative' class here */}
          {/* Your notification icon */}
          <Assets.Notifnoback
            stroke={currentIndex === 4 ? primaryColor : strokeColor}
            style={{ width: '22px', height: '22px' }}
          />

          {unseenNotification ? (

            <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 h-2 w-2 bg-primary rounded-full" />
          ) : null}

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
        {renderButton(currentIndex)}
        {isPopupOpen && (
          <div className="overlay">
            <div className="popup">
              <button onClick={closePopup} style={{ paddingBottom: 20 }}>
                <BiX size={20} />
              </button>

              {/* CreatePost Component */}
              <div className="computer-only">
                <p className="text-[#333333] text-xl font-bold">Create Post</p>
                <div className="my-7"></div>
                <div className="p-0">
                  <div className="flex items-center gap-3">
                    <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/03/16/05/spotted-laughingtrush-8037974__340.png" />
                    <p className="text-[#333333] text-lg font-medium">Isaac Akin</p>
                  </div>

                  <div className=" mt-7">
                    <textarea
                      name=""
                      id=""
                      placeholder="What’s on your mind?"
                      className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
                      rows={8}
                    ></textarea>

                    <div className="flex mt-4 items-center gap-3">
                      <p className="text-[#333333]">Add Image</p>
                      <button className="bg-[#F4F4F4] p-2.5 rounded-full">
                        <img src={Assets.Gallery} alt="" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      <img src={Assets.Rocket} alt="" />
                      <p className="text-[#373737] font-semibold">Boost Post</p>
                      <MdOutlineKeyboardArrowRight size={24} className="text-primary" />
                    </div>
                    <div className="mt-10">
                      <FilledButton
                        onClick={() => {
                          navigate(RoutesPath.promotePost);
                        }}
                        text="Post"
                        className="w-full py-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* End of CreatePost Component */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComputerTopNav;
