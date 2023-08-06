import React from "react";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
import Assets from "../../../../assets";
import { BsGraphUp, BsInfoCircle } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import Learning from "../../../communities/views/Learning";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";

interface Props {
  data: User;
}

const ComputerProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);

  // Function to handle the click event
  const handleProfileClick = () => {
    // Example: Navigate to a specific route when the profile is clicked
    navigate(RoutesPath.myProfile, { state: { userId: data.uid } });
  };

  return (
    <div style={{ cursor: "pointer", height: "100vh" , width: "100vh"  }}>
      {/* Make the entire component clickable */}
      <div className="mt-5 ">
        <div className="flex items-center gap-3">
          <div className="flex" onClick={handleProfileClick}>
            <UserAvatar
              imageSize="h-24 w-24"
              imageURL={
                data.photoUrl ??
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
            />
            <div className="ml-5">
              <p className="text-xl font-semibold">{data.username}</p>
              <p className="text-lg font-medium">{data.category}</p>
              <p className="font-medium">{data.companyName}</p>
              <p className="text-sm font-light text-[#A9A9A9]">{data.location}</p>
              <div className="flex items-center mt-1">
                <div className="bg-[#F4F4F4] rounded-full mr-3 flex items-center py-1 px-2">
                  <img src={Assets.Coin} alt="" className="w-4 h-4" />
                  <small className="ml-2">{data.coinscount}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2"><SubscribeButton /></div>
    
        <div>
          <div className="flex items-center mt-5 pb-2">
          <div>Connect Relevant People</div>
                      
          </div>
          <div className="pb-2"></div>
          <ConnectRelevant />
        </div>
      </div>
    </div>
  );
};

export default ComputerProfileDetails;