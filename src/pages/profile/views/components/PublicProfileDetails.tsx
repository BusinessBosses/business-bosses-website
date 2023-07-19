import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
interface Props {
  data: User;
}
const PublicProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="mt-20 px-5">
      <div className=" flex items-center gap-3">
        <UserAvatar
          imageSize="h-24 w-24"
          imageURL={
            data.photoUrl ??
            "https://cdn-icons-png.flaticon.com/128/149/149071.png"
          }
        />
        <div className="">
          <p className="text-xl font-semibold capitalize">{data.username}</p>
          <p className="text-lg font-medium">{data.category}</p>
          <p className="font-medium">{data.companyName}</p>
          <p className="text-sm font-light text-[#A9A9A9]">{data.location}</p>
        </div>
      </div>

      <div className="flex items-center justify-between my-5">
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
          <p>{data.connectedCount}</p>
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
        <OutlinedButton
          onClick={() => {}}
          text="Connect"
          // icon={<BiEdit />}
          className="w-full border-[1px] py-1"
        />
        <OutlinedButton
          onClick={() => {
            navigate(RoutesPath.ChatRoom, { state: { user: data } });
          }}
          text="Message"
          // icon={<img alt="" src={Assets.Coin} />}
          className="w-full border-[1px] py-1"
        />
        <OutlinedButton
          onClick={() => {}}
          text="Refer"
          // icon={<BsGraphUp />}
          className="w-full border-[1px] py-1"
        />
      </div>
    </div>
  );
};

export default PublicProfileDetails;
