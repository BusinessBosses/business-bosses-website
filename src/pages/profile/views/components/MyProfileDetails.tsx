import React from "react";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import Assets from "../../../../assets";
import { BsGraphUp } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import UserAvatarbig from "../../../../common/components/avatars/UserAvatarbig";
interface Props {
  data: User;
}
const MyProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  const truncatedName = data.name && data.name.length > 20 ? `${data.name.slice(0, 20)}...` : data.name;
  const truncateduserName = data.username && data.username.length > 20 ? `${data.username.slice(0, 20)}...` : data.name;

  return (
    
    <div>
      <div className="mt-3">
        <div className=" flex items-center gap-3">
          <UserAvatarbig imageSize="h-20 w-20" imageURL={data.photoUrl}  />
          <div className="">
            <p className=" font-semibold flex items-center text-base md:text-lg lg:text-xl capitalize">
              {truncatedName ?? truncateduserName}
              {data.isSubscribed && (
                <div className="ml-1">
                  <Assets.Checkmark width={9} />
                </div>
              )}
            </p>
          
            <p className="text-sm font-semibold text-[#333333] lg:text-lg">{data.category}</p>
            <p className="font-medium text-xs lg:text-base">{data.companyName}</p>
            <p className="text-xs font-light text-[#A9A9A9] lg:text-sm">{data.location}</p>
            {!data.isSubscribed && (<div className="mt-2">
              <SubscribeButton />
            </div>)}
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
            <p className="font-bold">{data.connectionCount}</p>
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
            <p className="font-bold">{data.connecteds?.length}</p>
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
            <p className="font-bold">{data.referalCount}</p>
            <p className="text-xs font-semibold text-[#A9A9A9]">Referals</p>
          </button>
        </div>

        <div className=" flex items-center gap-3">
          <OutlinedButton
            onClick={() => {
              navigate(RoutesPath.editProfile);
            }}
            text="Edit"
            icon={<BiEdit />}
            className="w-full border-[1px] py-1"
          />
          <OutlinedButton
            onClick={() => {
              navigate(RoutesPath.invite);
            }}
            text="Earn"
            icon={<img alt="" src={Assets.Coin} width={18} />}
            className="w-full border-[1px] py-1"
          />
          <OutlinedButton
            onClick={() => {
              navigate(RoutesPath.analysepage);
            }}
            text="Analyse"
            icon={<BsGraphUp />}
            className="w-full border-[1px] py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfileDetails;
