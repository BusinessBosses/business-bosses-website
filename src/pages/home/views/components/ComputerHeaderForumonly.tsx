import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ComputerTopNav from "./ComputerTopNav";
import HomeSearch from "../../../search/views/HomeSearch";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { CiSearch } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { onChangeRoute } from "../../../../redux/slices/RouteSlice";
import Bossupsearch from "../../../communities/views/Bossupsearch";
import Marketplacesearchpopup from "../../../popups/Marketplacesearchpopup";
import { PartnerData } from "../../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../../common/interfaces/partnerdatatile";
import ComputerTopNavForumonly from "./ComputerTopNavForumonly";
import { Industry } from "../../../../common/interfaces/industry";
interface Props {
  onTapButton?: () => void;
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
  industry: string ;
  handleOpenModal: () => void; 
}

const ComputerHeaderForumonly = ({ onTapButton, partnerData, partnerDatatile, industry, handleOpenModal }: Props) => {
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

  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      navigate(RoutesPath.login)
    } else {

    }
  };

  return (
    <div
      className="bg-white top-0 w-full z-50"
      style={{ position: "sticky", top: 0, zIndex: 10 }}
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
                onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  handleButtonClick : openPopup}
                className="flex items-center gap-2 bg-[#F4F4F4] py-4 px-12 rounded-lg ml-5"
              >
                <CiSearch className="text-[#A9A9A9]" size={20} />
                {currentRoute === "/communities" ? (
                  <p className="text-[#A9A9A9] text-base">
                    Search groups & topics
                  </p>
                ) : currentRoute === "/market" ? (
                  <p className="text-[#A9A9A9] text-base">Search products</p>
                ) : currentRoute === "/chats" ? (
                  <p className="text-[#A9A9A9] text-base">Search chats</p>
                ) : (
                  <p className="text-[#A9A9A9] text-base">
                    Search people & posts
                  </p>
                )}
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
        </div>

        <ComputerTopNavForumonly
          onTapButton={() => {
            if (onTapButton) {
              onTapButton();
            }
          } }
          currentRoute={currentRoute}
          unseenNotification={profile?.profile!.unReadCount! > 0}
          unseenChat={!!chats.find(
            (fd) => fd.senderUid !== profile?.profile!.uid && !fd.seen
          )} partnerData={partnerData} partnerDatatile={partnerDatatile} industry={industry} handleOpenModal={handleOpenModal}  />
      </div>
      <div
        style={{
          height: "1.2px",
          width: "100%",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      {isPopupOpen &&
        (currentRoute === "/communities" ? (
          <div className="overlay">
            <div className="popup" >
              <Bossupsearch onClosePopup={closePopup} />
            </div>
          </div>
        ) : currentRoute === "/market" ? (
          <div className="overlay">
            <div className="popup" style={{ overflowY: "scroll" }}>
              <Marketplacesearchpopup onClosePopup={closePopup} />
            </div>
          </div>
        ) : (
          <div className="overlay">
            <div className="popup" style={{ overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}>

              <HomeSearch onClosePopup={closePopup} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ComputerHeaderForumonly;
