import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ComputerTopNav from "./ComputerTopNav";
import HomeSearch from "../../../search/views/HomeSearch";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { CiSearch } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { onChangeRoute } from "../../../../redux/slices/RouteSlice";

const ComputerHeader = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const currentRoute = location.pathname;
  const profile = useAppSelector((state) => state.user);
  const chats = useAppSelector((state) => state.chat.chats);
  const dispatch = useAppDispatch();
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

  return (
    <div
      className="bg-white top-0 w-full z-50"
      style={{ position: "sticky", top: 0, zIndex: 999 }}
    >
      <div className="flex items-end justify-between mr-5 ml-5 lg:ml-20 lg:mr-20">
        <div className="flex items-center flex-grow">
          <img
            src={Assets.Logo}
            className="w-12 h-12 my-3 cursor-pointer"
            alt=""
            onClick={() => {
              dispatch(onChangeRoute(0));
              navigate(RoutesPath.home);
            }}
          />
          <div className="computer-only">
            <div className="hidden lg:block">
              <button
                onClick={openPopup}
                className="flex items-center gap-2 bg-[#F4F4F4] py-4 px-12 rounded-lg ml-5"
                style={{ width: "300px" }}
              >
                <CiSearch className="text-[#A9A9A9]" size={20} />
                <p className="text-[#A9A9A9] text-sm">Search people & posts</p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden ml-5 mr-5">
            <div
              className="bg-[#f4f4f4] rounded-full p-2 cursor-pointer"
              onClick={openPopup}
            >
              <CiSearch
                className="text-[#333333]"
                size={23}
                style={{ strokeWidth: 1 }}
              />
            </div>
          </div>
          <ComputerTopNav
            currentRoute={currentRoute}
            unseenNotification={profile?.profile!.unReadCount! > 0}
            unseenChat={
              !!chats.find(
                (fd) => fd.senderUid !== profile?.profile!.uid && !fd.seen
              )
            }
          />
        </div>
      </div>
      <div
        style={{
          height: "1.2px",
          width: "100%",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      {isPopupOpen && (
        <div className="overlay">
          <div className="popup" style={{ overflowY: "scroll" }}>
            <HomeSearch onClosePopup={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerHeader;
