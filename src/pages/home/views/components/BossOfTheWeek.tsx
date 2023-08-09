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
import { useEffect, useState } from "react";
import Bossoftheweekpopup from "../../../popups/Bossoftheweekpopup";
interface Props {
  bossOfTheWeek: User;
}
const MobileBossOfTheWeek = ({ bossOfTheWeek }: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    <div className="bg-[#EAEAEA] px-4 py-3" style={{}}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={Assets.Logo} className="w-10 h-10" alt="" />
          <p
            className="text-[#333333] nuniblack text-2xl "
            style={{ fontSize: 20 }}
          >
            Boss of the week
          </p>

        </div>
        <IoIosMore size={23} onClick={openPopup} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <UserAvatar
          imageSize="h-24 w-24"
          imageURL={
            bossOfTheWeek.photoUrl ??
            "https://cdn-icons-png.flaticon.com/128/149/149071.png"
          }
        />
        <div className="w-3/4 ml-3">
          <p className="text-md text-[#333333] font-semibold">
            {bossOfTheWeek.name}
          </p>
          <p className="text-sm text-[#333333]">{bossOfTheWeek.category}</p>
          <p className="text-xs text-[#777777]">{bossOfTheWeek.bio}</p>
          <div className="flex items-center gap-3 mt-2 mb-2 lg:mb-4">
            {!profile?.connecteds?.includes(bossOfTheWeek.uid!) ? (
              <FilledButton
                onClick={connection}
                text="Connect"
                className="px-2 py-1.5"
              />
            ) : (
              <FilledButton
                onClick={connection}
                text="Connected"
                className="px-2 py-1.5"
              />
            )}
            <OutlinedButton
              onClick={() => {
                navigate(RoutesPath.refer, { state: bossOfTheWeek.uid });
              }}
              text="Refer"
              className="px-2 py-1.5"
            />
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="overlay">
          <div className="popup" style={{ overflowY: "scroll" }}>
            <Bossoftheweekpopup/>
          </div>
        </div>
      )}

      <div className="mobile-only">
        <div className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2">
          <div className="flex items-center">
            <small
              className="text-xs text-[#545151] pr-2"
              style={{
                paddingRight: 10,
                borderRight: "1.2px solid rgba(0, 0, 0, 0.5)",
              }}
            >
              Boss Up by
            </small>
            <p className="text-[#545151] font-semibold text-sm pl-2 py-1">
              Business Bosses Company Limited{" "}
            </p>
          </div>
          <Assets.Nexticon className="text-[#232324]" width={20} />
        </div>
      </div>
    </div>

    
  );
};

export default MobileBossOfTheWeek;
