import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { saveUserData } from "../../../../redux/slices/UserSlice";
import ConnectionsController from "../../../connections/controller/ConnectionsController";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import Assets from "../../../../assets";
import UserAvatarbig from "../../../../common/components/avatars/UserAvatarbig";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";
interface Props {
  data: User;
}
const PublicProfileDetailonly = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const truncatedName = data.name && data.name.length > 20 ? `${data.name.slice(0, 20)}...` : data.name;
  const connection = async () => {
    if (profile?.connecteds?.includes(data.uid)) {
      const newUserData: User = {
        ...profile,
        connecteds: profile.connecteds?.filter((ft) => ft !== data?.uid),
      };
      dispatch(saveUserData(newUserData));
      await ConnectionsController.disConnect(data?.uid!);
    } else {
      const newUserData: User = {
        ...profile,
        connecteds: [...profile?.connecteds!, data?.uid],
      } as User;
      dispatch(saveUserData(newUserData));
      await ConnectionsController.connect(data?.uid!);
    }
  };
  return (
    <div>
      <div className="px-4">
        <div className=" flex items-center gap-3">
          <UserAvatarbig imageSize="h-20 w-20" imageURL={data.photoUrl} />
          <div className="">
            <p className="font-semibold flex items-center text-base md:text-lg lg:text-lg capitalize">
              {truncatedName}
              {data.isSubscribed && (
                <div className="ml-1">
                  <Assets.Checkmark width={9} />
                </div>
              )}
            </p>
            <p className="text-lg font-semibold text-sm">{data.category}</p>
            <p className="font-medium text-xs">{data.companyName}</p>
            <p className="text-xs font-light text-[#A9A9A9]">{data.location}</p>
          </div>
        </div>

        
       
      </div>
    </div>
  );
};

export default PublicProfileDetailonly;
