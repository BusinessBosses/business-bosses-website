import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useEffect, useRef, useState } from "react";
import Marketplacepopup from "../../../popups/Marketplacepopup";
import BossupPartnerstile from "../../../home/views/components/BopssupPartnerstile";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";

const MarketIntro = () => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    } else {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <div
        className="bg-[#EAEAEA] mobile-only px-4 py-3"
        style={{

        }}
      >
        <div className="flex items-center justify-between">
          <div onClick={openPopup} className="flex items-center gap-1">
            <p className="font-bold">Guidelines</p>
            <BsInfoCircle />
          </div>
          <FilledButtonsmall
            icon={<AiOutlinePlus color="white" size={20} />}
            onClick={() => {
              navigate(RoutesPath.CreateListing);
            }}
            text="Sell"
            className="px-7 py-3"
          />
        </div>

        <div className="mobile-only">
          {isPopupOpen && (
            <div className="overlay">
              <div ref={popupRef} className="mobilepopup" style={{ overflowY: "scroll" }}>
                <Marketplacepopup />
              </div>
            </div>

          )}

        </div>


        <div
          className="p-3 mt-2 rounded-2xl"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
              alt=""
              className="w-32 h-20 rounded-lg"
            />
            <p className="text-[#383838] text-sm">
              Ideas on how to create things easily
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <FiUsers className="text-primary" />
              <p className="text-primary underline text-sm font-bold">Members: (3)</p>
            </div>
            <div className="flex gap-2 items-center">
              <Assets.MarketPlace fill="#232324" width={15} />
              <p className="text-sm text-[#232324] font-bold">Listing (48)</p>
            </div>

            <button
              className="bg-white px-6 py-1.5 text-primary rounded-xl "
              style={{ border: "2px solid", borderColor: "primary" }} // Add the border style here
            >
              Join
            </button>
          </div>
        </div>

        <BossupPartnerstile bossupby={""} bossupad={""} />
      </div>



      <div className="computer-only">
        <div className="computer-only">
          {isPopupOpen && (
            <div className="overlay ">
              <div ref={popupRef} className="computerpopup" style={{ overflowY: "scroll" }}>
                <Marketplacepopup />
              </div>
            </div>)}
        </div>
        <div className="flex items-center pb-2">
          <div className="flex items-center">
            <p className="text-lg font-semibold text-[#333333]">Marketplace</p>
          </div>
          <div className="flex items-center ml-auto gap-1 " onClick={openPopup}>
            <p >Guidelines</p>
            <BsInfoCircle />
          </div>
        </div>
        <div
          className="bg-[#EAEAEA] rounded-2xl"
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          <div
            className="p-3 rounded-2xl"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
                alt=""
                className="w-32 h-20 rounded-lg"
              />
             
            </div>
            <p className="text-[#383838] mt-5  font-bold text-sm">
                Ideas on how to create things easily
              </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
              <Assets.Membersicon className="text-primary" stroke="#F21C29" fill="#F21C29" strokeWidth={0.5} />
                <p className="text-primary underline text-sm lg:text-base font-bold">Members: (3)</p>
              </div>
              <div className="flex items-center gap-1">
                <Assets.MarketPlace fill="black" width={15}/>
              <p className="text-sm text-[#232324] font-bold">Listing (48)</p>
              </div>
              
              <button
                className="bg-white px-6 py-1.5 text-primary rounded-xl "
                style={{ border: "2px solid", borderColor: "primary" }} // Add the border style here
              >
                Join
              </button>
            </div>
          </div>


        </div>



      </div>
    </div>
  );
};

export default MarketIntro;
