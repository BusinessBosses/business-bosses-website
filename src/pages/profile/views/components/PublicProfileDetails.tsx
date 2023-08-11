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
interface Props {
  data: User;
}
const PublicProfileDetails = ({ data }: Props) => {
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
          <UserAvatar imageSize="h-20 w-20" imageURL={data.photoUrl} />
          <div className="">
            <p className="font-semibold flex items-center text-lg md:text-lg lg:text-lg capitalize">
              {truncatedName}
              {data.isSubscribed && (
                <div className="ml-1">
                  <Assets.Checkmark width={9} />
                </div>
              )}
            </p>
            <p className="text-lg font-medium">{data.category}</p>
            <p className="font-medium">{data.companyName}</p>
            <p className="text-sm font-light text-[#A9A9A9]">{data.location}</p>
          </div>
        </div>

        <div className="flex items-center justify-between my-5 mx-10">
          <button
            onClick={() =>
              navigate(RoutesPath.connections, {
                state: {
                  userId: data.uid,
                  pageIndex: 0,
                },
              })
            }
            className="text-center"
          >
            <p>{data.connectionCount}</p>
            <p className="text-xs font-semibold text-[#A9A9A9]">Connections</p>
          </button>
          <button
            onClick={() =>
              navigate(RoutesPath.connections, {
                state: {
                  userId: data.uid,
                  pageIndex: 1,
                },
              })
            }
            className="text-center"
          >
            <p>{data.connectedCount}</p>
            <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
          </button>
          <button
            onClick={() =>
              navigate(RoutesPath.connections, {
                state: {
                  userId: data.uid,
                  pageIndex: 2,
                },
              })
            }
            className="text-center"
          >
            <p>{data.referalCount}</p>
            <p className="text-xs font-semibold text-[#A9A9A9]">Referals</p>
          </button>
        </div>

        <div className=" flex items-center gap-3">
          {profile?.connecteds?.includes(data.uid) ? (
            <OutlinedButton
              onClick={connection}
              text="Connected"
              // icon={<BiEdit />}
              className="w-full border-[1px] py-1"
            />
          ) : (
            <FilledButton
              onClick={connection}
              text="Connect"
              // icon={<BiEdit />}
              className="w-full border-[1px] py-1"
            />
          )}
          <OutlinedButton
            onClick={() => {
              navigate(RoutesPath.ChatRoom, { state: { user: data } });
            }}
            text="Message"
            // icon={<img alt="" src={Assets.Coin} />}
            className="w-full border-[1px] py-1"
          />
          <OutlinedButton
            onClick={() => {
              navigate(RoutesPath.refer, { state: data.uid });
            }}
            text="Refer"
            // icon={<BsGraphUp />}
            className="w-full border-[1px] py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PublicProfileDetails;
