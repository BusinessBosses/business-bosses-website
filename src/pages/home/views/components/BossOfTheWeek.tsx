import Assets from "../../../../assets";
import { IoIosMore } from "react-icons/io";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { User } from "../../../../common/interfaces/user";
import { saveUserData } from "../../../../redux/slices/UserSlice";
import ConnectionsController from "../../../connections/controller/ConnectionsController";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { useEffect, useRef, useState } from "react";
import Bossoftheweekpopup from "../../../popups/Bossoftheweekpopup";
import BossupPartnerstile from "./BopssupPartnerstile";
import Bossuppartnerpage from "../../../bossuppartnerpage/bossuppartnerpage";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";
import OutlinedButtonsmall from "../../../../common/components/buttons/OutlinedButtonsmall";
import ComputerBossuppartnersection from "../../../bossuppartnerpage/computerbossupsection";
interface Props {
  bossOfTheWeek: User;
}
const MobileBossOfTheWeek = ({ bossOfTheWeek }: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const connection = async () => {
    if (profile?.connecteds?.includes(bossOfTheWeek.uid!)) {
      const newUserData: User = {
        ...profile,
        connecteds: profile.connecteds?.filter(
          (ft) => ft !== bossOfTheWeek.uid!
        ),
        connectedCount: (profile?.connectedCount ?? 0) - 1,
      };
      dispatch(saveUserData(newUserData));
      await ConnectionsController.disConnect(bossOfTheWeek.uid!);
    } else {
      const newUserData: User = {
        ...profile,
        connecteds: [...profile?.connecteds!, bossOfTheWeek.uid],
        connectedCount: (profile?.connectedCount ?? 0) + 1,
      } as User;
      dispatch(saveUserData(newUserData));
      await ConnectionsController.connect(bossOfTheWeek.uid!);
    }
  };
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

  return (
    <div>
      <div className="bg-[#EAEAEA] lg:bg-[#f4f4f4]  lg:rounded-2xl px-4 py-3" style={{}}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={Assets.Logo} className="w-10 h-10" alt="" />
            <p
              className="text-[#333333]  "
              style={{
                fontSize: 20, fontWeight: 900, fontFamily: 'NuniSans-Black, sans-serif',
                color: '#333333'
              }}
            >
              Boss of the week
            </p>
          </div>
          <IoIosMore size={23} onClick={openPopup} />
        </div>
        <div className="items-center gap-3 mt-2">
          <div className="flex items-center gap-3 mt-2">
            <div onClick={() =>
              navigate(RoutesPath.PublicUserProfile, { state: bossOfTheWeek })
            }>
              <UserAvatar imageSize="h-24 w-24" imageURL={bossOfTheWeek.photoUrl} />
            </div>
            <div className="w-3/4 ml-3">
              <p className="text-md text-[#333333] font-semibold">
                {bossOfTheWeek.name}
              </p>
              <p className="text-sm text-[#333333]">{bossOfTheWeek.category}</p>
              <p className="text-xs lg:text-base text-[#777777]">
                {bossOfTheWeek.bio!.length > 80
                  ? bossOfTheWeek.bio!.slice(0, 80) + '...'
                  : bossOfTheWeek.bio}
              </p>

              <div className="flex items-center gap-3 mt-2 mb-1 lg:mb-4">
                {!profile?.connecteds?.includes(bossOfTheWeek.uid!) ? (
                  <FilledButtonsmall
                    onClick={connection}
                    text="Connect"
                    className="px-2 py-1.5"
                  />
                ) : (
                  <FilledButtonsmall
                    onClick={connection}
                    text="Connected"
                    className="px-2 py-1.5"
                  />
                )}
                <OutlinedButtonsmall
                  onClick={() => {
                    navigate(RoutesPath.refer, { state: bossOfTheWeek.uid });
                  }}
                  text="Refer"
                  className="px-2 py-1.5"
                />
              </div>
            </div>
          </div>
          <div className="mobile-only">
            {isPopupOpen && (
              <div className="overlay">
                <div
                  ref={popupRef}
                  className="mobilepopup"
                  style={{ overflowY: "scroll" }}
                >
                  <Bossoftheweekpopup />
                </div>
              </div>
            )}
          </div>

          <div className="mobile-only">
            <BossupPartnerstile bossupby={""} bossupad={""} />
          </div>


        </div>






      </div>


      <div className="flex computer-only items-center mt-8">
        <div className="font-bold">Our Partners</div>
      </div>

      <div className=" computer-only mt-3">
        <ComputerBossuppartnersection />
      </div>
    </div>
  );
};

export default MobileBossOfTheWeek;
