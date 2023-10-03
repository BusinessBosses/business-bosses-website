import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useEffect, useRef, useState } from "react";
import Marketplacepopup from "../../../popups/Marketplacepopup";
import BossupPartnerstile from "../../../home/views/components/BopssupPartnerstile";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { addMembersToState } from "../../../../redux/slices/MarketSlice";
import serviceApi from "../../../../services/serviceApi";
import Popup from "reactjs-popup";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import trimText from "../../../../common/functions/trimText";
import MarketMembers from "./MarketMembers";
import ComputerBossuppartnersection from "../../../bossuppartnerpage/computerbossupsection";

const MarketIntro = () => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState<boolean>(false);
  const market = useAppSelector((state) => state.market);
  const [didJoin, setDidJoin] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
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
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
    } else {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const joinIndustry = async () => {
    const membersIds = market.marketMembers.map((mp) => mp.uid);
    if (!!membersIds.includes(profile!.uid)) {
      const newJoinedUsers = market.marketMembers.filter(
        (ft) => ft.uid !== profile?.uid
      );
      dispatch(addMembersToState(newJoinedUsers));
      // setIndustry({ ...industry, joinedUsers: newJoinedUsers });
    } else {
      dispatch(addMembersToState([...market.marketMembers, profile!]));

      // setIndustry({
      //   ...industry,
      //   joinedUsers: [...industry?.joinedUsers!, profile!.uid],
      // });
    }
    await serviceApi.post(`/members`, {
      type: "marketplace",
    });
  };

  function showMarketMembersModal() {
    setOpenMembersModal(true);
  }

  useEffect(() => {
    const check = market.marketMembers.find((fd) => fd.uid === profile!.uid);

    if (check) {
      setDidJoin(true);
    } else {
      setDidJoin(false);
    }
  }, [market]);

  return (
    <div>
      <MarketMembers
        open={openMembersModal}
        members={market.marketMembers}
        onClose={() => setOpenMembersModal(false)}
      />
      <div className="bg-[#EAEAEA] mobile-only px-4 py-3" style={{}}>
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
              <div
                ref={popupRef}
                className="mobilepopup"
                style={{ overflowY: "scroll" }}
              >
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
              src="http://44.210.87.234/learningImages/marketplace.jpg"
              alt=""
              className="w-32 h-20 rounded-lg"
            />
            <p className="text-[#383838] my-2  font-bold text-sm">
              - Sell your products and services
            </p>
            <p className="text-[#383838]  my-2 font-bold text-sm">
              - Find Supplies
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <FiUsers className="text-primary" />
              <p
                onClick={showMarketMembersModal}
                className="text-primary cursor-pointer underline text-sm font-bold"
              >
                Members: ({market.marketMembers.length})
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Assets.MarketPlace fill="#232324" width={15} />
              <p className="text-sm text-[#232324] font-bold">
                Listing ({market.count})
              </p>
            </div>

            <button
              onClick={joinIndustry}
              className="bg-white px-6 py-1.5 text-primary rounded-xl "
              style={{ border: "2px solid", borderColor: "primary" }} // Add the border style here
            >
              {didJoin ? "Leave" : "Join"}
            </button>
          </div>
        </div>

        <BossupPartnerstile bossupby={""} bossupad={""} />
      </div>

      <div className="computer-only">
        <div className="computer-only">
          {isPopupOpen && (
            <div className="overlay ">
              <div
                ref={popupRef}
                className="computerpopup"
                style={{ overflowY: "scroll" }}
              >
                <Marketplacepopup />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center pb-2">
          <div className="flex items-center">
            <p className="text-lg font-semibold text-[#333333]">Marketplace</p>
          </div>
          <div className="flex items-center ml-auto gap-1 " onClick={openPopup}>
            <p>Guidelines</p>
            <BsInfoCircle />
          </div>
        </div>
        <div
          className="bg-[#f4f4f4] rounded-2xl"
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="flex items-center gap-3">
              <img
                src="http://44.210.87.234/learningImages/marketplace.jpg"
                alt=""
                className="w-32 h-20 rounded-lg"
              />
              <div className="">
                <p className="text-[#383838] my-2  font-bold text-sm">
                  - Sell your products and services
                </p>
                <p className="text-[#383838] my-2  font-bold text-sm">
                  - Find Supplies
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-1">
                <Assets.Membersicon
                  className="text-primary"
                  stroke="#F21C29"
                  fill="#F21C29"
                  strokeWidth={0.5}
                />
                <p
                  onClick={showMarketMembersModal}
                  className="text-primary underline cursor-pointer text-sm lg:text-base font-bold"
                >
                  Members: ({market.marketMembers.length})
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Assets.MarketPlace fill="black" width={15} />
                <p className="text-sm text-[#232324] font-bold">
                  Listing ({market.count})
                </p>
              </div>

              <button
                onClick={joinIndustry}
                className="bg-white px-6 py-1.5 text-primary rounded-xl "
                style={{ border: "2px solid", borderColor: "primary" }} // Add the border style here
              >
                {didJoin ? "Leave" : "Join"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="computer-only mt-5"><ComputerBossuppartnersection /></div>
    </div>
  );
};

export default MarketIntro;
