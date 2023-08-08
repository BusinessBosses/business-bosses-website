import React from "react";
import Assets from "../../../../assets";
import { IoIosMore } from "react-icons/io";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { User } from "../../../../common/interfaces/user";
import { saveUserData } from "../../../../redux/slices/UserSlice";
import ConnectionsController from "../../../connections/controller/ConnectionsController";
import RoutesPath from "../../../../constants/Routes";
interface Props {
  bossOfTheWeek: User;
}
const ComputerBossOfTheWeek = ({ bossOfTheWeek }: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
  return (
    <div className="bg-[#f4f4f4] p-5 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={Assets.Logo} className="w-10 h-10" alt="" />
          <p
            className="text-[#333333] text-2xl font-extrabold"
            style={{ fontWeight: "900", fontSize: 20 }}
          >
            Boss of the week
          </p>
        </div>
        <IoIosMore size={23} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <UserAvatar
          imageSize="h-24 w-24"
          isRanked
          imageURL={
            bossOfTheWeek.photoUrl ??
            "https://cdn-icons-png.flaticon.com/128/149/149071.png"
          }
        />
        <div className="w-3/4">
          <p className="text-md text-[#333333] font-semibold">
            {bossOfTheWeek.username}
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
              <OutlinedButton
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
    </div>
  );
};

export default ComputerBossOfTheWeek;
