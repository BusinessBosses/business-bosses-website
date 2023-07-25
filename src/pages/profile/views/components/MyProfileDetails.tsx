import React from "react";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import Assets from "../../../../assets";
import { BsGraphUp } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
interface Props {
  data: User;
}
const MyProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  return (
    <div>
    <div className="mt-20 px-5 mobile-only">
      <div className=" flex items-center gap-3">
        <UserAvatar
          imageSize="h-24 w-24"
          imageURL={
            data.photoUrl ??
            "https://cdn-icons-png.flaticon.com/128/149/149071.png"
          }
        />
        <div className="">
          <p className="text-xl font-semibold">{data.username}</p>
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
          icon={<img alt="" src={Assets.Coin} />}
          className="w-full border-[1px] py-1"
        />
        <OutlinedButton
          onClick={() => {}}
          text="Analyse"
          icon={<BsGraphUp />}
          className="w-full border-[1px] py-1"
        />
      </div>
    </div>

    <div className="mt-20 px-5 computer-only">
      <div className=" flex items-center gap-3">
        <UserAvatar
          imageSize="h-24 w-24"
          imageURL="https://cdn.pixabay.com/photo/2023/06/12/07/15/spider-8057853__340.jpg"
        />
        <div className="">
          <p className="text-xl font-semibold">Isaac Akin</p>
          <p className="text-lg font-medium">Consultant</p>
          <p className="font-medium">Digital Blogger</p>
          <p className="text-sm font-light text-[#A9A9A9]">United Kingdom</p>
        </div>
      </div>

      <div className="flex items-center justify-between my-5">
        <button
          onClick={() => navigate(RoutesPath.connections)}
          className="text-center"
        >
          <p>1</p>
          <p className="text-xs font-semibold text-[#A9A9A9]">Connections</p>
        </button>
        <button className="text-center">
          <p>1</p>
          <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
        </button>
        <button className="text-center">
          <p>1</p>
          <p className="text-xs font-semibold text-[#A9A9A9]">Referals</p>
        </button>
      </div>

      <div className=" flex items-center gap-3">
        <OutlinedButton
          onClick={() => {
            navigate(RoutesPath.editProfile);
          }}
          text="Edit"
          icon={<BiEdit size={20}/>}
          className="w-full border-[1px] py-3"
        />
        <OutlinedButton
          onClick={() => {
            navigate(RoutesPath.invite);
          }}
          text="Earn"
          icon={<img alt="" src={Assets.Coin} />}
          className="w-full border-[1px] py-2"
        />
        <OutlinedButton
          onClick={() => {}}
          text="Analyse"
          icon={<BsGraphUp size={15}/>}
          className="w-full border-[1px] py-2.5"
        />
      </div>
    </div>
    </div>
  );
};

export default MyProfileDetails;
