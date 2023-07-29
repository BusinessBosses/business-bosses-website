import React from "react";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import Assets from "../../../../assets";
import { BsGraphUp } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";

interface Props {
  data: User;
}

const ComputerProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);

  return (
    <div>
      <div className="mt-20 px-5 mobile-only">
        <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
};

export default ComputerProfileDetails;
